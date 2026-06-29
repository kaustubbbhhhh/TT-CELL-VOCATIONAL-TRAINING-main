import os
import datetime
import secrets
import bcrypt
import jwt
from django.conf import settings
from django.contrib.auth.hashers import check_password as check_django_password
from django.utils import timezone
from apps.authentication.models import User, RefreshToken, AuditLog, BlacklistedToken
from core.exceptions import AuthenticationFailed, LockoutError, ValidationError, NotFoundError

# JWT Configurations
ACCESS_TOKEN_LIFETIME = datetime.timedelta(minutes=15)
REFRESH_TOKEN_LIFETIME = datetime.timedelta(days=7)
BCRYPT_PREFIXES = ('$2a$', '$2b$', '$2y$')

def is_bcrypt_hash(hashed: str) -> bool:
    """Return whether a stored password uses this app's bcrypt format."""
    return isinstance(hashed, str) and hashed.startswith(BCRYPT_PREFIXES)

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(password: str, hashed: str) -> bool:
    """Check if password matches bcrypt or a supported legacy Django hash."""
    if not isinstance(password, str) or not isinstance(hashed, str) or not hashed:
        return False

    if is_bcrypt_hash(hashed):
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
        except ValueError:
            return False

    try:
        return check_django_password(password, hashed)
    except (TypeError, ValueError):
        return False

class AuthService:
    """Service class encapsulating authentication, token management, and account security."""
    
    @staticmethod
    def _get_private_key():
        private_key_path = getattr(settings, 'JWT_PRIVATE_KEY_PATH', 'jwt_private.pem')
        if not os.path.exists(private_key_path):
            raise RuntimeError("JWT Private key file not found.")
        with open(private_key_path, 'r') as f:
            return f.read()

    @classmethod
    def issue_tokens(cls, user: User):
        """Issue access token (JWT) and database-backed refresh token."""
        # Generate Access Token (RS256)
        now = datetime.datetime.now(datetime.UTC).replace(tzinfo=None)
        payload = {
            'user_id': str(user.id),
            'email': user.email,
            'role': user.role,
            'trainee_id': user.trainee_id,
            'exp': now + ACCESS_TOKEN_LIFETIME,
            'iat': now,
        }
        
        private_key = cls._get_private_key()
        access_token = jwt.encode(payload, private_key, algorithm='RS256')

        # Generate Refresh Token (Cryptographic random string)
        refresh_token_str = secrets.token_urlsafe(64)
        expires_at = now + REFRESH_TOKEN_LIFETIME
        
        # Save to DB
        RefreshToken(
            token=refresh_token_str,
            user_id=str(user.id),
            expires_at=expires_at
        ).save()

        return access_token, refresh_token_str

    @classmethod
    def rotate_refresh_token(cls, old_token_str: str):
        """Rotate refresh token: invalidate old and issue new tokens."""
        try:
            token_doc = RefreshToken.objects.get(token=old_token_str)
        except RefreshToken.DoesNotExist:
            raise AuthenticationFailed("Invalid refresh token.")

        # Check if expired
        if token_doc.expires_at < datetime.datetime.now(datetime.UTC).replace(tzinfo=None):
            token_doc.delete()
            raise AuthenticationFailed("Refresh token has expired.")

        # Breach Detection: if token is already rotated, invalidate all tokens for this user!
        if token_doc.is_rotated:
            RefreshToken.objects(user_id=token_doc.user_id).delete()
            raise AuthenticationFailed("Refresh token reuse detected. Revoking all sessions.")

        # Mark as rotated
        token_doc.is_rotated = True
        token_doc.save()

        # Find user
        try:
            user = User.objects.get(id=token_doc.user_id, is_active=True)
        except User.DoesNotExist:
            raise AuthenticationFailed("User is inactive or deleted.")

        # Issue new tokens
        return cls.issue_tokens(user)

    @classmethod
    def login(cls, email: str, password: str, actor_ip: str = "0.0.0.0"):
        """Authenticate user, handle lockout threshold, and generate session tokens."""
        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid email or password.")

        now = datetime.datetime.now(datetime.UTC).replace(tzinfo=None)

        # Check if locked
        if user.locked_until:
            if user.locked_until > now:
                total_seconds = (user.locked_until - now).total_seconds()
                if total_seconds > 3600:
                    hours_left = int(total_seconds / 3600) + 1
                    raise LockoutError(f"Account is locked due to too many failed attempts. Try again in {hours_left} hours.")
                else:
                    minutes_left = int(total_seconds / 60) + 1
                    raise LockoutError(f"Account is locked due to too many failed attempts. Try again in {minutes_left} minutes.")
            else:
                # Lock has expired, reset state
                user.locked_until = None
                user.failed_attempts = 0
                user.save()

        # Verify password
        if not check_password(password, user.password_hash):
            user.failed_attempts += 1
            if user.failed_attempts >= 5:
                user.locked_until = now + datetime.timedelta(hours=24)
                user.save()
                
                # Audit log for lockout
                AuditLog(
                    actor_id=str(user.id),
                    action="ACCOUNT_LOCKOUT",
                    target_type="User",
                    target_id=str(user.id),
                    after_state={"locked_until": user.locked_until.isoformat()}
                ).save()
                
                raise LockoutError("Account has been locked for 24 hours due to 5 consecutive failures.")
            
            user.save()
            raise AuthenticationFailed("Invalid email or password.")

        # Success - reset failed attempts
        if not is_bcrypt_hash(user.password_hash):
            user.password_hash = hash_password(password)
        user.failed_attempts = 0
        user.locked_until = None
        user.save()

        # Issue tokens
        access_token, refresh_token = cls.issue_tokens(user)

        # Audit log for login
        AuditLog(
            actor_id=str(user.id),
            action="LOGIN_SUCCESS",
            target_type="User",
            target_id=str(user.id)
        ).save()

        return user, access_token, refresh_token

    @staticmethod
    def logout(token_str: str, access_token_str: str = None):
        """Invalidate refresh token upon logout."""
        RefreshToken.objects(token=token_str).delete()
        if access_token_str:
            AuthService.blacklist_access_token(access_token_str)

    @staticmethod
    def blacklist_access_token(access_token_str: str):
        if not access_token_str:
            return
        try:
            parts = access_token_str.split('.')
            if len(parts) != 3:
                return
            signature = parts[2]
            
            # Check if already blacklisted
            if BlacklistedToken.objects(token_signature=signature).first():
                return
                
            public_key_path = getattr(settings, 'JWT_PUBLIC_KEY_PATH', 'jwt_public.pem')
            with open(public_key_path, 'r') as f:
                public_key = f.read()
                
            payload = jwt.decode(access_token_str, public_key, algorithms=['RS256'])
            expires_at = datetime.datetime.utcfromtimestamp(payload['exp'])
            
            BlacklistedToken(
                token_signature=signature,
                expires_at=expires_at
            ).save()
        except Exception as e:
            logging.error(f"Failed to blacklist token: {e}")

    @classmethod
    def change_password(cls, user_id: str, old_password: str, new_password: str, access_token_str: str = None):
        """Update password for an authenticated user, and revoke all active refresh tokens."""
        try:
            user = User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            raise NotFoundError("User not found.")

        # Check old password
        if not check_password(old_password, user.password_hash):
            raise ValidationError("Incorrect old password.", {"old_password": ["Incorrect old password."]})

        # Update password
        user.password_hash = hash_password(new_password)
        user.must_change_password = False
        user.save()

        # Revoke all refresh tokens for this user
        RefreshToken.objects(user_id=str(user.id)).delete()
        if access_token_str:
            cls.blacklist_access_token(access_token_str)

        # Audit log
        AuditLog(
            actor_id=user_id,
            action="PASSWORD_CHANGE",
            target_type="User",
            target_id=str(user.id)
        ).save()

    @classmethod
    def admin_reset_password(cls, admin_id: str, target_user_id: str, new_password: str, admin_access_token_str: str = None):
        """Allows an administrator to reset a user's password and flag it for mandatory change."""
        try:
            user = User.objects.get(id=target_user_id, is_active=True)
        except User.DoesNotExist:
            raise NotFoundError("User not found.")

        user.password_hash = hash_password(new_password)
        user.must_change_password = True
        user.save()

        # Invalidate target user's active sessions
        RefreshToken.objects(user_id=str(user.id)).delete()
        
        # Note: We cannot easily blacklist the target user's access token here without maintaining a mapping of user -> access tokens.
        # But we can blacklist the admin's token if we wanted to (though we don't want to log the admin out).
        # To truly invalidate target user's access tokens immediately, we could add a `tokens_revoked_at` field to User.
        # For now, we rely on the 15m expiration + refresh token revocation.

        # Audit log
        AuditLog(
            actor_id=admin_id,
            action="ADMIN_PASSWORD_RESET",
            target_type="User",
            target_id=str(user.id)
        ).save()

    @classmethod
    def create_user(cls, email: str, password_raw: str, role: str, full_name: str, trainee_id: str = None) -> User:
        """Create a user record with hashed password."""
        # Check uniqueness
        if User.objects(email=email, is_active=True).first():
            raise ValidationError("User with this email already exists.")

        user = User(
            email=email,
            password_hash=hash_password(password_raw),
            role=role,
            full_name=full_name,
            trainee_id=trainee_id,
            must_change_password=True
        )
        user.save()
        return user

    @classmethod
    def request_password_reset(cls, email: str):
        """Simulate sending a password reset email by generating a temporary password reset code."""
        # Find user by email or service_id (in our case service_id/username isn't separate from email, or we check both)
        user = User.objects(email=email, is_active=True).first()
        if not user:
            # Silence user enumeration attacks by pretending to succeed, but write no logs
            return "Reset token generated if user exists."

        # In a real environment, we would generate a unique secure token and email it.
        # We will generate a token and store it temporarily in a new model or just simulate it.
        # Since the user requested "forgot password also in authentication", we will support a mock token-based reset:
        # Let's generate a token and write it to AuditLog as notice
        reset_token = secrets.token_urlsafe(32)
        
        # Save token in RefreshToken collection with a specific user_id prefix, or simply save in the audit logs.
        # Let's use RefreshToken and set it as a short expiration (e.g. 15 minutes) with token string "reset_<token>".
        expires_at = datetime.datetime.now(datetime.UTC).replace(tzinfo=None) + datetime.timedelta(minutes=15)
        RefreshToken(
            token=f"reset_{reset_token}",
            user_id=str(user.id),
            expires_at=expires_at
        ).save()

        AuditLog(
            actor_id=str(user.id),
            action="PASSWORD_RESET_REQUESTED",
            target_type="User",
            target_id=str(user.id),
            after_state={"reset_token": reset_token}
        ).save()

        # Print to stdout or log for easy developer extraction
        print(f"PASSWORD RESET LINK GENERATED: /reset-password?token={reset_token}")
        return reset_token

    @classmethod
    def reset_password_with_token(cls, token: str, new_password: str):
        """Reset password using a valid reset token."""
        try:
            token_doc = RefreshToken.objects.get(token=f"reset_{token}")
        except RefreshToken.DoesNotExist:
            raise ValidationError("Invalid or expired password reset token.")

        if token_doc.expires_at < datetime.datetime.now(datetime.UTC).replace(tzinfo=None):
            token_doc.delete()
            raise ValidationError("Password reset token has expired.")

        try:
            user = User.objects.get(id=token_doc.user_id, is_active=True)
        except User.DoesNotExist:
            raise NotFoundError("User not found.")

        # Update password
        user.password_hash = hash_password(new_password)
        user.must_change_password = True
        user.save()

        # Delete the token used
        token_doc.delete()

        # Invalidate active sessions
        RefreshToken.objects(user_id=str(user.id)).delete()

        # Audit log
        AuditLog(
            actor_id=str(user.id),
            action="PASSWORD_RESET_SUCCESS",
            target_type="User",
            target_id=str(user.id)
        ).save()

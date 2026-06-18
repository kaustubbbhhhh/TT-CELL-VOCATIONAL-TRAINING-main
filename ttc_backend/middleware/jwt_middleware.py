import os
import json
import jwt
from django.http import JsonResponse
from django.conf import settings
from core.auth_user import AuthUser

# Public paths that do not require JWT authorization
PUBLIC_PATHS = [
    '/api/v1/health/',
    '/api/v1/auth/login/',
    '/api/v1/auth/refresh/',
    '/api/v1/auth/forgot-password/',
    '/api/v1/auth/reset-password-token/',
]

class JWTMiddleware:
    """Middleware to validate RS256 JWT bearer tokens on all non-public API endpoints."""
    def __init__(self, get_response):
        self.get_response = get_response
        self.public_key = None
        self._load_public_key()

    def _load_public_key(self):
        public_key_path = getattr(settings, 'JWT_PUBLIC_KEY_PATH', 'jwt_public.pem')
        if os.path.exists(public_key_path):
            with open(public_key_path, 'r') as f:
                self.public_key = f.read()

    def __call__(self, request):
        path = request.path
        
        # Check if the path is marked public (bypass JWT check)
        normalized_path = path if path.endswith('/') else path + '/'
        is_public = normalized_path in PUBLIC_PATHS
        if is_public:
            request.user = None
            return self.get_response(request)

        # Retrieve the authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return self._unauthorized_response("Authorization header is missing.")

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return self._unauthorized_response("Authorization header must be in the format: Bearer <Token>.")

        token = parts[1]

        # Lazy load public key if not yet loaded (e.g. if generated after start)
        if not self.public_key:
            self._load_public_key()
            if not self.public_key:
                return JsonResponse({
                    "error_code": "INTERNAL_SERVER_ERROR",
                    "message": "JWT Public key not found on server.",
                    "details": {}
                }, status=500)

        try:
            # Decode using RS256 algorithm
            payload = jwt.decode(token, self.public_key, algorithms=['RS256'])
        except jwt.ExpiredSignatureError:
            return self._unauthorized_response("Token has expired.", "TOKEN_EXPIRED")
        except jwt.InvalidTokenError as e:
            return self._unauthorized_response(f"Invalid token: {str(e)}", "INVALID_TOKEN")

        # Extracted claims
        user_id = payload.get('user_id')
        email = payload.get('email')
        role = payload.get('role')
        trainee_id = payload.get('trainee_id')  # Might be null if admin

        if not user_id or not email or not role:
            return self._unauthorized_response("Token payload is missing required claims.")

        # Instantiate lightweight user entity and attach to request
        auth_user = AuthUser(user_id=user_id, email=email, role=role, is_active=True)
        # Store trainee_id directly on the user object for permission checks
        auth_user.trainee_id = trainee_id

        request.user = auth_user

        return self.get_response(request)

    def _unauthorized_response(self, message, error_code="AUTHENTICATION_FAILED"):
        return JsonResponse({
            "error_code": error_code,
            "message": message,
            "details": {}
        }, status=401)

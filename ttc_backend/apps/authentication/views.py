from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from core.responses import success_response, error_response
from core.permissions import IsAuthenticatedUser, IsAdminUser
from apps.authentication.services import AuthService
from apps.authentication.serializers import (
    LoginSerializer, ChangePasswordSerializer, ResetPasswordSerializer,
    ForgotPasswordSerializer, ResetPasswordTokenSerializer, UserSerializer
)

class HealthCheckView(APIView):
    """Public health check endpoint returning server status."""
    permission_classes = []
    
    def get(self, request):
        return success_response(data={"status": "ok"}, message="Server is healthy.")

class LoginView(APIView):
    """Authenticate user with email and password, setting HttpOnly refresh cookie."""
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Get client IP
        ip_addr = request.META.get('REMOTE_ADDR', '0.0.0.0')
        
        user, access_token, refresh_token = AuthService.login(email, password, ip_addr)
        
        # Format response
        user_data = UserSerializer(user).data
        response = success_response(
            data={"access_token": access_token, "user": user_data},
            message="Logged in successfully."
        )
        
        # Set refresh token in HttpOnly cookie
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=not settings.DEBUG,  # HTTPS in production
            samesite='Strict',
            max_age=7 * 24 * 60 * 60  # 7 days
        )
        
        return response

class RefreshTokenView(APIView):
    """Rotate refresh token to issue a new access token and refresh cookie."""
    permission_classes = []

    def post(self, request):
        # Extract refresh token from cookie
        refresh_token = request.COOKIES.get('refresh_token')
        
        # Fallback to request body if cookie isn't present (for testing flexibility)
        if not refresh_token:
            refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return error_response(
                error_code="AUTHENTICATION_FAILED",
                message="Refresh token is missing.",
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        access_token, new_refresh_token = AuthService.rotate_refresh_token(refresh_token)

        response = success_response(
            data={"access_token": access_token},
            message="Token refreshed successfully."
        )

        response.set_cookie(
            key='refresh_token',
            value=new_refresh_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Strict',
            max_age=7 * 24 * 60 * 60
        )

        return response

class LogoutView(APIView):
    """Revoke refresh token and clear cookie."""
    permission_classes = [IsAuthenticatedUser]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            refresh_token = request.data.get('refresh_token')

        if refresh_token:
            AuthService.logout(refresh_token)

        response = success_response(message="Logged out successfully.")
        response.delete_cookie('refresh_token')
        return response

class ChangePasswordView(APIView):
    """Change own password for authenticated users."""
    permission_classes = [IsAuthenticatedUser]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        AuthService.change_password(
            user_id=request.user.id,
            old_password=serializer.validated_data['old_password'],
            new_password=serializer.validated_data['new_password']
        )

        response = success_response(message="Password updated successfully.")
        # Clear cookies to force re-login since all refresh tokens are revoked
        response.delete_cookie('refresh_token')
        return response

class AdminResetPasswordView(APIView):
    """Admin endpoint to force-reset a trainee's password."""
    permission_classes = [IsAdminUser]

    def post(self, request, target_user_id):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        AuthService.admin_reset_password(
            admin_id=request.user.id,
            target_user_id=target_user_id,
            new_password=serializer.validated_data['new_password']
        )

        return success_response(message="Trainee password reset successfully.")

class ForgotPasswordView(APIView):
    """Public endpoint to request password reset token."""
    permission_classes = []

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reset_token = AuthService.request_password_reset(
            email=serializer.validated_data['email']
        )

        # In a development environment, returning the token facilitates testing
        data = {}
        if settings.DEBUG:
            data = {"reset_token": reset_token}

        return success_response(
            data=data,
            message="If the email exists, a password reset link has been generated."
        )

class ResetPasswordTokenView(APIView):
    """Public endpoint to submit a new password using a reset token."""
    permission_classes = []

    def post(self, request):
        serializer = ResetPasswordTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        AuthService.reset_password_with_token(
            token=serializer.validated_data['token'],
            new_password=serializer.validated_data['new_password']
        )

        return success_response(message="Password reset successfully.")

from django.urls import path
from apps.authentication.views import (
    LoginView, RefreshTokenView, LogoutView, ChangePasswordView,
    AdminResetPasswordView, ForgotPasswordView, ResetPasswordTokenView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth_login'),
    path('refresh/', RefreshTokenView.as_view(), name='auth_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    path('reset-password/<str:target_user_id>/', AdminResetPasswordView.as_view(), name='auth_admin_reset_password'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='auth_forgot_password'),
    path('reset-password-token/', ResetPasswordTokenView.as_view(), name='auth_reset_password_token'),
]

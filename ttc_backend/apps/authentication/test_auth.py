import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.authentication.models import User, RefreshToken
from apps.authentication.services import check_password, AuthService

pytestmark = pytest.mark.django_db

def test_login_success(admin_user):
    client = APIClient()
    url = reverse('auth_login')
    response = client.post(url, {"email": "admin@ttcell", "password": "password"}, format='json')
    
    assert response.status_code == 200
    assert "access_token" in response.data['data']
    assert response.data['data']['user']['email'] == "admin@ttcell"
    assert 'refresh_token' in response.cookies

def test_login_invalid_credentials(admin_user):
    client = APIClient()
    url = reverse('auth_login')
    response = client.post(url, {"email": "admin@ttcell", "password": "wrongpassword"}, format='json')
    
    assert response.status_code == 401
    assert response.data['error_code'] == "AUTHENTICATION_FAILED"

def test_login_lockout(admin_user):
    client = APIClient()
    url = reverse('auth_login')
    
    # 5 failed attempts
    for _ in range(5):
        client.post(url, {"email": "admin@ttcell", "password": "wrongpassword"}, format='json')
        
    # 6th attempt should be locked out
    response = client.post(url, {"email": "admin@ttcell", "password": "password"}, format='json')
    assert response.status_code == 423
    assert response.data['error_code'] == "ACCOUNT_LOCKED"

def test_token_refresh_and_rotation(admin_user):
    client = APIClient()
    _, refresh_token = AuthService.issue_tokens(admin_user)
    
    url = reverse('auth_refresh')
    response = client.post(url, {"refresh_token": refresh_token}, format='json')
    
    assert response.status_code == 200
    assert "access_token" in response.data['data']
    assert 'refresh_token' in response.cookies
    
    # Old token should be marked rotated
    old_token_doc = RefreshToken.objects.get(token=refresh_token)
    assert old_token_doc.is_rotated is True

def test_token_rotation_reuse_revokes_sessions(admin_user):
    client = APIClient()
    _, refresh_token = AuthService.issue_tokens(admin_user)
    
    url = reverse('auth_refresh')
    # First refresh
    client.post(url, {"refresh_token": refresh_token}, format='json')
    
    # Clear cookies so the second call doesn't use the new cookie from the first response
    client.cookies.clear()
    
    # Second refresh using same token (reuse!)
    response = client.post(url, {"refresh_token": refresh_token}, format='json')
    assert response.status_code == 401
    
    # All tokens should be deleted for this user
    assert RefreshToken.objects(user_id=str(admin_user.id)).count() == 0

def test_logout_clears_session(admin_user, auth_headers_admin):
    client = APIClient()
    _, refresh_token = AuthService.issue_tokens(admin_user)
    
    url = reverse('auth_logout')
    client.cookies['refresh_token'] = refresh_token
    
    response = client.post(url, **auth_headers_admin)
    assert response.status_code == 200
    assert RefreshToken.objects(token=refresh_token).count() == 0

def test_change_password_success(admin_user, auth_headers_admin):
    client = APIClient()
    url = reverse('auth_change_password')
    
    response = client.post(url, {
        "old_password": "password",
        "new_password": "newpassword123",
        "confirm_password": "newpassword123"
    }, format='json', **auth_headers_admin)
    
    assert response.status_code == 200
    
    # Verify DB update
    updated_user = User.objects.get(id=admin_user.id)
    assert check_password("newpassword123", updated_user.password_hash)

def test_admin_reset_password(admin_user, trainee_user, auth_headers_admin):
    client = APIClient()
    url = reverse('auth_admin_reset_password', kwargs={"target_user_id": str(trainee_user.id)})
    
    response = client.post(url, {"new_password": "resetpassword123"}, format='json', **auth_headers_admin)
    assert response.status_code == 200
    
    updated_trainee = User.objects.get(id=trainee_user.id)
    assert check_password("resetpassword123", updated_trainee.password_hash)
    assert updated_trainee.must_change_password is True

from django.test import override_settings

@override_settings(DEBUG=True)
def test_forgot_password_and_token_reset():
    # Create user via the service (creates and saves to DB)
    user = AuthService.create_user("resetme@ttcell", "oldpassword", "trainee", "Reset Me")
    
    client = APIClient()
    
    # 1. Request reset link (forgot password)
    url_forgot = reverse('auth_forgot_password')
    response_forgot = client.post(url_forgot, {"email": "resetme@ttcell"}, format='json')
    assert response_forgot.status_code == 200
    
    token = response_forgot.data['data']['reset_token']
    assert token is not None
    
    # 2. Reset password using the token
    url_reset = reverse('auth_reset_password_token')
    response_reset = client.post(url_reset, {
        "token": token,
        "new_password": "newresetpassword123"
    }, format='json')
    assert response_reset.status_code == 200
    
    # Verify password changed
    updated_user = User.objects.get(email="resetme@ttcell")
    assert check_password("newresetpassword123", updated_user.password_hash)

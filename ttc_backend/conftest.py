import pytest
import datetime
from django.conf import settings
from mongoengine import connect, disconnect
from apps.authentication.models import User, RefreshToken, AuditLog, PortalSettings
from apps.authentication.services import AuthService, hash_password
from apps.trainees.models import Trainee
from apps.projects.models import Project, ProjectAssignment
from apps.attendance.models import AttendanceRecord
from apps.announcements.models import Announcement

@pytest.fixture(scope="session", autouse=True)
def mongo_connection():
    # Override settings for testing
    settings.MONGO_DATABASE_NAME = 'ttcell_test_db'
    settings.MONGO_HOST = 'localhost'
    settings.MONGO_PORT = 27017
    settings.MONGO_USERNAME = None
    settings.MONGO_PASSWORD = None
    
    disconnect(alias='default')
    connect('ttcell_test_db', host='localhost', port=27017, alias='default')
    yield
    disconnect(alias='default')

@pytest.fixture(autouse=True)
def clean_collections():
    """Clear all MongoDB collections between test runs to ensure isolation."""
    User.objects.delete()
    RefreshToken.objects.delete()
    AuditLog.objects.delete()
    Trainee.objects.delete()
    Project.objects.delete()
    ProjectAssignment.objects.delete()
    AttendanceRecord.objects.delete()
    Announcement.objects.delete()
    PortalSettings.objects.delete()


@pytest.fixture
def admin_user():
    user = User(
        email="admin@ttcell",
        password_hash=hash_password("password"),
        role="admin",
        full_name="ADM Sharma"
    )
    user.save()
    return user

@pytest.fixture
def trainee_doc():
    trainee = Trainee(
        roll_number="TT24-001",
        full_name="Rahul Verma",
        email="rahul.v@ttcell",
        domain="AI/ML",
        batch="Batch 2024-B"
    )
    trainee.save()
    return trainee

@pytest.fixture
def trainee_user(trainee_doc):
    user = User(
        email=trainee_doc.email,
        password_hash=hash_password("password"),
        role="trainee",
        full_name=trainee_doc.full_name,
        trainee_id=str(trainee_doc.id)
    )
    user.save()
    return user

@pytest.fixture
def auth_headers_admin(admin_user):
    access_token, _ = AuthService.issue_tokens(admin_user)
    return {"HTTP_AUTHORIZATION": f"Bearer {access_token}"}

@pytest.fixture
def auth_headers_trainee(trainee_user):
    access_token, _ = AuthService.issue_tokens(trainee_user)
    return {"HTTP_AUTHORIZATION": f"Bearer {access_token}"}

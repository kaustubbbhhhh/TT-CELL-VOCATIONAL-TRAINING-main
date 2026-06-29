import pytest
import datetime
from django.urls import reverse
from rest_framework.test import APIClient
from apps.trainees.models import Trainee
from apps.projects.models import Project, ProjectAssignment
from apps.attendance.models import AttendanceRecord
from apps.authentication.models import PortalSettings

pytestmark = pytest.mark.django_db

def test_analytics_view_success(admin_user, auth_headers_admin, batch_doc):
    # Setup some test data
    trainee = Trainee(
        roll_number="TT24-002",
        first_name="Meera",
        last_name="Rao",
        email="meera@ttcell",
        domain="Data Sci",
        batch_id=batch_doc,
        section="A"
    ).save()

    # Inactive trainee for dropout rate
    Trainee(
        roll_number="TT24-999",
        first_name="Dropout",
        last_name="Trainee",
        email="dropout@ttcell",
        domain="AI/ML",
        batch_id=batch_doc,
        section="A",
        is_active=False
    ).save()

    project = Project(
        project_code="TT24-DS-001",
        title="Predictive Placement Analytics",
        description="Dataset modeling",
        domain="Data Sci",
        team=3,
        progress=100,
        status="completed",
        score=95,
        stack=["Python", "Pandas"],
        created_by=str(admin_user.id)
    ).save()

    ProjectAssignment(
        project_id=project,
        trainee_id=trainee
    ).save()

    AttendanceRecord(
        trainee_id=trainee,
        date=datetime.datetime.now(datetime.UTC).replace(hour=0, minute=0, second=0, microsecond=0),
        session_name="Lab",
        status="present"
    ).save()

    client = APIClient()
    url = reverse('dashboard_analytics')
    response = client.get(url, **auth_headers_admin)

    assert response.status_code == 200
    data = response.data['data']
    assert data['total_trainees'] == 1
    assert data['completion_rate'] == 100.0
    assert data['dropout_rate'] == 50.0  # 1 active, 1 inactive -> 50%
    assert len(data['top_performers']) == 1
    assert data['top_performers'][0]['name'] == "Meera Rao"

def test_repository_view_success(admin_user, auth_headers_admin):
    Project(
        project_code="TT24-AI-001",
        title="Archived Project",
        description="Desc",
        domain="AI/ML",
        team=1,
        progress=100,
        status="completed",
        score=96,
        stack=["PyTorch"],
        created_by=str(admin_user.id),
        is_archived=True
    ).save()

    client = APIClient()
    url = reverse('dashboard_repository')
    response = client.get(url, **auth_headers_admin)

    assert response.status_code == 200
    data = response.data['data']
    assert data['total_count'] == 1
    assert data['projects'][0]['title'] == "Archived Project"
    assert data['projects'][0]['batch'] == "2024"

def test_settings_view_success(admin_user, auth_headers_admin):
    client = APIClient()
    url = reverse('dashboard_settings')

    # GET
    response = client.get(url, **auth_headers_admin)
    assert response.status_code == 200
    assert response.data['data']['org_name'] == "TT Cell — Army Base Workshop"

    # PUT
    update_data = {
        "org_name": "Updated Organization",
        "batch_identifier": "Batch 2025-A",
        "min_attendance_threshold": 80,
        "academic_year": "2025-2026",
        "email_at_risk_alerts": False
    }
    response = client.put(url, update_data, format='json', **auth_headers_admin)
    assert response.status_code == 200
    assert response.data['data']['org_name'] == "Updated Organization"
    assert response.data['data']['min_attendance_threshold'] == 80
    assert response.data['data']['email_at_risk_alerts'] is False

def test_reports_view_success(admin_user, auth_headers_admin, batch_doc):
    # Setup some test data
    Trainee(
        roll_number="TT24-002",
        first_name="Meera",
        last_name="Rao",
        email="meera@ttcell",
        domain="Data Sci",
        batch_id=batch_doc,
        section="A"
    ).save()

    client = APIClient()
    url = reverse('dashboard_reports')

    response = client.post(url, {"report_type": "Attendance Report"}, format='json', **auth_headers_admin)
    assert response.status_code == 200
    assert response['Content-Type'] == 'text/csv'
    assert "Meera Rao" in response.content.decode()

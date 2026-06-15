import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.projects.models import Project, ProjectAssignment

pytestmark = pytest.mark.django_db

@pytest.fixture
def project_doc(admin_user):
    p = Project(
        project_code="TT24-AI-001",
        title="Edge AI Surveillance System",
        description="YOLOv8 real-time object detection.",
        domain="AI/ML",
        created_by=str(admin_user.id)
    )
    p.save()
    return p

def test_project_list_create(auth_headers_admin):
    client = APIClient()
    url = reverse('projects_list_create')
    
    # 1. List projects
    response_list = client.get(url, **auth_headers_admin)
    assert response_list.status_code == 200
    
    # 2. Create project
    payload = {
        "project_code": "TT24-CY-002",
        "title": "Red Team Simulation Framework",
        "description": "Automated penetration testing SCADA toolkit.",
        "domain": "Cyber Sec",
        "team": 3,
        "stack": ["Python", "Kali"]
    }
    response_create = client.post(url, payload, format='json', **auth_headers_admin)
    assert response_create.status_code == 201
    assert response_create.data['data']['project_code'] == "TT24-CY-002"
    assert Project.objects(project_code="TT24-CY-002").first() is not None

def test_archive_project(auth_headers_admin, project_doc):
    client = APIClient()
    url_archive = reverse('projects_archive', kwargs={"pk": str(project_doc.id)})
    
    response = client.post(url_archive, **auth_headers_admin)
    assert response.status_code == 200
    assert response.data['data']['is_archived'] is True
    
    # Unarchive
    url_unarchive = reverse('projects_unarchive', kwargs={"pk": str(project_doc.id)})
    response_un = client.post(url_unarchive, **auth_headers_admin)
    assert response_un.status_code == 200
    assert response_un.data['data']['is_archived'] is False

def test_project_assignments(auth_headers_admin, project_doc, trainee_doc):
    client = APIClient()
    url_assign = reverse('projects_assign', kwargs={"pk": str(project_doc.id)})
    
    # 1. Assign trainee
    payload = {
        "trainee_ids": [str(trainee_doc.id)],
        "deadline_override": "2026-08-01T00:00:00Z"
    }
    response_assign = client.post(url_assign, payload, format='json', **auth_headers_admin)
    assert response_assign.status_code == 200
    assert response_assign.data['data']['created'] == 1
    
    # Verify assignment exists in DB
    assert ProjectAssignment.objects(project_id=project_doc, trainee_id=trainee_doc).count() == 1
    
    # 2. List assignments
    url_list = reverse('projects_list_assignments', kwargs={"pk": str(project_doc.id)})
    response_list = client.get(url_list, **auth_headers_admin)
    assert response_list.status_code == 200
    assert response_list.data['data'][0]['trainee']['roll_number'] == trainee_doc.roll_number
    
    # 3. Remove assignment
    url_remove = reverse('projects_remove_assignment', kwargs={
        "pk": str(project_doc.id),
        "trainee_id": str(trainee_doc.id)
    })
    response_remove = client.delete(url_remove, **auth_headers_admin)
    assert response_remove.status_code == 200
    assert ProjectAssignment.objects(project_id=project_doc, trainee_id=trainee_doc).count() == 0

def test_assign_to_archived_project_fails(auth_headers_admin, project_doc, trainee_doc):
    client = APIClient()
    
    # Archive first
    project_doc.is_archived = True
    project_doc.save()
    
    url_assign = reverse('projects_assign', kwargs={"pk": str(project_doc.id)})
    payload = {"trainee_ids": [str(trainee_doc.id)]}
    
    response = client.post(url_assign, payload, format='json', **auth_headers_admin)
    assert response.status_code == 409
    assert response.data['error_code'] == "CONFLICT_ERROR"

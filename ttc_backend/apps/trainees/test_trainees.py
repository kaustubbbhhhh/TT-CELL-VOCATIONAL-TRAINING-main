import pytest
import io
from django.urls import reverse
from rest_framework.test import APIClient
from apps.trainees.models import Trainee
from apps.authentication.models import User

pytestmark = pytest.mark.django_db

def test_trainee_list_requires_admin(auth_headers_trainee):
    client = APIClient()
    url = reverse('trainees_list_create')
    response = client.get(url, **auth_headers_trainee)
    assert response.status_code == 403

def test_create_trainee_success(auth_headers_admin):
    client = APIClient()
    url = reverse('trainees_list_create')
    payload = {
        "roll_number": "CS2024001",
        "full_name": "Jane Doe",
        "email": "jane@example.com",
        "domain": "Web Dev",
        "batch": "2024",
        "phone": "9876543210"
    }
    response = client.post(url, payload, format='json', **auth_headers_admin)
    assert response.status_code == 201
    assert response.data['data']['roll_number'] == "CS2024001"
    
    # Check linked Auth User created
    linked_user = User.objects(email="jane@example.com").first()
    assert linked_user is not None
    assert linked_user.role == 'trainee'
    assert linked_user.trainee_id == response.data['data']['id']

def test_create_trainee_duplicate_roll_number(auth_headers_admin, trainee_doc):
    client = APIClient()
    url = reverse('trainees_list_create')
    payload = {
        "roll_number": trainee_doc.roll_number, # Duplicate
        "full_name": "Jane Doe",
        "email": "jane@example.com",
        "domain": "Web Dev",
        "batch": "2024"
    }
    response = client.post(url, payload, format='json', **auth_headers_admin)
    assert response.status_code == 409
    assert response.data['error_code'] == "CONFLICT_ERROR"

def test_get_trainee_details_own_vs_other(trainee_doc, trainee_user, auth_headers_trainee):
    client = APIClient()
    
    # 1. Trainee views own details (Success)
    url_own = reverse('trainees_detail', kwargs={"pk": str(trainee_doc.id)})
    response_own = client.get(url_own, **auth_headers_trainee)
    assert response_own.status_code == 200
    
    # 2. Seed another trainee
    other_trainee = Trainee(
        roll_number="TT24-002",
        full_name="Priya Sharma",
        email="priya.s@ttcell",
        domain="Cyber Sec",
        batch="Batch 2024-B"
    ).save()
    
    # Trainee tries to view other trainee details (Forbidden)
    url_other = reverse('trainees_detail', kwargs={"pk": str(other_trainee.id)})
    response_other = client.get(url_other, **auth_headers_trainee)
    assert response_other.status_code == 403

def test_soft_delete_trainee(auth_headers_admin, trainee_doc, trainee_user):
    client = APIClient()
    url = reverse('trainees_detail', kwargs={"pk": str(trainee_doc.id)})
    
    response = client.delete(url, **auth_headers_admin)
    assert response.status_code == 200
    
    # Check soft deleted
    t = Trainee.objects.get(id=trainee_doc.id)
    assert t.is_active is False
    
    # Check associated user deactivated
    u = User.objects.get(id=trainee_user.id)
    assert u.is_active is False

def test_bulk_import_csv(auth_headers_admin):
    client = APIClient()
    url = reverse('trainees_bulk_import')
    
    csv_content = (
        "roll_number,full_name,email,domain,batch,phone\n"
        "TT24-099,Test Trainee One,one@ttcell,AI/ML,Batch 2024-B,9999999999\n"
        "TT24-100,Test Trainee Two,two@ttcell,Web Dev,Batch 2024-B,8888888888\n"
    )
    csv_file = io.BytesIO(csv_content.encode('utf-8'))
    csv_file.name = "trainees.csv"
    
    response = client.post(url, {"file": csv_file}, format='multipart', **auth_headers_admin)
    assert response.status_code == 200
    assert response.data['data']['created'] == 2
    
    # Verify DB
    assert Trainee.objects(roll_number="TT24-099").first() is not None
    assert User.objects(email="one@ttcell").first() is not None

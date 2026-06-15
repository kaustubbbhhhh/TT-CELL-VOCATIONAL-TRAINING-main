import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.attendance.models import AttendanceRecord

pytestmark = pytest.mark.django_db

def test_mark_and_get_attendance(auth_headers_admin, trainee_doc, auth_headers_trainee):
    client = APIClient()
    url = reverse('attendance_register')
    
    # 1. Mark attendance
    payload = {
        "trainee_id": str(trainee_doc.id),
        "date": "2026-06-15",
        "status": "present",
        "session_name": "AI/ML Lab · Room 4B",
        "time_in": "08:52",
        "notes": "Ontime"
    }
    response_mark = client.post(url, payload, format='json', **auth_headers_admin)
    assert response_mark.status_code == 201
    assert response_mark.data['data']['status'] == "present"
    
    # Verify in DB
    assert AttendanceRecord.objects(trainee_id=trainee_doc).count() == 1
    
    # 2. View attendance as Admin
    response_list_admin = client.get(url, {"trainee_id": str(trainee_doc.id)}, **auth_headers_admin)
    assert response_list_admin.status_code == 200
    assert len(response_list_admin.data['data']) == 1
    
    # 3. View own attendance as Trainee
    response_list_trainee = client.get(url, {"trainee_id": str(trainee_doc.id)}, **auth_headers_trainee)
    assert response_list_trainee.status_code == 200
    assert len(response_list_trainee.data['data']) == 1

def test_view_other_attendance_denied(auth_headers_trainee, trainee_doc):
    client = APIClient()
    url = reverse('attendance_register')
    
    # Seed another trainee
    other_trainee = pytest.importorskip("apps.trainees.models").Trainee(
        roll_number="TT24-002",
        full_name="Priya Sharma",
        email="priya.s@ttcell",
        domain="Cyber Sec",
        batch="Batch 2024-B"
    ).save()
    
    # Trainee tries to view other's history
    response = client.get(url, {"trainee_id": str(other_trainee.id)}, **auth_headers_trainee)
    assert response.status_code == 403

def test_bulk_mark_attendance(auth_headers_admin, trainee_doc):
    client = APIClient()
    url = reverse('attendance_bulk_mark')
    
    payload = {
        "date": "2026-06-15",
        "session_name": "Review Meeting",
        "records": [
            {
                "trainee_id": str(trainee_doc.id),
                "status": "absent",
                "notes": "Sick leave pending"
            }
        ]
    }
    response = client.post(url, payload, format='json', **auth_headers_admin)
    assert response.status_code == 200
    assert response.data['data']['marked'] == 1
    
    # Verify updated in DB
    record = AttendanceRecord.objects.get(trainee_id=trainee_doc)
    assert record.status == "absent"

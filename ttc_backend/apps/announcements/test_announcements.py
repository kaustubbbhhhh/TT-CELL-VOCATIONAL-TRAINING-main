import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.announcements.models import Announcement

pytestmark = pytest.mark.django_db

def test_announcement_create_list_and_delete(auth_headers_admin, auth_headers_trainee, trainee_doc):
    client = APIClient()
    url = reverse('announcements_list_create')
    
    # 1. Create announcement (Admin)
    payload = {
        "title": "Mandatory Medical Checkup",
        "body": "Mandatory health checkup in Block C.",
        "priority": "urgent",
        "target_audience": "All Batches",
        "is_draft": False
    }
    response_create = client.post(url, payload, format='json', **auth_headers_admin)
    assert response_create.status_code == 201
    assert response_create.data['data']['title'] == "Mandatory Medical Checkup"
    
    # Create a draft announcement
    payload_draft = {
        "title": "Draft Topic",
        "body": "This is a draft.",
        "priority": "normal",
        "target_audience": "All Batches",
        "is_draft": True
    }
    client.post(url, payload_draft, format='json', **auth_headers_admin)
    
    # Create a targeted announcement (other domain)
    payload_targeted = {
        "title": "Cyber Session",
        "body": "Cyber security practicals.",
        "priority": "normal",
        "target_audience": "Cyber Sec", # trainee_doc is in AI/ML
        "is_draft": False
    }
    client.post(url, payload_targeted, format='json', **auth_headers_admin)

    # 2. List announcements as Admin (Should see all 3)
    response_list_admin = client.get(url, **auth_headers_admin)
    assert response_list_admin.status_code == 200
    assert len(response_list_admin.data['data']) == 3
    
    # 3. List announcements as Trainee (Should only see 'All Batches' public announcement, no draft, no other targeted domain)
    response_list_trainee = client.get(url, **auth_headers_trainee)
    assert response_list_trainee.status_code == 200
    assert len(response_list_trainee.data['data']) == 1
    assert response_list_trainee.data['data'][0]['title'] == "Mandatory Medical Checkup"

    # 4. Delete announcement (Admin)
    ann_id = response_create.data['data']['id']
    url_detail = reverse('announcements_detail', kwargs={"pk": ann_id})
    response_delete = client.delete(url_detail, **auth_headers_admin)
    assert response_delete.status_code == 200
    
    # Verify soft deleted in DB
    ann = Announcement.objects.get(id=ann_id)
    assert ann.is_active is False

import pytest
from rest_framework.test import APIClient
from apps.trainees.models import Batch, Trainee

pytestmark = pytest.mark.django_db

@pytest.fixture
def clean_batches():
    Trainee.objects.delete()
    Batch.objects.delete()
    yield
    Trainee.objects.delete()
    Batch.objects.delete()

def test_create_batch_success(auth_headers_admin, clean_batches):
    client = APIClient()
    payload = {
        "batch_id": "B_2025",
        "batch_year": 2025,
        "batch_status": "active"
    }
    response = client.post('/api/v1/batches/', data=payload, format='json', **auth_headers_admin)
    assert response.status_code == 201
    assert response.data['data']['batch_id'] == "B_2025"
    assert Batch.objects.count() == 1

def test_create_batch_duplicate(auth_headers_admin, clean_batches, batch_doc):
    client = APIClient()
    payload = {
        "batch_id": batch_doc.batch_id,
        "batch_year": 2025
    }
    response = client.post('/api/v1/batches/', data=payload, format='json', **auth_headers_admin)
    assert response.status_code == 409

def test_list_batches(auth_headers_admin, clean_batches, batch_doc):
    client = APIClient()
    response = client.get('/api/v1/batches/', **auth_headers_admin)
    assert response.status_code == 200
    assert len(response.data['data']) >= 1

def test_update_batch(auth_headers_admin, clean_batches, batch_doc):
    client = APIClient()
    payload = {
        "batch_status": "completed"
    }
    response = client.patch(f'/api/v1/batches/{batch_doc.batch_id}/', data=payload, format='json', **auth_headers_admin)
    assert response.status_code == 200
    assert response.data['data']['batch_status'] == "completed"

def test_delete_batch_with_trainees(auth_headers_admin, clean_batches, batch_doc, trainee_doc):
    client = APIClient()
    # trainee_doc is linked to batch_doc
    response = client.delete(f'/api/v1/batches/{batch_doc.batch_id}/', **auth_headers_admin)
    assert response.status_code == 409  # Conflict because trainees exist

def test_delete_batch_success(auth_headers_admin, clean_batches):
    client = APIClient()
    b = Batch(batch_id="B_9999", batch_year=2024).save()
    response = client.delete(f'/api/v1/batches/{b.batch_id}/', **auth_headers_admin)
    assert response.status_code == 200
    
    b.reload()
    assert b.is_active == False

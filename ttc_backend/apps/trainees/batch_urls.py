from django.urls import path
from apps.trainees.views import BatchListCreateView, BatchDetailView

urlpatterns = [
    path('', BatchListCreateView.as_view(), name='batch_list_create'),
    path('<str:batch_id>/', BatchDetailView.as_view(), name='batch_detail'),
]

from django.urls import path
from apps.trainees.views import TraineeListCreateView, TraineeDetailView, TraineeBulkImportView

urlpatterns = [
    path('', TraineeListCreateView.as_view(), name='trainees_list_create'),
    path('bulk-import/', TraineeBulkImportView.as_view(), name='trainees_bulk_import'),
    path('<str:pk>/', TraineeDetailView.as_view(), name='trainees_detail'),
]

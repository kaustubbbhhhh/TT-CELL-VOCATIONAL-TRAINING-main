from django.urls import path
from apps.announcements.views import AnnouncementListCreateView, AnnouncementDetailView

urlpatterns = [
    path('', AnnouncementListCreateView.as_view(), name='announcements_list_create'),
    path('<str:pk>/', AnnouncementDetailView.as_view(), name='announcements_detail'),
]

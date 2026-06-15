from django.urls import path, include
from apps.authentication.views import HealthCheckView

urlpatterns = [
    path('api/v1/health/', HealthCheckView.as_view(), name='health_check'),
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/trainees/', include('apps.trainees.urls')),
    path('api/v1/projects/', include('apps.projects.urls')),
    path('api/v1/attendance/', include('apps.attendance.urls')),
    path('api/v1/announcements/', include('apps.announcements.urls')),
]

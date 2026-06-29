from django.urls import path, include
from apps.authentication.views import HealthCheckView
from apps.authentication.dashboard_views import (
    DashboardStatsView, TraineeDashboardStatsView,
    AnalyticsView, RepositoryView, SettingsView, ReportsView
)

urlpatterns = [
    path('api/v1/health/', HealthCheckView.as_view(), name='health_check'),
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/trainees/', include('apps.trainees.urls')),
    path('api/v1/batches/', include('apps.trainees.batch_urls')),
    path('api/v1/projects/', include('apps.projects.urls')),
    path('api/v1/attendance/', include('apps.attendance.urls')),
    path('api/v1/announcements/', include('apps.announcements.urls')),
    path('api/v1/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('api/v1/dashboard/trainee-stats/', TraineeDashboardStatsView.as_view(), name='trainee_dashboard_stats'),
    path('api/v1/dashboard/analytics/', AnalyticsView.as_view(), name='dashboard_analytics'),
    path('api/v1/dashboard/repository/', RepositoryView.as_view(), name='dashboard_repository'),
    path('api/v1/dashboard/settings/', SettingsView.as_view(), name='dashboard_settings'),
    path('api/v1/dashboard/reports/', ReportsView.as_view(), name='dashboard_reports'),
]


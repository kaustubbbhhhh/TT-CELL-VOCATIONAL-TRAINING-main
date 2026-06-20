from django.urls import path
from apps.projects.views import (
    ProjectListCreateView, ProjectDetailView, ProjectArchiveView, ProjectUnarchiveView,
    ProjectAssignmentView, ProjectRemoveAssignmentView
)

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='projects_list_create'),
    path('<str:pk>/', ProjectDetailView.as_view(), name='projects_detail'),
    path('<str:pk>/archive/', ProjectArchiveView.as_view(), name='projects_archive'),
    path('<str:pk>/unarchive/', ProjectUnarchiveView.as_view(), name='projects_unarchive'),
    path('<str:pk>/assignments/', ProjectAssignmentView.as_view(), name='projects_list_assignments'),
    path('<str:pk>/assign/', ProjectAssignmentView.as_view(), name='projects_assign'),
    path('<str:pk>/assign/<str:trainee_id>/', ProjectRemoveAssignmentView.as_view(), name='projects_remove_assignment'),
]

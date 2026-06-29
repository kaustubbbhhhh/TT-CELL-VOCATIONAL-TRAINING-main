from rest_framework.views import APIView
from rest_framework import status
from core.responses import success_response, error_response
from core.permissions import IsAdminUser
from core.pagination import StandardPagination
from apps.projects.models import Project
from apps.projects.serializers import (
    ProjectSerializer, ProjectAssignSerializer, ProjectAssignmentListSerializer
)
from apps.projects.services import ProjectService
from core.exceptions import ValidationError, NotFoundError

class ProjectListCreateView(APIView):
    """View to list projects (paginated & filtered) and create a project."""
    permission_classes = [IsAdminUser]
    pagination_class = StandardPagination

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        domain = request.query_params.get('domain', '').strip()
        status_filter = request.query_params.get('status', '').strip()
        is_archived_str = request.query_params.get('is_archived', 'false').lower()
        ordering = request.query_params.get('ordering', '-created_at').strip()

        # Build filter query
        query_filters = {}
        if is_archived_str == 'true':
            query_filters['is_archived'] = True
        elif is_archived_str == 'false':
            query_filters['is_archived'] = False

        if domain:
            query_filters['domain'] = domain
        if status_filter:
            query_filters['status'] = status_filter

        query_filters['is_active'] = True
        queryset = Project.objects(**query_filters)

        # Full-text search
        if q:
            queryset = queryset.search_text(q)

        # Ordering
        allowed_ordering = ['title', '-title', 'project_code', '-project_code', 'created_at', '-created_at']
        if ordering not in allowed_ordering:
            ordering = '-created_at'
        queryset = queryset.order_by(ordering)

        # Paginate
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        if page is not None:
            serializer = ProjectSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = ProjectSerializer(queryset, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        project = ProjectService.create_project(
            actor_id=request.user.id,
            data=serializer.validated_data
        )

        output_data = ProjectSerializer(project).data
        return success_response(
            data=output_data,
            message="Project created successfully.",
            status_code=status.HTTP_201_CREATED
        )

class ProjectDetailView(APIView):
    """View to retrieve, update, or delete a project."""
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return Project.objects.get(id=pk, is_active=True)
        except Exception:
            raise NotFoundError("Project not found.")

    def get(self, request, pk):
        project = self.get_object(pk)
        serializer = ProjectSerializer(project)
        return success_response(data=serializer.data)

    def put(self, request, pk):
        project = self.get_object(pk)
        serializer = ProjectSerializer(data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)

        updated = ProjectService.update_project(
            actor_id=request.user.id,
            project_id=pk,
            data=serializer.validated_data
        )
        return success_response(data=ProjectSerializer(updated).data, message="Project updated successfully.")

    def patch(self, request, pk):
        project = self.get_object(pk)
        serializer = ProjectSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        updated = ProjectService.update_project(
            actor_id=request.user.id,
            project_id=pk,
            data=serializer.validated_data
        )
        return success_response(data=ProjectSerializer(updated).data, message="Project partially updated successfully.")

    def delete(self, request, pk):
        # We don't hard delete; we soft-delete
        project = self.get_object(pk)
        project.soft_delete()
        
        # Soft delete triggers cascade deletes on assignments automatically if needed
        # Or we do it manually. Let's keep assignments unless we need to archive.
        return success_response(message="Project soft-deleted successfully.")

class ProjectArchiveView(APIView):
    """View to archive a project."""
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        project = ProjectService.archive_project(request.user.id, pk)
        return success_response(data=ProjectSerializer(project).data, message="Project archived successfully.")

class ProjectUnarchiveView(APIView):
    """View to unarchive a project."""
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        project = ProjectService.unarchive_project(request.user.id, pk)
        return success_response(data=ProjectSerializer(project).data, message="Project unarchived successfully.")

class ProjectAssignmentView(APIView):
    """View to list or add assignments for a project."""
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        assignments = ProjectService.list_assignments(pk)
        serializer = ProjectAssignmentListSerializer(assignments, many=True)
        return success_response(data=serializer.data)

    def post(self, request, pk):
        serializer = ProjectAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = ProjectService.assign_trainees(
            actor_id=request.user.id,
            project_id=pk,
            trainee_ids=serializer.validated_data['resolved_trainee_ids'],
            deadline_override=serializer.validated_data.get('deadline_override')
        )
        return success_response(data=result, message="Assignment completed.")

class ProjectRemoveAssignmentView(APIView):
    """View to remove an assigned trainee from a project."""
    permission_classes = [IsAdminUser]

    def delete(self, request, pk, trainee_id):
        ProjectService.remove_assignment(
            actor_id=request.user.id,
            project_id=pk,
            trainee_id=trainee_id
        )
        return success_response(message="Trainee assignment removed successfully.")

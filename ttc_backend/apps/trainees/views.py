from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from core.responses import success_response, error_response
from core.permissions import IsAdminUser, IsAdminOrOwnTrainee
from core.pagination import StandardPagination
from apps.trainees.models import Trainee
from apps.trainees.serializers import TraineeSerializer, BulkImportResponseSerializer
from apps.trainees.services import TraineeService
from core.exceptions import ValidationError

class TraineeListCreateView(APIView):
    """View to list active trainees (paginated & filtered) and create a trainee."""
    permission_classes = [IsAdminUser]
    pagination_class = StandardPagination
    parser_classes = [JSONParser]

    def get(self, request):
        # Query params
        q = request.query_params.get('q', '').strip()
        domain = request.query_params.get('domain', '').strip()
        batch = request.query_params.get('batch', '').strip()
        is_active_str = request.query_params.get('is_active', 'true').lower()
        ordering = request.query_params.get('ordering', '-created_at').strip()

        # Build filter query
        query_filters = {}
        if is_active_str == 'true':
            query_filters['is_active'] = True
        elif is_active_str == 'false':
            pass # Return all (including soft-deleted)

        if domain:
            query_filters['domain'] = domain
        if batch:
            query_filters['batch'] = batch

        queryset = Trainee.objects(**query_filters)

        # Full-text search
        if q:
            queryset = queryset.search_text(q)

        # Handle Ordering
        allowed_ordering = ['full_name', '-full_name', 'roll_number', '-roll_number', 'created_at', '-created_at']
        if ordering not in allowed_ordering:
            ordering = '-created_at'
        queryset = queryset.order_by(ordering)

        # Paginate results
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request, view=self)
        if page is not None:
            serializer = TraineeSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        # Fallback if pagination is disabled or fails
        serializer = TraineeSerializer(queryset, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        serializer = TraineeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        trainee = TraineeService.create_trainee(
            actor_id=request.user.id,
            data=serializer.validated_data
        )

        output_data = TraineeSerializer(trainee).data
        return success_response(
            data=output_data,
            message="Trainee created successfully.",
            status_code=status.HTTP_201_CREATED
        )

class TraineeDetailView(APIView):
    """View to retrieve, update, or soft-delete a trainee."""
    permission_classes = [IsAdminOrOwnTrainee]

    def get_object(self, pk):
        from mongoengine.errors import DoesNotExist, ValidationError as MEValidationError
        from core.exceptions import NotFoundError
        try:
            obj = Trainee.objects.get(pk=pk)
        except (DoesNotExist, MEValidationError):
            raise NotFoundError("Trainee not found.")
        # Perform object-level permission check — let PermissionDenied propagate
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self, request, pk):
        trainee = self.get_object(pk)
        serializer = TraineeSerializer(trainee)
        return success_response(data=serializer.data)

    def put(self, request, pk):
        # Only admin can edit profiles
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        trainee = self.get_object(pk)
        serializer = TraineeSerializer(data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)

        updated = TraineeService.update_trainee(
            actor_id=request.user.id,
            trainee_id=pk,
            data=serializer.validated_data
        )
        return success_response(data=TraineeSerializer(updated).data, message="Trainee updated successfully.")

    def patch(self, request, pk):
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        trainee = self.get_object(pk)
        serializer = TraineeSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        updated = TraineeService.update_trainee(
            actor_id=request.user.id,
            trainee_id=pk,
            data=serializer.validated_data
        )
        return success_response(data=TraineeSerializer(updated).data, message="Trainee partially updated successfully.")

    def delete(self, request, pk):
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        self.get_object(pk)  # Exists check + perm check
        TraineeService.soft_delete_trainee(actor_id=request.user.id, trainee_id=pk)
        return success_response(message="Trainee soft-deleted successfully.")

class TraineeBulkImportView(APIView):
    """View to import trainees in bulk via a CSV file upload."""
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'file' not in request.FILES:
            raise ValidationError("CSV file is required under the parameter 'file'.")

        csv_file = request.FILES['file']
        if not csv_file.name.endswith('.csv'):
            raise ValidationError("Invalid file format. Only CSV files are supported.")

        result = TraineeService.bulk_import_trainees(
            actor_id=request.user.id,
            csv_file_wrapper=csv_file
        )

        response_data = BulkImportResponseSerializer(result).data
        return success_response(data=response_data, message="Bulk import completed.")

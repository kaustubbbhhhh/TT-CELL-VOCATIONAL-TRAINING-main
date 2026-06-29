import datetime
from rest_framework.views import APIView
from rest_framework import status
from core.responses import success_response, error_response
from core.permissions import IsAdminUser, IsAdminOrOwnTrainee
from apps.attendance.models import AttendanceRecord
from apps.attendance.serializers import (
    AttendanceRecordSerializer, AttendanceMarkSerializer, AttendanceBulkMarkSerializer
)
from apps.attendance.services import AttendanceService
from core.exceptions import ValidationError, NotFoundError

class AttendanceRegisterView(APIView):
    """View to list attendance records or mark a single record."""
    permission_classes = [IsAdminOrOwnTrainee]

    def get(self, request):
        date_str = request.query_params.get('date')
        trainee_id = request.query_params.get('trainee_id')

        query_filters = {}
        if date_str:
            try:
                date_val = datetime.datetime.strptime(date_str.split('T')[0], "%Y-%m-%d")
                query_filters['date'] = date_val
            except ValueError:
                raise ValidationError("Invalid date format. Expected YYYY-MM-DD.")

        if trainee_id:
            query_filters['trainee_id'] = trainee_id
        else:
            from apps.authentication.models import PortalSettings
            from apps.trainees.models import Trainee
            settings = PortalSettings.objects.first()
            if settings and settings.batch_identifier:
                active_trainee_ids = [str(t.id) for t in Trainee.objects(batch_id=settings.batch_identifier, is_active=True)]
                query_filters['trainee_id__in'] = active_trainee_ids

        queryset = AttendanceRecord.objects(**query_filters).order_by('-date')

        # Check object level permissions if querying a single trainee's records
        if trainee_id and request.user.role != 'admin':
            if trainee_id != request.user.trainee_id:
                from core.exceptions import Forbidden
                raise Forbidden("You are not allowed to view other trainees' records.")

        serializer = AttendanceRecordSerializer(queryset, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        # Only admins can write/update attendance registers
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        serializer = AttendanceMarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        record = AttendanceService.mark_attendance(
            actor_id=request.user.id,
            trainee_id=serializer.validated_data['trainee_id'],
            date=serializer.validated_data['date'],
            status=serializer.validated_data['status'],
            session_name=serializer.validated_data['session_name'],
            time_in=serializer.validated_data.get('time_in'),
            leave_type=serializer.validated_data.get('leave_type'),
            notes=serializer.validated_data.get('notes')
        )

        return success_response(
            data=AttendanceRecordSerializer(record).data,
            message="Attendance marked successfully.",
            status_code=status.HTTP_201_CREATED
        )

class AttendanceBulkMarkView(APIView):
    """View to bulk-mark attendance for a list of trainees."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = AttendanceBulkMarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = AttendanceService.bulk_mark_attendance(
            actor_id=request.user.id,
            date=serializer.validated_data['date'],
            session_name=serializer.validated_data['session_name'],
            records=serializer.validated_data['records']
        )

        return success_response(data=result, message="Bulk attendance marking completed.")

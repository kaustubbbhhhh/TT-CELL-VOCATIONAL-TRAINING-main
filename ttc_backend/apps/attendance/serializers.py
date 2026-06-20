from rest_framework import serializers
from apps.attendance.models import AttendanceRecord, ATTENDANCE_STATUSES
from apps.trainees.serializers import TraineeSerializer

class AttendanceRecordSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    trainee = TraineeSerializer(source='trainee_id')
    date = serializers.DateTimeField(read_only=True)
    session_name = serializers.CharField(read_only=True)
    time_in = serializers.CharField(read_only=True, required=False)
    status = serializers.CharField(read_only=True)
    leave_type = serializers.CharField(read_only=True, required=False)
    notes = serializers.CharField(read_only=True, required=False)

class AttendanceMarkSerializer(serializers.Serializer):
    trainee_id = serializers.CharField(required=True)
    date = serializers.CharField(required=True)  # YYYY-MM-DD
    status = serializers.ChoiceField(choices=ATTENDANCE_STATUSES, required=True)
    session_name = serializers.CharField(required=True)
    time_in = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    leave_type = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)

class BulkMarkRowSerializer(serializers.Serializer):
    trainee_id = serializers.CharField(required=True)
    status = serializers.ChoiceField(choices=ATTENDANCE_STATUSES, required=True)
    time_in = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    leave_type = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)

class AttendanceBulkMarkSerializer(serializers.Serializer):
    date = serializers.CharField(required=True)  # YYYY-MM-DD
    session_name = serializers.CharField(required=True)
    records = BulkMarkRowSerializer(many=True, required=True)

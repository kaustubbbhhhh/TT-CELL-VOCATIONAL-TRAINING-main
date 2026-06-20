from rest_framework import serializers
from apps.trainees.models import Trainee, DOMAINS

class TraineeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    roll_number = serializers.CharField(required=True)
    full_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    domain = serializers.ChoiceField(choices=DOMAINS, required=True)
    batch = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def validate_roll_number(self, value):
        return value.strip()

    def validate_email(self, value):
        return value.strip().lower()

class BulkImportErrorSerializer(serializers.Serializer):
    row = serializers.IntegerField()
    roll_number = serializers.CharField(required=False, allow_null=True)
    message = serializers.CharField()

class BulkImportResponseSerializer(serializers.Serializer):
    created = serializers.IntegerField()
    skipped = serializers.IntegerField()
    errors = BulkImportErrorSerializer(many=True)

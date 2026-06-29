from rest_framework import serializers
from apps.trainees.models import Trainee, DOMAINS

class BatchSerializer(serializers.Serializer):
    batch_id = serializers.CharField(required=True)
    batch_year = serializers.IntegerField(required=True)
    batch_status = serializers.ChoiceField(choices=['active', 'completed'], default='active')

class TraineeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    roll_number = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    full_name = serializers.SerializerMethodField(read_only=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True)
    college_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    father_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    father_phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    mother_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    mother_phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    year = serializers.ChoiceField(choices=['II', 'III'], required=False, allow_null=True)
    branch = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    enrollment_number = serializers.IntegerField(required=False, allow_null=True)
    domain = serializers.ChoiceField(choices=DOMAINS, required=True)
    batch_id = serializers.CharField(required=True)
    section = serializers.ChoiceField(choices=['A', 'B', 'C', 'D'], required=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def get_full_name(self, obj):
        first = getattr(obj, 'first_name', '') or ''
        last = getattr(obj, 'last_name', '') or ''
        return f"{first} {last}".strip()

    def validate_roll_number(self, value):
        return value.strip()

    def validate_email(self, value):
        return value.strip().lower()

    def to_representation(self, instance):
        repr_data = super().to_representation(instance)
        # Ensure batch_id is serialized as just the ID string, avoiding the Batch model's __str__ method (which adds the year)
        if hasattr(instance, 'batch_id') and instance.batch_id:
            repr_data['batch_id'] = str(getattr(instance.batch_id, 'id', instance.batch_id))
        return repr_data

class BulkImportErrorSerializer(serializers.Serializer):
    row = serializers.IntegerField()
    roll_number = serializers.CharField(required=False, allow_null=True)
    message = serializers.CharField()

class BulkImportResponseSerializer(serializers.Serializer):
    created = serializers.IntegerField()
    skipped = serializers.IntegerField()
    errors = BulkImportErrorSerializer(many=True)

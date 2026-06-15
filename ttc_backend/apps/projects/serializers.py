from rest_framework import serializers
from apps.projects.models import Project, PROJECT_STATUSES
from apps.trainees.models import DOMAINS
from apps.trainees.serializers import TraineeSerializer

class ProjectSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    project_code = serializers.CharField(required=True)
    title = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    domain = serializers.ChoiceField(choices=DOMAINS, required=True)
    team = serializers.IntegerField(default=1, min_value=1)
    progress = serializers.IntegerField(default=0, min_value=0, max_value=100)
    status = serializers.ChoiceField(choices=PROJECT_STATUSES, default='planning')
    score = serializers.IntegerField(required=False, allow_null=True, min_value=0, max_value=100)
    stack = serializers.ListField(child=serializers.CharField(), required=False, default=[])
    created_by = serializers.CharField(read_only=True)
    is_archived = serializers.BooleanField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

class ProjectAssignSerializer(serializers.Serializer):
    student_ids = serializers.ListField(child=serializers.CharField(), required=False)
    trainee_ids = serializers.ListField(child=serializers.CharField(), required=False)
    deadline_override = serializers.DateTimeField(required=False, allow_null=True)

    def validate(self, data):
        # Merge student_ids and trainee_ids for full compatibility
        trainee_ids = data.get('trainee_ids', [])
        student_ids = data.get('student_ids', [])
        
        combined_ids = list(set(trainee_ids + student_ids))
        if not combined_ids:
            raise serializers.ValidationError("At least one trainee/student ID must be specified.")
            
        data['resolved_trainee_ids'] = combined_ids
        return data

class ProjectAssignmentListSerializer(serializers.Serializer):
    trainee = TraineeSerializer()
    deadline_override = serializers.DateTimeField(allow_null=True)

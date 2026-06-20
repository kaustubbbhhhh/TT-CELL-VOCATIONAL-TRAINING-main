from rest_framework import serializers
from apps.announcements.models import Announcement, PRIORITY_LEVELS

class AnnouncementSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(required=True)
    body = serializers.CharField(required=True)
    priority = serializers.ChoiceField(choices=PRIORITY_LEVELS, default='normal')
    target_audience = serializers.CharField(default='All Batches')
    created_by = serializers.CharField(read_only=True)
    is_draft = serializers.BooleanField(default=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

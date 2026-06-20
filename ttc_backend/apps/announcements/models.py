from mongoengine import Document, StringField, BooleanField
from core.mixins import AuditLogMixin, SoftDeleteMixin

PRIORITY_LEVELS = ['normal', 'urgent', 'notice', 'informational']

class Announcement(AuditLogMixin, SoftDeleteMixin, Document):
    """Announcement Document representing published noticeboard announcements."""
    title = StringField(required=True)
    body = StringField(required=True)
    priority = StringField(choices=PRIORITY_LEVELS, default='normal')
    target_audience = StringField(default='All Batches')  # e.g., 'All Batches', 'AI/ML'
    created_by = StringField(required=True)  # User.id of creator
    is_draft = BooleanField(default=False)

    meta = {
        'collection': 'announcements',
        'indexes': [
            'priority',
            'target_audience',
            'is_draft',
            'is_active',
            {
                'fields': ['$title', '$body'],
                'default_language': 'english'
            }
        ]
    }

    def __str__(self):
        return f"{self.title} ({self.priority})"

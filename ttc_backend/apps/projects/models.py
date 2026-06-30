from mongoengine import Document, StringField, IntField, BooleanField, ListField, ReferenceField, DateTimeField, CASCADE
from core.mixins import AuditLogMixin, SoftDeleteMixin
from apps.trainees.models import Trainee, DOMAINS, Batch

PROJECT_STATUSES = ['planning', 'in_progress', 'submitted', 'completed']

class Project(AuditLogMixin, SoftDeleteMixin, Document):
    """Project Document representing Capstone Projects."""
    project_code = StringField(unique=True, required=True)
    title = StringField(required=True)
    description = StringField(required=True)
    domain = StringField(choices=DOMAINS, required=True)
    team = IntField(default=1)  # Recommended team size
    progress = IntField(default=0, min_value=0, max_value=100)
    status = StringField(choices=PROJECT_STATUSES, default='planning')
    score = IntField(min_value=0, max_value=100)
    stack = ListField(StringField())
    created_by = StringField(required=True)  # User.id of admin creator
    is_archived = BooleanField(default=False)
    batch_id = ReferenceField(Batch, reverse_delete_rule=CASCADE, required=True)

    meta = {
        'collection': 'projects',
        'indexes': [
            'project_code',
            'status',
            'domain',
            'is_archived',
            {
                'fields': ['$title', '$description'],
                'default_language': 'english'
            },
            ('is_archived', 'status'),
            ('is_archived', 'domain')
        ]
    }

    def __str__(self):
        return f"{self.project_code} - {self.title}"

class ProjectAssignment(Document):
    """Document storing associations of Trainees assigned to Projects."""
    project_id = ReferenceField(Project, reverse_delete_rule=CASCADE)  # CASCADE
    trainee_id = ReferenceField(Trainee, reverse_delete_rule=CASCADE)  # CASCADE
    deadline_override = DateTimeField()

    meta = {
        'collection': 'project_assignments',
        'indexes': [
            'project_id',
            'trainee_id',
            # Compound unique index to prevent duplicate assignments
            {'fields': ['project_id', 'trainee_id'], 'unique': True}
        ]
    }

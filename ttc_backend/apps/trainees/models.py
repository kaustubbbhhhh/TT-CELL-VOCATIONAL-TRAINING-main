from mongoengine import Document, StringField
from core.mixins import AuditLogMixin, SoftDeleteMixin

DOMAINS = ['AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded']

class Trainee(AuditLogMixin, SoftDeleteMixin, Document):
    """Trainee Document representing vocational student profiles."""
    roll_number = StringField(unique=True, required=True)
    full_name = StringField(required=True)
    email = StringField(unique=True, required=True)
    domain = StringField(choices=DOMAINS, required=True)
    batch = StringField(required=True)  # e.g., 'Batch 2024-B'
    phone = StringField()

    meta = {
        'collection': 'trainees',
        'indexes': [
            'roll_number',
            'email',
            {
                'fields': ['$full_name'],
                'default_language': 'english'
            },
            # Compound index for active trainees listing & filtering
            ('is_active', 'domain'),
            ('is_active', 'batch')
        ]
    }

    def __str__(self):
        return f"{self.roll_number} - {self.full_name}"

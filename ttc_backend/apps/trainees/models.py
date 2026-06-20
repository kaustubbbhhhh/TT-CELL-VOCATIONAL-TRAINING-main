from mongoengine import Document, StringField, IntField
from core.mixins import AuditLogMixin, SoftDeleteMixin

DOMAINS = ['AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded']

class Trainee(AuditLogMixin, SoftDeleteMixin, Document):
    """Trainee Document representing vocational student profiles."""
        # Accept either 'TT24-001' or compact 'CS2024001' formats
    #  Accept either 'TT24-001' or compact 'CS2024001' formats; allow lowercase letters too
    roll_number = StringField(
        primary_key=True,
        required=True,
        regex=r'^[A-Za-z0-9-]{2,20}$'
    )
    full_name = StringField(required=True)
    email = StringField(unique=True, required=True)
    domain = StringField(choices=DOMAINS, required=True)
    batch = StringField(required=True, regex=r'^Batch \d{4}-[A-Z]$')  # e.g., 'Batch 2024-B'
    phone = StringField()

    meta = {
        'collection': 'trainees',
        'indexes': [
            # 'roll_number', # Primary key is automatically indexed as _id
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

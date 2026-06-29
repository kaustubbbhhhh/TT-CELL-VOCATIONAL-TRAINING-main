from mongoengine import Document, StringField, IntField, ReferenceField, DENY
from core.mixins import AuditLogMixin, SoftDeleteMixin

DOMAINS = ['AI/ML', 'Web Dev', 'Cyber Sec', 'Data Sci', 'IoT', 'Embedded']

class Batch(AuditLogMixin, SoftDeleteMixin, Document):
    # Accept batch ids like 'B_1', 'B_01', 'B_2024' (B_ followed by one or more digits)
    batch_id = StringField(primary_key=True, regex=r'^B_\d+$')  # e.g., 'B_01', 'B_02', 'B_1'
    batch_year = IntField(required=True)
    batch_status = StringField(choices=['active', 'completed'], default='active')

    meta = {
        'collection': 'batches',
        'indexes': ['batch_year', 'batch_status']
    }

    def __str__(self):
        return f"{self.batch_id} ({self.batch_year})"

class Trainee(AuditLogMixin, SoftDeleteMixin, Document):
    """Trainee Document representing vocational student profiles."""
    roll_number = StringField(
        primary_key=True,
        required=True,
        regex=r'^[A-Za-z0-9\-]{2,20}$'
    )
    first_name = StringField(required=True)
    last_name = StringField(required=False)
    email = StringField(unique=True, required=True)
    phone = StringField(regex=r'^\d{10}$')
    
    college_name = StringField(required=False)
    father_name = StringField(required=False)
    father_phone = StringField(regex=r'^\d{10}$', required=False)
    mother_name = StringField(required=False)
    mother_phone = StringField(regex=r'^\d{10}$', required=False)
    year = StringField(choices=['II', 'III'], required=False)
    branch = StringField(required=False)
    enrollment_number = IntField(required=False)

    domain = StringField(choices=DOMAINS, required=True)
    batch_id = ReferenceField(Batch, reverse_delete_rule=DENY, required=True)
    section = StringField(required=True, choices=['A', 'B', 'C', 'D'])

    meta = {
        'collection': 'trainees',
        'indexes': [
            'email',
            {
                'fields': ['$first_name', '$last_name'],
                'default_language': 'english'
            },
            ('is_active', 'domain'),
            ('is_active', 'batch_id')
        ]
    }
    
    @property
    def full_name(self):
        if self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.first_name

    def __str__(self):
        return f"{self.roll_number} - {self.full_name}"

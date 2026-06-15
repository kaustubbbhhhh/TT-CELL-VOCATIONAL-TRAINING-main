import datetime
from mongoengine import Document, ReferenceField, DateTimeField, StringField, CASCADE
from apps.trainees.models import Trainee

ATTENDANCE_STATUSES = ['present', 'absent', 'leave']

class AttendanceRecord(Document):
    """AttendanceRecord Document tracking daily trainee presence."""
    trainee_id = ReferenceField(Trainee, reverse_delete_rule=CASCADE)  # CASCADE
    date = DateTimeField(required=True)  # Store date as DateTime (normalized to midnight)
    session_name = StringField(required=True)  # e.g., 'AI/ML Lab · Room 4B'
    time_in = StringField()  # e.g., '08:52'
    status = StringField(choices=ATTENDANCE_STATUSES, required=True)
    leave_type = StringField()  # e.g., 'Medical', 'Casual'
    notes = StringField()

    meta = {
        'collection': 'attendance_records',
        'indexes': [
            'trainee_id',
            'date',
            'status',
            # Compound unique index to prevent double marking for a single day
            {'fields': ['trainee_id', 'date'], 'unique': True}
        ]
    }

    def __str__(self):
        return f"{self.trainee_id.roll_number} - {self.date.strftime('%Y-%m-%d')} - {self.status}"

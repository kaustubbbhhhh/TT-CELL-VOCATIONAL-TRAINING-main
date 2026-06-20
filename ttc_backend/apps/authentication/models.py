import datetime
from mongoengine import Document, StringField, IntField, DateTimeField, BooleanField, DictField
from core.mixins import AuditLogMixin, SoftDeleteMixin

class User(AuditLogMixin, SoftDeleteMixin, Document):
    """Auth User Document representing system credentials and status."""
    email = StringField(unique=True, required=True)
    password_hash = StringField(required=True)
    role = StringField(choices=['admin', 'trainee'], required=True)
    full_name = StringField(required=True)
    trainee_id = StringField()  # Links to the Trainee Mongo ID if role == 'trainee'
    
    # Security columns
    failed_attempts = IntField(default=0)
    locked_until = DateTimeField()
    must_change_password = BooleanField(default=False)

    meta = {
        'collection': 'users',
        'indexes': [
            'email',
            'role',
            'is_active',
        ]
    }

class RefreshToken(Document):
    """Document storing issued refresh tokens for token rotation validation."""
    token = StringField(unique=True, required=True)
    user_id = StringField(required=True)  # Str representation of User.id
    expires_at = DateTimeField(required=True)
    is_rotated = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'refresh_tokens',
        'indexes': [
            'token',
            {'fields': ['expires_at'], 'expireAfterSeconds': 0}  # Auto TTL deletion
        ]
    }

class AuditLog(Document):
    """AuditLog Document tracking all sensitive administrative actions."""
    actor_id = StringField(required=True)  # User.id of the action executor
    action = StringField(required=True)    # e.g., CREATE_TRAINEE, UPDATE_TRAINEE, LOGIN, LOCKOUT
    target_type = StringField(required=True) # e.g., Trainee, User, Project
    target_id = StringField(required=True)   # ID of target entity
    before_state = DictField()
    after_state = DictField()
    timestamp = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'audit_logs',
        'indexes': [
            'actor_id',
            'action',
            'target_type',
            '-timestamp',
        ]
    }

class PortalSettings(Document):
    org_name = StringField(default='TT Cell — Army Base Workshop')
    batch_identifier = StringField(default='Batch 2024-B')
    min_attendance_threshold = IntField(default=75)
    academic_year = StringField(default='2024-2025')
    email_at_risk_alerts = BooleanField(default=True)
    daily_attendance_summary = BooleanField(default=True)
    project_deadline_reminders = BooleanField(default=True)
    new_trainee_registration_alerts = BooleanField(default=False)

    meta = {
        'collection': 'portal_settings'
    }


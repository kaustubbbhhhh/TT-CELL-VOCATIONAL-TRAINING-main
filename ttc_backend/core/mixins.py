import datetime
from mongoengine import BooleanField, DateTimeField

class SoftDeleteMixin(object):
    """Mixin to support soft deletion of documents."""
    is_active = BooleanField(default=True)

    def soft_delete(self):
        self.is_active = False
        self.save()

class AuditLogMixin(object):
    """Mixin to track creation and modification times on documents."""
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
        return super().save(*args, **kwargs)

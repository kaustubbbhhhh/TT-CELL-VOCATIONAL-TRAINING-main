import os
# MongoEngine connection is established in core/db.py or settings.py during django.setup()
# But let's explicitly call it if needed.
from core.db import connect_db
connect_db()

from apps.announcements.models import Announcement
from apps.attendance.models import AttendanceRecord
from apps.authentication.models import User, AuditLog
from apps.projects.models import Project, ProjectAssignment
from apps.trainees.models import Trainee

models = [Announcement, AttendanceRecord, User, AuditLog, Project, ProjectAssignment, Trainee]
for model in models:
    model.ensure_indexes()
    print(f"Created collection and indexes for: {model.__name__}")

print("Collections created successfully.")

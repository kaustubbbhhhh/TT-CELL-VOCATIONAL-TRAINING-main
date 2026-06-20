import os
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.authentication.models import User
from apps.authentication.services import hash_password
from mongoengine import connect

class Command(BaseCommand):
    help = 'Seeds the first administrator account in MongoDB.'

    def handle(self, *args, **options):
        # Ensure MongoDB is connected
        from core.db import connect_db
        connect_db()

        email = os.environ.get('ADMIN_EMAIL', 'admin@ttcell')
        password = os.environ.get('ADMIN_PASSWORD', 'password')
        name = os.environ.get('ADMIN_NAME', 'ADM Sharma')

        self.stdout.write(f"Checking if admin account '{email}' exists...")
        existing = User.objects(email=email, is_active=True).first()

        if existing:
            self.stdout.write(self.style.SUCCESS(f"Admin account '{email}' already exists. Skipping seeding."))
            return

        self.stdout.write("Creating admin account...")
        admin = User(
            email=email,
            password_hash=hash_password(password),
            role='admin',
            full_name=name,
            must_change_password=False
        )
        admin.save()
        self.stdout.write(self.style.SUCCESS(f"Successfully created administrator account: {email} / {password}"))

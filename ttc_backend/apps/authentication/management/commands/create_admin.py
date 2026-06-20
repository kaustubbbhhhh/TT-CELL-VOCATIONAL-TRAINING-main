import os
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.authentication.models import User
from apps.authentication.services import check_password, hash_password
from mongoengine import connect

class Command(BaseCommand):
    help = 'Seeds the first administrator account in MongoDB.'

    def add_arguments(self, parser):
        parser.add_argument('--email', help='Admin email address. Defaults to ADMIN_EMAIL or admin@ttcell.')
        parser.add_argument('--password', help='Admin password. Defaults to ADMIN_PASSWORD or password.')
        parser.add_argument('--name', help='Admin full name. Defaults to ADMIN_NAME or ADM Sharma.')
        parser.add_argument(
            '--reset-password',
            action='store_true',
            help='Reset the password if the admin account already exists.',
        )

    def handle(self, *args, **options):
        # Ensure MongoDB is connected
        from core.db import connect_db
        connect_db()

        email = options.get('email') or os.environ.get('ADMIN_EMAIL', 'admin@ttcell')
        password = options.get('password') or os.environ.get('ADMIN_PASSWORD', 'password')
        name = options.get('name') or os.environ.get('ADMIN_NAME', 'ADM Sharma')

        self.stdout.write(f"Checking if admin account '{email}' exists...")
        existing = User.objects(email=email).first()

        if existing:
            if options['reset_password']:
                existing.password_hash = hash_password(password)
                existing.role = 'admin'
                existing.full_name = name
                existing.is_active = True
                existing.failed_attempts = 0
                existing.locked_until = None
                existing.must_change_password = False
                existing.save()
                self.stdout.write(self.style.SUCCESS(f"Updated administrator account: {email} / {password}"))
                return

            if check_password(password, existing.password_hash):
                self.stdout.write(self.style.SUCCESS(f"Admin account '{email}' already exists and the password is valid. Skipping seeding."))
            else:
                self.stdout.write(self.style.WARNING(
                    f"Admin account '{email}' already exists, but the configured password does not match. "
                    "Run this command with --reset-password to repair it."
                ))
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

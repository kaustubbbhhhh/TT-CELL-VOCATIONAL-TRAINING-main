import csv
import io
import os
from django.conf import settings
from mongoengine.errors import NotUniqueError
from apps.trainees.models import Trainee, DOMAINS
from apps.authentication.models import User, AuditLog, RefreshToken
from apps.authentication.services import AuthService
from core.exceptions import ValidationError, ConflictError, NotFoundError

class TraineeService:
    """Service class handling Trainee operations and user account provisioning."""

    @staticmethod
    def create_trainee(actor_id: str, data: dict) -> Trainee:
        """Create a new Trainee and auto-provision their login account."""
        roll_number = data.get('roll_number')
        email = data.get('email')
        full_name = data.get('full_name')
        domain = data.get('domain')
        batch = data.get('batch')
        phone = data.get('phone')

        # Check domain choices
        if domain not in DOMAINS:
            raise ValidationError(f"Invalid domain. Must be one of: {', '.join(DOMAINS)}", {"domain": ["Invalid domain."]})

        # Check unique constraints manually to raise clean ConflictError
        if Trainee.objects(roll_number=roll_number, is_active=True).first():
            raise ConflictError("Roll number already exists.", {"roll_number": "A trainee with this roll number already exists."})
        if Trainee.objects(email=email, is_active=True).first():
            raise ConflictError("Email already exists.", {"email": "A trainee with this email address already exists."})

        # Save trainee document
        trainee = Trainee(
            roll_number=roll_number,
            full_name=full_name,
            email=email,
            domain=domain,
            batch=batch,
            phone=phone
        )
        trainee.save()

        # Provision Auth User
        default_pwd = os.environ.get('DEFAULT_TRAINEE_PASSWORD', 'ChangeMeOnFirstLogin!')
        try:
            AuthService.create_user(
                email=email,
                password_raw=default_pwd,
                role='trainee',
                full_name=full_name,
                trainee_id=str(trainee.id)
            )
        except ValidationError:
            # Clean up trainee if User provisioning fails
            trainee.delete()
            raise ConflictError("A user account with this email address already exists.")

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="CREATE_TRAINEE",
            target_type="Trainee",
            target_id=str(trainee.id),
            after_state=data
        ).save()

        return trainee

    @staticmethod
    def update_trainee(actor_id: str, trainee_id: str, data: dict) -> Trainee:
        """Update trainee details, keeping linked User credentials in sync."""
        try:
            trainee = Trainee.objects.get(id=trainee_id, is_active=True)
        except:
            raise NotFoundError("Trainee not found.")

        before_state = {
            "roll_number": trainee.roll_number,
            "full_name": trainee.full_name,
            "email": trainee.email,
            "domain": trainee.domain,
            "batch": trainee.batch,
            "phone": trainee.phone
        }

        # Check updates and validate constraints
        email = data.get('email')
        roll_number = data.get('roll_number')
        domain = data.get('domain')

        if domain and domain not in DOMAINS:
            raise ValidationError(f"Invalid domain. Must be one of: {', '.join(DOMAINS)}", {"domain": ["Invalid domain."]})

        if roll_number and roll_number != trainee.roll_number:
            if Trainee.objects(roll_number=roll_number, is_active=True).first():
                raise ConflictError("Roll number already exists.")
            trainee.roll_number = roll_number

        email_changed = False
        if email and email != trainee.email:
            if Trainee.objects(email=email, is_active=True).first():
                raise ConflictError("Email already exists.")
            trainee.email = email
            email_changed = True

        if data.get('full_name'):
            trainee.full_name = data.get('full_name')
        if 'phone' in data:
            trainee.phone = data.get('phone')
        if data.get('batch'):
            trainee.batch = data.get('batch')
        if domain:
            trainee.domain = domain

        trainee.save()

        # Update linked user account if email or name changed
        user = User.objects(trainee_id=str(trainee.id), is_active=True).first()
        if user:
            if email_changed:
                user.email = trainee.email
            if data.get('full_name'):
                user.full_name = trainee.full_name
            user.save()

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="UPDATE_TRAINEE",
            target_type="Trainee",
            target_id=str(trainee.id),
            before_state=before_state,
            after_state=data
        ).save()

        return trainee

    @staticmethod
    def soft_delete_trainee(actor_id: str, trainee_id: str):
        """Soft delete trainee and deactivate linked User credentials."""
        try:
            trainee = Trainee.objects.get(id=trainee_id, is_active=True)
        except:
            raise NotFoundError("Trainee not found.")

        # Soft delete trainee
        trainee.soft_delete()

        # Deactivate associated User
        user = User.objects(trainee_id=str(trainee.id), is_active=True).first()
        if user:
            user.soft_delete()
            # Revoke all active sessions
            RefreshToken.objects(user_id=str(user.id)).delete()

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="DELETE_TRAINEE",
            target_type="Trainee",
            target_id=str(trainee.id)
        ).save()

    @classmethod
    def bulk_import_trainees(cls, actor_id: str, csv_file_wrapper) -> dict:
        """Parse, validate, and bulk-import trainees from a CSV file."""
        # Read the file
        try:
            file_data = csv_file_wrapper.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(file_data))
        except Exception as e:
            raise ValidationError(f"Failed to parse CSV file: {str(e)}")

        # Validate headers
        required_headers = ['roll_number', 'full_name', 'email', 'domain', 'batch']
        missing_headers = [h for h in required_headers if h not in csv_reader.fieldnames]
        if missing_headers:
            raise ValidationError(f"CSV is missing required columns: {', '.join(missing_headers)}")

        created_count = 0
        skipped_count = 0
        errors = []

        for row_idx, row in enumerate(csv_reader, start=1):
            # Clean values
            row_data = {k: v.strip() if v else '' for k, v in row.items()}
            roll_number = row_data.get('roll_number')
            email = row_data.get('email')
            full_name = row_data.get('full_name')
            domain = row_data.get('domain')
            batch = row_data.get('batch')
            phone = row_data.get('phone', '')

            if not all([roll_number, email, full_name, domain, batch]):
                errors.append({"row": row_idx, "message": "Missing required fields on this row."})
                continue

            try:
                # Attempt to create the trainee
                cls.create_trainee(actor_id, {
                    "roll_number": roll_number,
                    "email": email,
                    "full_name": full_name,
                    "domain": domain,
                    "batch": batch,
                    "phone": phone
                })
                created_count += 1
            except ConflictError as ce:
                # Treat duplicate constraints as skipped/warning
                skipped_count += 1
                errors.append({"row": row_idx, "roll_number": roll_number, "message": ce.message})
            except ValidationError as ve:
                errors.append({"row": row_idx, "roll_number": roll_number, "message": ve.message})
            except Exception as e:
                errors.append({"row": row_idx, "roll_number": roll_number, "message": str(e)})

        return {
            "created": created_count,
            "skipped": skipped_count,
            "errors": errors
        }

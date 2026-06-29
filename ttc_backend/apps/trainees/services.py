import csv
import io
from apps.trainees.models import Trainee, Batch, DOMAINS
from apps.authentication.models import User, AuditLog, RefreshToken
from apps.authentication.services import AuthService
from core.exceptions import ValidationError, ConflictError, NotFoundError

class TraineeService:
    """Service class handling Trainee operations and user account provisioning."""

    @staticmethod
    def _build_default_password(first_name: str, roll_number: str) -> str:
        """Build the initial trainee password from the trainee's first name and roll number."""
        name_part = ((first_name or '').strip().split()[0] if first_name and first_name.strip() else '').lower()
        roll_part = ''.join(roll_number.split()).lower() if roll_number else ''
        return f"{name_part}{roll_part}"

    @staticmethod
    def create_trainee(actor_id: str, data: dict) -> Trainee:
        """Create a new Trainee and auto-provision their login account."""
        roll_number = data.get('roll_number')
        email = data.get('email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        domain = data.get('domain')
        batch_id = data.get('batch_id')
        section = data.get('section')
        phone = data.get('phone')
        
        # New fields
        college_name = data.get('college_name')
        father_name = data.get('father_name')
        father_phone = data.get('father_phone')
        mother_name = data.get('mother_name')
        mother_phone = data.get('mother_phone')
        year = data.get('year')
        branch = data.get('branch')
        enrollment_number = data.get('enrollment_number')

        if domain not in DOMAINS:
            raise ValidationError(f"Invalid domain. Must be one of: {', '.join(DOMAINS)}", {"domain": ["Invalid domain."]})

        batch = Batch.objects(batch_id=batch_id).first()
        if not batch:
            raise ValidationError(f"Batch {batch_id} does not exist.", {"batch_id": ["Invalid batch."]})

        if Trainee.objects(roll_number=roll_number, is_active=True).first():
            raise ConflictError("Roll number already exists.", {"roll_number": "A trainee with this roll number already exists."})
        if Trainee.objects(email=email, is_active=True).first():
            raise ConflictError("Email already exists.", {"email": "A trainee with this email address already exists."})

        trainee = Trainee(
            roll_number=roll_number,
            first_name=first_name,
            last_name=last_name,
            email=email,
            domain=domain,
            batch_id=batch,
            section=section,
            phone=phone,
            college_name=college_name,
            father_name=father_name,
            father_phone=father_phone,
            mother_name=mother_name,
            mother_phone=mother_phone,
            year=year,
            branch=branch,
            enrollment_number=enrollment_number
        )
        trainee.save()

        default_pwd = TraineeService._build_default_password(first_name, roll_number)
        try:
            AuthService.create_user(
                email=email,
                password_raw=default_pwd,
                role='trainee',
                full_name=f"{first_name or ''} {last_name or ''}".strip(),
                trainee_id=str(trainee.id)
            )
        except ValidationError:
            trainee.delete()
            raise ConflictError("A user account with this email address already exists.")

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
            trainee = Trainee.objects.get(pk=trainee_id, is_active=True)
        except Exception:
            raise NotFoundError("Trainee not found.")

        before_state = {
            "roll_number": trainee.roll_number,
            "first_name": trainee.first_name,
            "last_name": trainee.last_name,
            "email": trainee.email,
            "domain": trainee.domain,
            "batch_id": trainee.batch_id.batch_id if trainee.batch_id else None,
            "section": trainee.section,
            "phone": trainee.phone,
            "college_name": trainee.college_name,
            "father_name": trainee.father_name,
            "father_phone": trainee.father_phone,
            "mother_name": trainee.mother_name,
            "mother_phone": trainee.mother_phone,
            "year": trainee.year,
            "branch": trainee.branch,
            "enrollment_number": trainee.enrollment_number,
        }

        email = data.get('email')
        roll_number = data.get('roll_number')
        domain = data.get('domain')
        batch_id = data.get('batch_id')

        if domain and domain not in DOMAINS:
            raise ValidationError(f"Invalid domain. Must be one of: {', '.join(DOMAINS)}", {"domain": ["Invalid domain."]})

        if batch_id:
            batch = Batch.objects(batch_id=batch_id).first()
            if not batch:
                raise ValidationError(f"Batch {batch_id} does not exist.", {"batch_id": ["Invalid batch."]})
            trainee.batch_id = batch

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

        if data.get('first_name') is not None:
            trainee.first_name = data.get('first_name')
        if data.get('last_name') is not None:
            trainee.last_name = data.get('last_name')
        if 'phone' in data:
            trainee.phone = data.get('phone')
        if data.get('section'):
            trainee.section = data.get('section')
        if domain:
            trainee.domain = domain
            
        for field in ['college_name', 'father_name', 'father_phone', 'mother_name', 'mother_phone', 'year', 'branch', 'enrollment_number']:
            if field in data:
                setattr(trainee, field, data.get(field))

        trainee.save()

        user = User.objects(trainee_id=str(trainee.id), is_active=True).first()
        if user:
            if email_changed:
                user.email = trainee.email
            if data.get('first_name') or data.get('last_name'):
                user.full_name = f"{trainee.first_name or ''} {trainee.last_name or ''}".strip()
            user.save()

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
            trainee = Trainee.objects.get(pk=trainee_id, is_active=True)
        except Exception:
            raise NotFoundError("Trainee not found.")

        trainee.soft_delete()

        user = User.objects(trainee_id=str(trainee.id), is_active=True).first()
        if user:
            user.soft_delete()
            RefreshToken.objects(user_id=str(user.id)).delete()

        AuditLog(
            actor_id=actor_id,
            action="DELETE_TRAINEE",
            target_type="Trainee",
            target_id=str(trainee.id)
        ).save()

    @classmethod
    def bulk_import_trainees(cls, actor_id: str, csv_file_wrapper) -> dict:
        """Parse, validate, and bulk-import trainees from a CSV file."""
        try:
            file_data = csv_file_wrapper.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(file_data))
        except Exception as e:
            raise ValidationError(f"Failed to parse CSV file: {str(e)}")

        required_headers = ['roll_number', 'first_name', 'email', 'domain', 'batch_id', 'section']
        missing_headers = [h for h in required_headers if h not in csv_reader.fieldnames]
        if missing_headers:
            raise ValidationError(f"CSV is missing required columns: {', '.join(missing_headers)}")

        created_count = 0
        skipped_count = 0
        errors = []

        for row_idx, row in enumerate(csv_reader, start=1):
            row_data = {k: v.strip() if v else '' for k, v in row.items()}
            roll_number = row_data.get('roll_number')
            email = row_data.get('email')
            first_name = row_data.get('first_name')
            last_name = row_data.get('last_name')
            domain = row_data.get('domain')
            batch_id = row_data.get('batch_id')
            section = row_data.get('section')
            phone = row_data.get('phone', '')

            if not all([roll_number, email, first_name, domain, batch_id, section]):
                errors.append({"row": row_idx, "message": "Missing required fields on this row."})
                continue

            try:
                cls.create_trainee(actor_id, {
                    "roll_number": roll_number,
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "domain": domain,
                    "batch_id": batch_id,
                    "section": section,
                    "phone": phone
                })
                created_count += 1
            except ConflictError as ce:
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


class BatchService:
    """Service class handling Batch operations."""

    @staticmethod
    def get_batches(status: str = None) -> list:
        query = Batch.objects(is_active=True)
        if status:
            query = query(batch_status=status)
        return list(query)

    @staticmethod
    def create_batch(actor_id: str, data: dict) -> Batch:
        batch_id = data.get('batch_id')
        batch_year = data.get('batch_year')
        batch_status = data.get('batch_status', 'active')

        if not batch_id or not batch_year:
            raise ValidationError("batch_id and batch_year are required.")

        if Batch.objects(batch_id=batch_id).first():
            raise ConflictError(f"Batch with ID {batch_id} already exists.")

        if batch_status == 'active':
            # Set all other active batches to completed
            Batch.objects(batch_status='active').update(batch_status='completed')
            # Automatically update PortalSettings batch identifier
            from apps.authentication.models import PortalSettings
            settings = PortalSettings.objects.first()
            if settings:
                settings.batch_identifier = batch_id
                settings.save()

        batch = Batch(
            batch_id=batch_id,
            batch_year=batch_year,
            batch_status=batch_status
        )
        batch.save()

        AuditLog(
            actor_id=actor_id,
            action="CREATE_BATCH",
            target_type="Batch",
            target_id=str(batch.batch_id),
            after_state={"batch_id": batch_id, "batch_year": batch_year, "batch_status": batch_status}
        ).save()

        return batch

    @staticmethod
    def update_batch(actor_id: str, batch_id: str, data: dict) -> Batch:
        batch = Batch.objects(batch_id=batch_id, is_active=True).first()
        if not batch:
            raise NotFoundError("Batch not found.")

        before_state = {"batch_year": batch.batch_year, "batch_status": batch.batch_status}

        new_status = data.get('batch_status')
        if new_status == 'active' and batch.batch_status != 'active':
            # Set all other active batches to completed
            Batch.objects(batch_status='active').update(batch_status='completed')
            # Automatically update PortalSettings batch identifier
            from apps.authentication.models import PortalSettings
            settings = PortalSettings.objects.first()
            if settings:
                settings.batch_identifier = batch_id
                settings.save()

        if 'batch_year' in data:
            batch.batch_year = data['batch_year']
        if 'batch_status' in data:
            batch.batch_status = data['batch_status']

        batch.save()

        AuditLog(
            actor_id=actor_id,
            action="UPDATE_BATCH",
            target_type="Batch",
            target_id=str(batch.batch_id),
            before_state=before_state,
            after_state={"batch_year": batch.batch_year, "batch_status": batch.batch_status}
        ).save()

        return batch

    @staticmethod
    def delete_batch(actor_id: str, batch_id: str):
        batch = Batch.objects(batch_id=batch_id, is_active=True).first()
        if not batch:
            raise NotFoundError("Batch not found.")

        # Check if any trainees are linked to this batch
        if Trainee.objects(batch_id=batch, is_active=True).count() > 0:
            raise ConflictError("Cannot delete batch as it has active trainees linked to it.")

        batch.is_active = False
        batch.save()

        AuditLog(
            actor_id=actor_id,
            action="DELETE_BATCH",
            target_type="Batch",
            target_id=str(batch.batch_id),
            after_state={"is_active": False}
        ).save()

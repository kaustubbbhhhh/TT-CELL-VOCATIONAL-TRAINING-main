import datetime
from apps.attendance.models import AttendanceRecord
from apps.trainees.models import Trainee
from apps.authentication.models import AuditLog
from core.exceptions import ValidationError, NotFoundError, ConflictError

class AttendanceService:
    """Service class encapsulating Attendance record lifecycle operations."""

    @staticmethod
    def _normalize_date(dt_input) -> datetime.datetime:
        """Helper to normalize any date input to midnight UTC."""
        if isinstance(dt_input, str):
            # Parse YYYY-MM-DD
            try:
                dt = datetime.datetime.strptime(dt_input.split('T')[0], "%Y-%m-%d")
            except ValueError:
                raise ValidationError("Invalid date format. Expected YYYY-MM-DD.")
        elif isinstance(dt_input, (datetime.date, datetime.datetime)):
            dt = datetime.datetime(dt_input.year, dt_input.month, dt_input.day)
        else:
            raise ValidationError("Invalid date type.")
        return dt

    @classmethod
    def mark_attendance(cls, actor_id: str, trainee_id: str, date, status: str,
                        session_name: str, time_in: str = None, leave_type: str = None, notes: str = None) -> AttendanceRecord:
        """Mark or update a trainee's attendance for a specific date."""
        try:
            trainee = Trainee.objects.get(pk=trainee_id, is_active=True)
        except:
            raise NotFoundError("Trainee not found.")

        normalized_date = cls._normalize_date(date)

        # Check status choices
        from apps.attendance.models import ATTENDANCE_STATUSES
        if status not in ATTENDANCE_STATUSES:
            raise ValidationError(f"Invalid status. Must be one of: {', '.join(ATTENDANCE_STATUSES)}")

        # Upsert record
        record = AttendanceRecord.objects(trainee_id=trainee, date=normalized_date).first()
        is_new = False
        if not record:
            record = AttendanceRecord(trainee_id=trainee, date=normalized_date)
            is_new = True

        record.status = status
        record.session_name = session_name
        record.time_in = time_in if status == 'present' else None
        record.leave_type = leave_type if status == 'leave' else None
        record.notes = notes
        record.save()

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="MARK_ATTENDANCE" if is_new else "UPDATE_ATTENDANCE",
            target_type="AttendanceRecord",
            target_id=str(record.id),
            after_state={
                "trainee_id": trainee_id,
                "date": normalized_date.isoformat(),
                "status": status,
                "session_name": session_name
            }
        ).save()

        return record

    @classmethod
    def bulk_mark_attendance(cls, actor_id: str, date, session_name: str, records: list) -> dict:
        """Mark or update attendance for a list of trainees in bulk."""
        marked_count = 0
        errors = []

        for row_idx, rec in enumerate(records):
            trainee_id = rec.get('trainee_id')
            status = rec.get('status')
            time_in = rec.get('time_in')
            leave_type = rec.get('leave_type')
            notes = rec.get('notes')

            if not trainee_id or not status:
                errors.append({"index": row_idx, "message": "Missing trainee_id or status."})
                continue

            try:
                cls.mark_attendance(
                    actor_id=actor_id,
                    trainee_id=trainee_id,
                    date=date,
                    status=status,
                    session_name=session_name,
                    time_in=time_in,
                    leave_type=leave_type,
                    notes=notes
                )
                marked_count += 1
            except Exception as e:
                errors.append({"index": row_idx, "trainee_id": trainee_id, "message": str(e)})

        return {
            "marked": marked_count,
            "errors": errors
        }

    @staticmethod
    def get_trainee_attendance_percentage(trainee_id: str) -> float:
        """Calculate overall attendance percentage for a trainee."""
        records = AttendanceRecord.objects(trainee_id=trainee_id)
        total = records.count()
        if total == 0:
            return 100.0  # Default to 100 if no sessions exist

        present = records(status='present').count()
        return round((present / total) * 100, 2)

    @staticmethod
    def get_bulk_attendance_percentages() -> dict:
        """Calculate attendance percentages for ALL trainees in a single MongoDB aggregation query. Returns dict mapping trainee_id to float."""
        pipeline = [
            {
                "$group": {
                    "_id": "$trainee_id",
                    "total_records": {"$sum": 1},
                    "present_records": {
                        "$sum": {"$cond": [{"$eq": ["$status", "present"]}, 1, 0]}
                    }
                }
            }
        ]
        results = AttendanceRecord.objects.aggregate(pipeline)
        attendance_dict = {}
        for r in results:
            trainee_id = str(r['_id'])
            total = r['total_records']
            present = r['present_records']
            pct = round((present / total) * 100, 2) if total > 0 else 100.0
            attendance_dict[trainee_id] = pct
        return attendance_dict

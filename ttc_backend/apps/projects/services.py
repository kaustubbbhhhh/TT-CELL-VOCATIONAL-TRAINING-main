from apps.projects.models import Project, ProjectAssignment
from apps.trainees.models import Trainee
from apps.authentication.models import AuditLog
from core.exceptions import ValidationError, ConflictError, NotFoundError

class ProjectService:
    """Service class encapsulating Project CRUD and assignment lifecycle management."""

    @staticmethod
    def create_project(actor_id: str, data: dict) -> Project:
        """Create a new Capstone Project."""
        project_code = data.get('project_code')
        
        # Check uniqueness
        if Project.objects(project_code=project_code, is_active=True).first():
            raise ConflictError("Project code already exists.")

        project = Project(
            project_code=project_code,
            title=data.get('title'),
            description=data.get('description'),
            domain=data.get('domain'),
            team=data.get('team', 1),
            progress=data.get('progress', 0),
            status=data.get('status', 'planning'),
            score=data.get('score'),
            stack=data.get('stack', []),
            created_by=actor_id
        )
        project.save()

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="CREATE_PROJECT",
            target_type="Project",
            target_id=str(project.id),
            after_state=data
        ).save()

        return project

    @staticmethod
    def update_project(actor_id: str, project_id: str, data: dict) -> Project:
        """Update project details."""
        try:
            project = Project.objects.get(id=project_id, is_active=True)
        except Exception:
            raise NotFoundError("Project not found.")

        before_state = {
            "project_code": project.project_code,
            "title": project.title,
            "description": project.description,
            "domain": project.domain,
            "team": project.team,
            "progress": project.progress,
            "status": project.status,
            "score": project.score,
            "stack": project.stack
        }

        # Check unique constraint on project_code
        project_code = data.get('project_code')
        if project_code and project_code != project.project_code:
            if Project.objects(project_code=project_code, is_active=True).first():
                raise ConflictError("Project code already exists.")
            project.project_code = project_code

        # Update fields
        if data.get('title'):
            project.title = data.get('title')
        if data.get('description'):
            project.description = data.get('description')
        if data.get('domain'):
            project.domain = data.get('domain')
        if 'team' in data:
            project.team = data.get('team')
        if 'progress' in data:
            project.progress = data.get('progress')
        if data.get('status'):
            project.status = data.get('status')
        if 'score' in data:
            project.score = data.get('score')
        if 'stack' in data:
            project.stack = data.get('stack')

        project.save()

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="UPDATE_PROJECT",
            target_type="Project",
            target_id=str(project.id),
            before_state=before_state,
            after_state=data
        ).save()

        return project

    @staticmethod
    def archive_project(actor_id: str, project_id: str) -> Project:
        """Set project is_archived to True."""
        try:
            project = Project.objects.get(id=project_id, is_active=True)
        except Exception:
            raise NotFoundError("Project not found.")

        project.is_archived = True
        project.save()

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="ARCHIVE_PROJECT",
            target_type="Project",
            target_id=str(project.id)
        ).save()

        return project

    @staticmethod
    def unarchive_project(actor_id: str, project_id: str) -> Project:
        """Set project is_archived to False."""
        try:
            project = Project.objects.get(id=project_id, is_active=True)
        except Exception:
            raise NotFoundError("Project not found.")

        project.is_archived = False
        project.save()

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="UNARCHIVE_PROJECT",
            target_type="Project",
            target_id=str(project.id)
        ).save()

        return project

    @staticmethod
    def assign_trainees(actor_id: str, project_id: str, trainee_ids: list, deadline_override=None) -> dict:
        """Assign one or multiple trainees to a project."""
        try:
            project = Project.objects.get(id=project_id, is_active=True)
        except Exception:
            raise NotFoundError("Project not found.")

        # Business Rule: Cannot assign to archived project
        if project.is_archived:
            raise ConflictError("Cannot assign trainees to an archived project.")

        created_count = 0
        skipped_count = 0
        warnings = []

        for tid in trainee_ids:
            try:
                trainee = Trainee.objects.get(pk=tid, is_active=True)
            except Exception:
                warnings.append(f"Trainee ID '{tid}' not found or inactive. Skipping.")
                skipped_count += 1
                continue

            # Manual check-then-create (get_or_create is unreliable with ReferenceField)
            existing = ProjectAssignment.objects(project_id=project, trainee_id=trainee).first()
            if existing:
                skipped_count += 1
                warnings.append(f"Trainee {trainee.full_name} is already assigned to this project.")
            else:
                try:
                    assignment = ProjectAssignment(
                        project_id=project,
                        trainee_id=trainee,
                        deadline_override=deadline_override
                    )
                    assignment.save()
                    created_count += 1
                except Exception as e:
                    skipped_count += 1
                    warnings.append(f"Failed to assign trainee {trainee.full_name}: {str(e)}")

        # Audit Log
        if created_count > 0:
            AuditLog(
                actor_id=actor_id,
                action="ASSIGN_TRAINEES",
                target_type="Project",
                target_id=project_id,
                after_state={"assigned_trainee_ids": trainee_ids, "deadline_override": str(deadline_override)}
            ).save()

        return {
            "created": created_count,
            "skipped": skipped_count,
            "warnings": warnings
        }

    @staticmethod
    def remove_assignment(actor_id: str, project_id: str, trainee_id: str):
        """Remove a trainee assignment from a project."""
        try:
            project = Project.objects.get(id=project_id, is_active=True)
        except Exception:
            raise NotFoundError("Project not found.")

        try:
            trainee = Trainee.objects.get(pk=trainee_id)
        except Exception:
            raise NotFoundError("Trainee not found.")

        deleted_count = ProjectAssignment.objects(project_id=project, trainee_id=trainee).delete()
        if deleted_count == 0:
            raise NotFoundError("Assignment not found.")

        # Audit Log
        AuditLog(
            actor_id=actor_id,
            action="REMOVE_TRAINEE_ASSIGNMENT",
            target_type="Project",
            target_id=project_id,
            after_state={"removed_trainee_id": trainee_id}
        ).save()

    @staticmethod
    def list_assignments(project_id: str) -> list:
        """List all trainees assigned to a project."""
        try:
            project = Project.objects.get(id=project_id, is_active=True)
        except Exception:
            raise NotFoundError("Project not found.")

        assignments = ProjectAssignment.objects(project_id=project)
        # Gather trainee documents
        assigned_trainees = []
        for ass in assignments:
            # Safely fetch referenced trainee
            if ass.trainee_id and ass.trainee_id.is_active:
                assigned_trainees.append({
                    "trainee": ass.trainee_id,
                    "deadline_override": ass.deadline_override
                })

        return assigned_trainees

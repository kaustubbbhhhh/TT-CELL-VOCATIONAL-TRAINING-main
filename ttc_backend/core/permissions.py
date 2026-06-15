from rest_framework.permissions import BasePermission

class IsAuthenticatedUser(BasePermission):
    """Allows access only to authenticated users."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_active)

class IsAdminUser(BasePermission):
    """Allows access only to admin users."""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_active and 
            request.user.role == 'admin'
        )

class IsTraineeUser(BasePermission):
    """Allows access only to trainee users."""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_active and 
            request.user.role == 'trainee'
        )

class IsAdminOrOwnTrainee(BasePermission):
    """Allows access to admins, or a trainee viewing/modifying their own record."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_active)

    def has_object_permission(self, request, view, obj):
        # Admin gets full access
        if request.user.role == 'admin':
            return True
        
        # Trainees can only view their own record.
        # If obj has a trainee_id (e.g. AttendanceRecord or Trainee profile), check it matches request.user.id
        # Note: auth User document stores trainee_id as a string pointing to Trainee's Mongo ID, or vice versa.
        # Let's check:
        # User.student_id or User.trainee_id is the string representation of Trainee.id.
        # So we can check if str(obj.id) == request.user.trainee_id or similar.
        
        # Let's inspect object type or property:
        # If obj is a Trainee document, compare str(obj.id) == getattr(request.user, 'trainee_id', None) (wait, request.user.id is User.id, let's make sure our middleware attaches trainee_id or we can verify it).
        # We will attach trainee_id to request.user inside the middleware if the user has role 'trainee'.
        
        user_trainee_id = getattr(request.user, 'trainee_id', None)
        if not user_trainee_id:
            return False
            
        # If the object is the Trainee document itself
        if hasattr(obj, 'roll_number'):  # Trainee model check
            return str(obj.id) == user_trainee_id
            
        # If the object has a trainee reference (e.g. project assignment or attendance record)
        if hasattr(obj, 'trainee_id'):
            return str(obj.trainee_id.id if hasattr(obj.trainee_id, 'id') else obj.trainee_id) == user_trainee_id

        return False

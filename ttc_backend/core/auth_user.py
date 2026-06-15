class AuthUser:
    """A lightweight mock user class that mimics Django's AbstractUser for DRF integration."""
    def __init__(self, user_id, email, role, is_active=True):
        self.id = user_id
        self.email = email
        self.role = role
        self.is_active = is_active

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_staff(self):
        return self.role == 'admin'

    @property
    def is_superuser(self):
        return self.role == 'admin'

    def __str__(self):
        return f"AuthUser({self.email}, role={self.role})"

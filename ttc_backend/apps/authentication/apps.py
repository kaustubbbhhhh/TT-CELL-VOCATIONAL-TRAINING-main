from django.apps import AppConfig

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'

    def ready(self):
        # Establish connection to MongoDB via MongoEngine on startup
        from core.db import connect_db
        connect_db()

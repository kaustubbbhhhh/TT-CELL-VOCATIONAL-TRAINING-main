import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-ttcell-vocational-training-secret-key')

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'apps.authentication',
    'apps.trainees',
    'apps.projects',
    'apps.attendance',
    'apps.announcements',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'middleware.jwt_middleware.JWTMiddleware',
]

ROOT_URLCONF = 'ttc_project.urls'

WSGI_APPLICATION = 'ttc_project.wsgi.application'
ASGI_APPLICATION = 'ttc_project.asgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}


# DRF settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'core.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'core.permissions.IsAuthenticatedUser',
    ),
    'EXCEPTION_HANDLER': 'core.exceptions.custom_exception_handler',
    'UNAUTHENTICATED_USER': None,
}

# CORS configuration
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',') if origin.strip()
]

# Static files
STATIC_URL = 'static/'

# JWT Path settings
JWT_PUBLIC_KEY_PATH = str(BASE_DIR / 'jwt_public.pem')
JWT_PRIVATE_KEY_PATH = str(BASE_DIR / 'jwt_private.pem')

# Default Auto Field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

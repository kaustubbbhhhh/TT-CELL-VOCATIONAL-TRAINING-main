import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-ttcell-vocational-training-secret-key')

DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'

# Securely load allowed hosts, fallback to localhost for dev
allowed_hosts_env = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1,testserver')
ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_env.split(',') if host.strip()]

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
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'middleware.jwt_middleware.JWTMiddleware',
]

ROOT_URLCONF = 'ttc_project.urls'

WSGI_APPLICATION = 'ttc_project.wsgi.application'
ASGI_APPLICATION = 'ttc_project.asgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.environ.get('SQLITE_DB_PATH', str(BASE_DIR / 'db.sqlite3')),
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

# Secure fallback: Localhost is only default in DEBUG mode. In production, fail closed if not set.
_default_cors = 'http://localhost:3000' if DEBUG else ''
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in os.environ.get('CORS_ALLOWED_ORIGINS', _default_cors).split(',') if origin.strip()
]

# Explicitly restrict HTTP methods (e.g. PATCH is disabled)
CORS_ALLOW_METHODS = (
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
)
# Static files
STATIC_URL = 'static/'

# JWT Path settings
JWT_PUBLIC_KEY_PATH = str(BASE_DIR / 'jwt_public.pem')
JWT_PRIVATE_KEY_PATH = str(BASE_DIR / 'jwt_private.pem')

# Default Auto Field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -----------------------------------------------------------------------------
# TRANSPORT SECURITY (HTTPS / SSL)
# -----------------------------------------------------------------------------
if not DEBUG:
    # Ensure Django knows it's behind a secure proxy (Nginx/Cloudflare)
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    
    # Force HTTP -> HTTPS redirect
    SECURE_SSL_REDIRECT = True
    
    # HTTP Strict Transport Security (HSTS)
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Browser Security Headers
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    
    # Cookie Security
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

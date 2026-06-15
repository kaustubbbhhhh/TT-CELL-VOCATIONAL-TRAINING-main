from rest_framework.authentication import BaseAuthentication

class JWTAuthentication(BaseAuthentication):
    """DRF Authentication class that bridges request.user set by JWTMiddleware to DRF's security layer."""
    def authenticate(self, request):
        # The JWTMiddleware executes before DRF views, and populates request.user.
        # We simply return the user if they were successfully authenticated.
        django_request = getattr(request, '_request', request)
        user = getattr(django_request, 'user', None)
        if user and user.is_authenticated:
            return (user, None)
        return None

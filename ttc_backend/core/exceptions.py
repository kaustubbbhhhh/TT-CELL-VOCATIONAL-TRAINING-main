from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

class TTCAPIException(Exception):
    """Base exception for all TT Cell API errors."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "INTERNAL_SERVER_ERROR"
    
    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details or {}

class ValidationError(TTCAPIException):
    status_code = status.HTTP_400_BAD_REQUEST
    error_code = "VALIDATION_ERROR"

class AuthenticationFailed(TTCAPIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "AUTHENTICATION_FAILED"

class Forbidden(TTCAPIException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "FORBIDDEN"

class NotFoundError(TTCAPIException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "NOT_FOUND"

class ConflictError(TTCAPIException):
    status_code = status.HTTP_409_CONFLICT
    error_code = "CONFLICT_ERROR"

class LockoutError(TTCAPIException):
    status_code = status.HTTP_423_LOCKED
    error_code = "ACCOUNT_LOCKED"

class RateLimitError(TTCAPIException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    error_code = "RATE_LIMIT_EXCEEDED"

def custom_exception_handler(exc, context):
    """Custom exception handler for Django REST Framework to enforce uniform error envelope."""
    # First call DRF's default exception handler to get the standard response
    response = exception_handler(exc, context)

    if isinstance(exc, TTCAPIException):
        return Response({
            "error_code": exc.error_code,
            "message": exc.message,
            "details": exc.details
        }, status=exc.status_code)

    if response is not None:
        # If it is a DRF-generated exception (e.g. ValidationError, PermissionDenied)
        error_code = "API_ERROR"
        message = "An error occurred while processing the request."
        details = response.data

        if response.status_code == 400:
            error_code = "VALIDATION_ERROR"
            message = "Input validation failed."
        elif response.status_code == 401:
            error_code = "AUTHENTICATION_FAILED"
            message = "Authentication credentials were not provided or are invalid."
        elif response.status_code == 403:
            error_code = "FORBIDDEN"
            message = "You do not have permission to perform this action."
        elif response.status_code == 404:
            error_code = "NOT_FOUND"
            message = "Resource not found."
        elif response.status_code == 429:
            error_code = "RATE_LIMIT_EXCEEDED"
            message = "Too many requests. Please try again later."

        response.data = {
            "error_code": error_code,
            "message": message,
            "details": details
        }
        return response

    # For unhandled standard Python exceptions, return 500
    if isinstance(exc, Exception):
        return Response({
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": str(exc),
            "details": {}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    return None

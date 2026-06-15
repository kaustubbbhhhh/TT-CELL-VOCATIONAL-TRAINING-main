from rest_framework.response import Response
from rest_framework import status

def success_response(data=None, message="Success", meta=None, status_code=status.HTTP_200_OK):
    """Helper to return standard success response format."""
    response_payload = {
        "data": data,
        "message": message,
        "meta": meta or {}
    }
    return Response(response_payload, status=status_code)

def error_response(error_code="API_ERROR", message="An error occurred", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    """Helper to return standard error response format."""
    response_payload = {
        "error_code": error_code,
        "message": message,
        "details": details or {}
    }
    return Response(response_payload, status=status_code)

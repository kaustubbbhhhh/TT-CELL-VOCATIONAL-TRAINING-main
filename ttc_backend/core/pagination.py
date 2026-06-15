from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StandardPagination(PageNumberPagination):
    """Standard pagination wrapping list results in the {data, message, meta} envelope."""
    page_size = 20
    max_page_size = 100
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        # Determine total count
        total_count = self.page.paginator.count
        
        # Get page size
        page_size = self.get_page_size(self.request)
        
        return Response({
            "data": data,
            "message": "Success",
            "meta": {
                "page": self.page.number,
                "page_size": page_size,
                "total": total_count
            }
        })

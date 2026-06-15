from django.urls import path
from apps.attendance.views import AttendanceRegisterView, AttendanceBulkMarkView

urlpatterns = [
    path('', AttendanceRegisterView.as_view(), name='attendance_register'),
    path('bulk-mark/', AttendanceBulkMarkView.as_view(), name='attendance_bulk_mark'),
]

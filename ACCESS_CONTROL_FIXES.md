# Access Control Fixes Log

**Prepared By:** Senior Application Security Engineer
**Date:** 2026-06-18
**Project:** TTC Vocational Training Platform

## Fix #1: Prevent Insecure Direct Object Reference (IDOR) on Attendance Records
* **Target File:** `ttc_backend/apps/attendance/views.py`
* **Target Class:** `AttendanceRegisterView`
* **Vulnerability:** Unfiltered dataset exposure when `trainee_id` query parameter was omitted.
* **Remediation Details:** 
  In the `get()` method, enforced a default value mapping `trainee_id` to `request.user.trainee_id` for users with the `trainee` role. Added explicit rejection if the trainee tries to override this query parameter with an identifier that does not match their own ID.

```python
# Added logic snippet
if request.user.role == 'trainee':
    if trainee_id and trainee_id != request.user.trainee_id:
        from core.exceptions import Forbidden
        raise Forbidden("You are not allowed to view other trainees' records.")
    trainee_id = request.user.trainee_id
```

## Fix #2: Prevent Horizontal Privilege Escalation on Announcement Details
* **Target File:** `ttc_backend/apps/announcements/views.py`
* **Target Class:** `AnnouncementDetailView`
* **Vulnerability:** Unrestricted access to published announcements targeting domains other than the requesting trainee's domain.
* **Remediation Details:**
  Enhanced attribute-based access control inside the `get()` method. We now fetch the Trainee's domain and verify it against the `target_audience` string inside the database row. If the target audience is not "All Batches" and does not include the trainee's domain substring, a `403 Forbidden` exception is raised.

```python
# Added logic snippet
if request.user.role == 'trainee':
    if announcement.is_draft:
        raise Forbidden("You are not authorized to view this draft announcement.")
    
    try:
        trainee = Trainee.objects.get(id=request.user.trainee_id)
        trainee_domain = trainee.domain
    except:
        trainee_domain = None

    is_all_batches = announcement.target_audience.lower() == 'all batches'
    matches_domain = trainee_domain and trainee_domain.lower() in announcement.target_audience.lower()
    
    if not (is_all_batches or matches_domain):
        raise Forbidden("You are not authorized to view this announcement.")
```

## Remaining Unresolved Risks (Acknowledged)
1. **Dynamic Permission Overrides:** Certain views (e.g. `TraineeDetailView`, `AnnouncementDetailView`) instantiate base DRF permissions as `[IsAuthenticatedUser]` or `[IsAdminOrOwnTrainee]` and dynamically override `self.permission_classes = [IsAdminUser]` at runtime during `put()` or `delete()`. While practically secure in current testing, it breaks DRY (Don't Repeat Yourself) principles and increases the likelihood of future regressions if new HTTP verbs are added without similar overrides. A cleaner `HasRolePermission` DRF class structure is recommended as technical debt.
2. **Missing Token Invalidations upon Privilege Downgrades:** JWT rotation relies strictly on expiry times. If an admin account were ever demoted, they would retain admin privileges until their JWT explicitly expires. Shortening the JWT validity window or adding a lightweight cache-based token blocklist is recommended.

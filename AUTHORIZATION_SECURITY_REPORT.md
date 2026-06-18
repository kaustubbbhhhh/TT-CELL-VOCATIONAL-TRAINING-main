# Authorization Security Report

**Prepared By:** Senior Application Security Engineer
**Date:** 2026-06-18
**Scope:** Application Authorization / Access Control Layer

## Executive Summary
A comprehensive security audit of the application's authorization and access control layer was conducted. The codebase effectively leverages role-based access control (RBAC) via custom Django REST Framework (DRF) permission classes (`IsAdminUser`, `IsTraineeUser`, `IsAdminOrOwnTrainee`) and robust JWT-based middleware.

While administrative boundaries are strictly enforced and securely parse cryptographic JWT claims, the audit identified two significant authorization vulnerabilities involving Broken Access Control (IDOR) and Horizontal Privilege Escalation. These issues have been documented and patched.

## Audit Findings

### 1. Broken Access Control (IDOR) / Data Over-exposure
**Severity:** CRITICAL
**File Path:** `apps/attendance/views.py`
**Vulnerable Endpoint:** `GET /api/v1/attendance/`

**Description:** 
The `AttendanceRegisterView` relies on the `IsAdminOrOwnTrainee` permission class for entry, but the method itself evaluates ownership conditionally. The authorization block within `get()` checked if the `trainee_id` parameter matched the user's ID, but *only if* the parameter was explicitly provided.

**Exploitation Example:** 
An authenticated trainee user could send a `GET /api/v1/attendance/` request without any query parameters. Because `trainee_id` was empty, the ownership check was entirely bypassed, returning the full attendance records of all trainees in the database.

**Root Cause:** 
Failure to assert a default secure state (fail-closed) when an optional filter parameter was omitted.

**Fix Applied:** 
Added server-side enforcement defaulting `trainee_id` to the `request.user.trainee_id` if the user is a Trainee, explicitly rejecting attempts to fetch other trainees' records.

---

### 2. Horizontal Privilege Escalation (Insecure Object Access)
**Severity:** MEDIUM
**File Path:** `apps/announcements/views.py`
**Vulnerable Endpoint:** `GET /api/v1/announcements/<pk>/`

**Description:** 
The `AnnouncementDetailView` lacked a domain-targeting authorization check for Trainee users. While the `AnnouncementListCreateView` correctly filtered the query so that Trainees could only see announcements broadcasted to "All Batches" or their specific domain (e.g., "AI/ML"), the detail view only verified that the announcement was not a draft.

**Exploitation Example:** 
A trainee in the "Web Dev" domain could intercept or brute-force the UUID of a published announcement intended strictly for the "Cyber Sec" domain. Sending a direct GET request to `/api/v1/announcements/<uuid>/` would return the contents of the announcement.

**Root Cause:** 
Missing attribute-based access control (ABAC) in the detail view corresponding to the filters applied in the list view.

**Fix Applied:** 
Implemented a strict validation check inside `AnnouncementDetailView.get()` to ensure the announcement's `target_audience` attribute matches either the Trainee's domain or "All Batches". Attempted access now yields a `403 Forbidden`.

## Architectural Notes
- **JWT Middleware**: The custom `JWTMiddleware` properly decodes RS256 signatures, ensuring `user_id`, `role`, and `trainee_id` claims cannot be spoofed by modifying request payloads.
- **Frontend Defenses**: The frontend correctly hides unauthorized views using `<RequireRole>` components. However, this relies on the backend as the ultimate source of truth, validating the principle of defense-in-depth.
- **Override Pattern**: Several endpoints implement an explicit permission override (`self.permission_classes = [IsAdminUser]`, `self.check_permissions(request)`) inside specific HTTP method handlers (e.g., `PUT`, `DELETE`). While non-standard for DRF, the logic correctly enforces Admin-only restrictions and passed the security tests.

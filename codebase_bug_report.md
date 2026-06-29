# Full Codebase Bug Report - Verification Pass

Date: 2026-06-23
Scope: Backend (Django + DRF + MongoEngine) and frontend (React 19 + Vite)
Mode: Review only. No application source fixes were applied in this pass.

## Verification Baseline

- Frontend build: PASS via `npm.cmd run build`.
- Frontend build warning: Vite reports one JS chunk over 500 kB after minification.
- Backend tests/checks: BLOCKED in this environment because the active Python has no `django` or `pytest` installed.
- Repository state note: the worktree already had backend modifications before this review. `codebase_bug_report.md` is untracked, and generated/runtime artifacts are tracked in git.

## Executive Summary

The previous report contains real issues, but several "critical" items are now stale or partially fixed in the current tree. The most urgent newly confirmed issue is that `ttc_backend/jwt_private.pem` is tracked in git. Because JWTs are signed with this private key, anyone with repository access can forge valid API tokens until keys are rotated and the exposed key is removed from history.

Current confirmed active findings:

| Severity | Count | Notes |
|---|---:|---|
| Critical | 2 | Tracked JWT private key; insecure production defaults |
| High | 5 | Password/session/reset-token and trainee loading issues |
| Medium | 8 | Broken analytics chart, data accuracy, broad exceptions, report/form gaps |
| Low | 5 | Deprecated handlers, stale comments, tracked generated artifacts, validation polish |

## Critical Findings

### CRIT-1: JWT private signing key is committed to git

Evidence:
- `ttc_backend/jwt_private.pem:1` starts with `-----BEGIN PRIVATE KEY-----`.
- `git ls-files` confirms `ttc_backend/jwt_private.pem` is tracked.
- Tokens are signed from `JWT_PRIVATE_KEY_PATH` in `ttc_backend/apps/authentication/services.py:49`.

Impact:
An attacker with repository access can sign forged RS256 access tokens, including admin-role tokens, until the key pair is replaced everywhere.

Recommended fix:
Remove the key files from git, add them to `.gitignore`, rotate the key pair, invalidate all active tokens, and provide keys through environment/secrets management.

### CRIT-2: Production can boot with insecure defaults

Evidence:
- `ttc_backend/ttc_project/settings.py:9` has a hardcoded fallback `SECRET_KEY`.
- `ttc_backend/ttc_project/settings.py:11` defaults `DEBUG` to true.

Impact:
A deployment missing environment variables starts in debug mode with a known secret. That can expose detailed errors and weaken signing/security assumptions.

Recommended fix:
Fail startup when production secrets are missing. Default `DEBUG` to false and require `SECRET_KEY`, `ALLOWED_HOSTS`, and CORS origins through environment configuration.

## High Findings

### HIGH-1: Deterministic trainee default passwords are not forced to rotate

Evidence:
- Default password is built from name plus roll number in `ttc_backend/apps/trainees/services.py:12`.
- Trainee creation uses that password in `ttc_backend/apps/trainees/services.py:51` and `ttc_backend/apps/trainees/services.py:55`.
- `must_change_password=True` is stored in `ttc_backend/apps/authentication/services.py:241`.
- Login succeeds without enforcing `must_change_password` in `ttc_backend/apps/authentication/services.py:117` through `ttc_backend/apps/authentication/services.py:170`.

Impact:
Predictable initial trainee credentials can remain usable indefinitely. The flag is returned to the frontend, but no route forces a password change before portal access.

Recommended fix:
Generate random one-time passwords or invite links. Enforce `must_change_password` immediately after login before granting normal portal access.

### HIGH-2: Admin seed command defaults to `password` and prints credentials

Evidence:
- Defaults documented in `ttc_backend/apps/authentication/management/commands/create_admin.py:12` and `ttc_backend/apps/authentication/management/commands/create_admin.py:13`.
- Defaults are used at `ttc_backend/apps/authentication/management/commands/create_admin.py:26` and `ttc_backend/apps/authentication/management/commands/create_admin.py:27`.
- Password is printed at `ttc_backend/apps/authentication/management/commands/create_admin.py:43` and `ttc_backend/apps/authentication/management/commands/create_admin.py:64`.

Impact:
A seeded admin account can be created with a known password, and credentials can leak into terminal logs.

Recommended fix:
Require `ADMIN_PASSWORD` or an explicit `--password`, reject weak defaults, and never print passwords.

### HIGH-3: Password reset token exposure remains possible because DEBUG defaults true

Evidence:
- Reset token is returned in API responses when DEBUG is true at `ttc_backend/apps/authentication/views.py:156`.
- Reset link is logged when DEBUG is true at `ttc_backend/apps/authentication/services.py:279`.
- DEBUG defaults true at `ttc_backend/ttc_project/settings.py:11`.

Status versus old report:
The token is no longer stored in audit log state, and it is not printed with `print()`. The remaining risk is DEBUG-gated exposure combined with unsafe DEBUG default.

Recommended fix:
Do not return reset tokens from the API outside tests. Use email delivery or a development-only explicit setting that cannot be enabled accidentally in production.

### HIGH-4: Four trainee pages can stay on an infinite spinner when `trainee_id` is missing

Evidence:
- Dashboard gate: `ttcell/src/pages/trainee/TraineePages.jsx:47`.
- Profile gate: `ttcell/src/pages/trainee/TraineePages.jsx:289`.
- Attendance gate: `ttcell/src/pages/trainee/TraineePages.jsx:413`.
- Projects gate: `ttcell/src/pages/trainee/TraineePages.jsx:544`.

Impact:
If a trainee user record lacks `trainee_id`, these pages never call `setLoading(false)` and never render an error state.

Recommended fix:
If `user.role === "trainee"` and no `trainee_id` is available, stop loading and show an actionable account-linking error.

### HIGH-5: A true 0% attendance value displays as 100% in trainee attendance UI

Evidence:
- `ttcell/src/pages/trainee/TraineePages.jsx:424` uses `stats?.my_attendance || 100`.

Impact:
If the backend returns `0`, the UI treats it as falsy and shows 100%, falsely marking a trainee as safe.

Recommended fix:
Use nullish coalescing: `stats?.my_attendance ?? 100`.

## Medium Findings

### MED-1: Admin analytics "Project Submission Status" chart is broken by response-shape mismatch

Evidence:
- Backend returns `name` and `value` in `ttc_backend/apps/authentication/dashboard_views.py:293` through `ttc_backend/apps/authentication/dashboard_views.py:295`.
- Frontend reads `label` and `count` in `ttcell/src/pages/admin/AdminAnalytics.jsx:114`.

Impact:
The chart can render undefined labels/values and compute `NaN` totals.

Recommended fix:
Use `r.name` and `r.value` on the frontend, or change backend keys consistently.

### MED-2: No-attendance trainees are treated as 100% in analytics and reports

Evidence:
- Analytics defaults missing attendance to 100 in `ttc_backend/apps/authentication/dashboard_views.py:266` and `ttc_backend/apps/authentication/dashboard_views.py:313`.
- Reports default missing attendance to 100 in `ttc_backend/apps/authentication/dashboard_views.py:487`, `ttc_backend/apps/authentication/dashboard_views.py:511`, and `ttc_backend/apps/authentication/dashboard_views.py:542`.
- Service default is also 100 when a trainee has no records in `ttc_backend/apps/attendance/services.py:113`.

Impact:
At-risk lists and exported reports can overstate attendance for trainees with no recorded sessions.

Recommended fix:
Represent missing attendance as `null`/`N/A`, or calculate against expected sessions rather than recorded rows only.

### MED-3: Broad `except Exception` blocks still mask useful failures

Evidence:
- Examples remain in `ttc_backend/apps/projects/services.py:48`, `ttc_backend/apps/projects/services.py:107`, `ttc_backend/apps/trainees/services.py:81`, `ttc_backend/apps/attendance/services.py:31`, `ttc_backend/apps/announcements/views.py:28`, and `ttc_backend/apps/authentication/dashboard_views.py:75`.

Status versus old report:
The old report said "bare except". I found broad `except Exception`, not bare `except:`.

Recommended fix:
Catch specific MongoEngine exceptions such as `DoesNotExist`, `ValidationError`, and duplicate-key errors.

### MED-4: Unhandled 500 responses expose raw exception messages

Evidence:
- `ttc_backend/core/exceptions.py:88` returns `str(exc)` in the API response body.

Impact:
Production clients can receive internal exception details, file/path hints, or database error content.

Recommended fix:
Return a generic production message and log the internal exception server-side.

### MED-5: Placement and MoD reports still contain hardcoded business data

Evidence:
- Placement report rows are hardcoded in `ttc_backend/apps/authentication/dashboard_views.py:557`.
- MoD target values/statuses are partly hardcoded in `ttc_backend/apps/authentication/dashboard_views.py:564` through `ttc_backend/apps/authentication/dashboard_views.py:578`.

Impact:
Exports can look authoritative while not reflecting live system data or approved business rules.

Recommended fix:
Move these values to real models/configuration or mark them clearly as sample placeholders until data exists.

### MED-6: Public contact form is visual only

Evidence:
- `ttcell/src/pages/public/OtherPublicPages.jsx:177` renders a submit button without form state, validation, API call, or submit handler.

Impact:
Users can type an inquiry, click submit, and nothing is sent.

Recommended fix:
Either wire the form to a backend endpoint or disable it with clear copy until supported.

### MED-7: Password complexity messaging does not match backend validation

Evidence:
- Backend password serializers only enforce `min_length=8` at `ttc_backend/apps/authentication/serializers.py:9`, `ttc_backend/apps/authentication/serializers.py:18`, and `ttc_backend/apps/authentication/serializers.py:25`.
- Frontend helper text claims uppercase, lowercase, number, and special-character requirements in `ttcell/src/pages/trainee/TraineePages.jsx:369`.

Impact:
Users receive misleading guidance, and weak-but-long passwords are accepted.

Recommended fix:
Add a shared password policy validator on the backend and align frontend helper text with the actual policy.

### MED-8: Frontend has no error boundaries or request cancellation

Evidence:
- React tree in `ttcell/src/App.jsx` has no error boundary around route/layout content.
- Data-loading effects in dashboard/admin/trainee pages do not cancel in-flight requests on unmount.

Impact:
A rendering error can blank the route, and slow responses can update unmounted components during navigation.

Recommended fix:
Add a route-level error boundary and use `AbortController` or Axios cancellation for long-lived page fetches.

## Low Findings

### LOW-1: `onKeyPress` is deprecated

Evidence:
- `ttcell/src/pages/admin/AdminManagement.jsx:168`.
- `ttcell/src/pages/admin/AdminAnalytics.jsx:276`.

Recommended fix:
Use `onKeyDown`.

### LOW-2: `ForgotPasswordSerializer` does not validate email format

Evidence:
- Login uses `EmailField` at `ttc_backend/apps/authentication/serializers.py:4`.
- Forgot password still uses `CharField` at `ttc_backend/apps/authentication/serializers.py:21`.

Recommended fix:
Use `EmailField` and normalize the address.

### LOW-3: CORS comment is stale

Evidence:
- Comment says PATCH is disabled in `ttc_backend/ttc_project/settings.py:70`.
- PATCH is allowed in `ttc_backend/ttc_project/settings.py:75`.

Recommended fix:
Update the comment to match behavior.

### LOW-4: Navigation announcement badges read a missing backend field

Evidence:
- Frontend reads `total_announcements` in `ttcell/src/components/Navigation.jsx:186` and `ttcell/src/components/Navigation.jsx:192`.
- Dashboard stats responses do not include `total_announcements`.

Impact:
Announcement badges silently never appear.

Recommended fix:
Add `total_announcements` to backend stats responses or remove the badge logic.

### LOW-5: Generated/runtime artifacts are tracked in git

Evidence:
- `git ls-files` shows `ttcell/dist/*`, `ttc_backend/db.sqlite3`, many `__pycache__/*.pyc` files, and JWT key files are tracked.
- No root `.gitignore` exists.

Impact:
Build noise and runtime state make diffs noisy and increase risk of leaking local data/secrets.

Recommended fix:
Add `.gitignore`, stop tracking generated files, and keep only source/config templates in git.

## Verification Of Previous Report Items

| Previous claim | Current status |
|---|---|
| CORS blocks PATCH | Outdated. PATCH is present in `CORS_ALLOW_METHODS`. |
| Bare `except:` clauses | Reword. Broad `except Exception` exists; bare `except:` was not found. |
| `DEBUG = True` hardcoded | Reword. DEBUG is environment-based but defaults true, which is still risky. |
| Fake 85% defaults | Partially true. Frontend has a fallback 85 composite score; stronger confirmed issue is fake 100% attendance defaults. |
| Reset token leaked in audit logs | Fixed/outdated. Audit log now stores only `reset_requested: True`. |
| Reset token printed to stdout | Reword. No `print()`, but DEBUG response/log exposure remains. |
| Infinite spinner if `trainee_id` missing | Confirmed active. |
| `AuthUser` missing `trainee_id` | Fixed/outdated. `AuthUser` and middleware now carry it. |
| Repository/Settings ValueError crash | Fixed/outdated for the reported cases. Page and integer parsing now catch bad values. |
| `bool("false")` settings bug | Fixed for normal boolean payloads/lowercase strings. |
| `onKeyPress` deprecated | Confirmed active. |
| Unused imports | Likely present, but not a runtime blocker and Vite build passes. |
| `TraineeSerializer` email not validated | Fixed. It uses `EmailField`. |
| `LoginSerializer` email not validated | Fixed. It uses `EmailField`. |
| `deadline_override` hardcoded to 20 Jun 2025 | Not active. The date appears only in unused `ttcell/src/data/mockData.js`. |
| Hardcoded placement/MoD report data | Confirmed active. |
| No React error boundaries | Confirmed active. |
| No AbortController in effects | Confirmed active. |
| Race-prone manual uniqueness checks | Confirmed as design risk. |
| Non-functional contact form | Confirmed active. |

## Recommended Fix Order

1. Rotate and remove committed JWT private key; add `.gitignore`; stop tracking secrets/runtime/build artifacts.
2. Harden production settings defaults (`DEBUG=false`, required `SECRET_KEY`, required production origins/hosts).
3. Enforce password-change flow and replace deterministic trainee/admin default passwords.
4. Remove reset-token response/log exposure except in explicit test-only paths.
5. Fix active user-facing correctness bugs: trainee spinner, 0% attendance display, analytics chart key mismatch.
6. Replace fake/default report values with `N/A` or live data, and wire/disable the contact form.
7. Clean broad exception handling, password policy consistency, deprecated handlers, and request lifecycle polish.

## Additional automated scan findings (2026-06-23)

The verification pass also found the following concrete artifacts not explicitly detailed above:

- `ttc_backend/.env:1` contains a hardcoded `SECRET_KEY` value (example: `django-insecure-ttcell-vocational-training-secret-key`).
- `ttc_backend/jwt_private.pem` is present in the repository (private signing key).
- No repository-root `.gitignore` was found; a `.gitignore` exists under `ttcell/.gitignore` only.
- `ttc_backend/db.sqlite3` is present in the repository root of the backend (tracked runtime DB file).
- Numerous compiled Python caches (`__pycache__/*.pyc`) are present across the backend codebase.
- Frontend build artifacts exist under `ttcell/dist/` and are tracked in git (e.g., `ttcell/dist/index.html`, `ttcell/dist/assets/*`).
- Broad exception handlers were located in scripts: `ttc_backend/migrate_db.py` (multiple `except Exception as e:` occurrences) and `ttc_backend/debug_500.py` (`except Exception as e:`).

These items increase the urgency of the recommendations to remove secrets, add/expand `.gitignore`, and stop tracking generated/runtime artifacts before any public push or deployment.

# HTTPS Fixes Changelog

**Prepared By:** Senior Application Security Engineer
**Date:** 2026-06-18
**Project:** TTC Vocational Training Platform

## Backend Configuration Patches

* **File Modified:** `ttc_backend/ttc_project/settings.py`

### 1. Hardened Allowed Hosts List
* **Previous State:** `ALLOWED_HOSTS = ['*']`
* **New State:** `ALLOWED_HOSTS` dynamically parses the `ALLOWED_HOSTS` environment variable via `os.environ.get`.
* **Reasoning:** Mitigates Host Header Injection vulnerabilities. By default, it safely falls back to `['localhost', '127.0.0.1']` to ensure local development pipelines remain unbroken.

### 2. Enabled HTTPS and Redirect Enforcements (Production Only)
* **Previous State:** No HTTPS enforcement mechanisms were implemented globally at the framework level.
* **New State:** Added the following configurations wrapped inside an `if not DEBUG:` block:
  * `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')`
  * `SECURE_SSL_REDIRECT = True`
* **Reasoning:** Ensures that if the application is deployed in production (`DEBUG=False`), Django correctly identifies traffic forwarded by an SSL terminating proxy. It will actively redirect any stray HTTP connections to HTTPS.

### 3. Enabled HTTP Strict Transport Security (HSTS)
* **Previous State:** Missing HSTS implementation.
* **New State:** 
  * `SECURE_HSTS_SECONDS = 31536000` (1 Year)
  * `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`
  * `SECURE_HSTS_PRELOAD = True`
* **Reasoning:** Instructs compliant web browsers to exclusively connect to the application via HTTPS, preventing protocol downgrade attacks (e.g. SSLStrip).

### 4. Hardened Security Headers and Cookies
* **Previous State:** Missing MIME-type and XSS blocking headers. Relying solely on localized Secure flag assignment inside JWT login logic.
* **New State:**
  * `SECURE_BROWSER_XSS_FILTER = True`
  * `SECURE_CONTENT_TYPE_NOSNIFF = True`
  * `SESSION_COOKIE_SECURE = True`
  * `CSRF_COOKIE_SECURE = True`
* **Reasoning:** Forces secure defaults globally across the entire Django architecture.

## Frontend Validation
* **File Validated:** `ttcell/src/api/axiosInstance.js`
* **Observation:** The frontend correctly utilizes relative API paths (`baseURL: '/api/v1'`) rather than hardcoding `http://` schema endpoints. 
* **Outcome:** No patch was required. The frontend will natively load HTTPS endpoints to prevent Mixed Content security warnings once served over an encrypted origin.

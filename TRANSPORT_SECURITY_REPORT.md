# Transport Security Report

**Prepared By:** Senior Application Security Engineer
**Date:** 2026-06-18
**Scope:** Application Transport Security (HTTPS, TLS, Security Headers)

## Executive Summary
A comprehensive security audit of the application's transport layer was conducted. The application consists of a Vite React frontend proxying to a Django backend. While the architecture handled HttpOnly cookies securely in production environments (`secure=not settings.DEBUG`), the overarching Django instance lacked essential TLS enforcements.

These missing enforcements left the application vulnerable to Man-In-The-Middle (MITM) attacks, Host Header Injection, and downgrade attacks in a production deployment if the reverse proxy was misconfigured. The configuration has been patched to strictly enforce Transport Layer Security (TLS) and protect HTTP headers without breaking the local development pipeline.

## Audit Findings

### 1. Insecure Host Headers (Host Header Injection)
**Severity:** HIGH
**File Path:** `ttc_backend/ttc_project/settings.py`
**Vulnerable Setting:** `ALLOWED_HOSTS = ['*']`
**Root Cause:** The application accepted any HTTP `Host` header, exposing the backend to Host Header Injection attacks, which could lead to password reset poisoning or cache poisoning.
**Exploitation Scenario:** An attacker intercepts or crafts a request specifying a malicious domain in the `Host` header. The backend constructs fully qualified URLs using this malicious domain, directing users to phishing sites via password reset emails.
**Fix Applied:** Removed wildcard allowed hosts. `ALLOWED_HOSTS` now securely parses an environment variable (`ALLOWED_HOSTS`), defaulting to local loopback addresses (`localhost,127.0.0.1`) if omitted.

### 2. Missing HTTP Strict Transport Security (HSTS)
**Severity:** MEDIUM
**File Path:** `ttc_backend/ttc_project/settings.py`
**Vulnerable Setting:** Missing `SECURE_HSTS_SECONDS`
**Root Cause:** The backend did not instruct browsers to exclusively use HTTPS, allowing attackers to strip SSL/TLS layers via downgrade attacks (e.g., SSLStrip).
**Exploitation Scenario:** A user on a public Wi-Fi network types `http://application.com`. Before the HTTP -> HTTPS redirect occurs, an attacker intercepts the request and proxies it in plaintext.
**Fix Applied:** Enabled HSTS (`SECURE_HSTS_SECONDS = 31536000`), HSTS Subdomains (`SECURE_HSTS_INCLUDE_SUBDOMAINS = True`), and HSTS Preload (`SECURE_HSTS_PRELOAD = True`) when `DEBUG=False`.

### 3. Missing HTTP to HTTPS Redirect Enforcement
**Severity:** MEDIUM
**File Path:** `ttc_backend/ttc_project/settings.py`
**Vulnerable Setting:** Missing `SECURE_SSL_REDIRECT`
**Root Cause:** The application relied entirely on the deployment infrastructure (e.g., Nginx) to redirect traffic. If infrastructure misconfiguration occurs, plaintext HTTP is permitted.
**Fix Applied:** Enabled `SECURE_SSL_REDIRECT = True` within the `DEBUG=False` block to ensure Django forcefully upgrades insecure connections.

### 4. Missing Cookie Security Flags (Session/CSRF)
**Severity:** LOW
**File Path:** `ttc_backend/ttc_project/settings.py`
**Vulnerable Setting:** Missing global `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE`
**Root Cause:** While the `refresh_token` JWT cookie was explicitly configured securely, any future Django session or CSRF cookies would have defaulted to insecure.
**Fix Applied:** Set `SESSION_COOKIE_SECURE = True` and `CSRF_COOKIE_SECURE = True` within the `DEBUG=False` block.

### 5. Missing XSS & Content-Type Security Headers
**Severity:** LOW
**File Path:** `ttc_backend/ttc_project/settings.py`
**Root Cause:** Browsers were not instructed to block MIME-type sniffing or activate XSS filters.
**Fix Applied:** Added `SECURE_BROWSER_XSS_FILTER = True` and `SECURE_CONTENT_TYPE_NOSNIFF = True`.

## Frontend Transport Observations
The frontend React application uses relative routing for APIs (`baseURL: '/api/v1'`) within `axiosInstance.js`. This is optimal for transport security, as the API requests will inherit the protocol of the hosted page. By forcing HTTPS on the backend and deployment layers, the frontend is implicitly secured against Mixed Content warnings.

## Remaining Risks and Recommendations
- **Deployment TLS Verification:** Ensure the Reverse Proxy (Nginx/Cloudflare) is terminating SSL correctly and forwarding the `X-Forwarded-Proto: https` header. Django relies on this header to recognize secure connections (via `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')`).
- **Cipher Suites:** The backend application delegates TLS termination to the proxy layer. Ensure that the proxy (e.g. Nginx) is configured to disable TLS 1.0/1.1 and only supports modern cipher suites.

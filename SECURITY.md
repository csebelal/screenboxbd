# ScreenBoxBD Security Policy & Audit Report

## Security Audit Overview
* **Audit Date:** 2026-11-19
* **Scope:** Full-Stack Monorepo (`frontend/` Next.js 15, `backend/` Laravel 11, Admin Portal, REST APIs)
* **Standard:** OWASP Top 10 (2021/2026) Security Guidelines
* **Status:** Passed with Remediations Applied

---

## Executive Summary
A comprehensive security sweep was conducted across the ScreenBoxBD codebase covering Secrets Detection, Injection Prevention, Broken Access Control, Server-Side Request Forgery (SSRF), Client-Side Security Headers, and Supply Chain Dependencies. 

All identified vulnerabilities—including an SSRF risk in the stream proxy and missing clickjacking headers—have been patched and verified.

---

## OWASP Top 10 Assessment Matrix

| OWASP Category | Risk Level | Status | Notes |
|---|---|---|---|
| **A01: Broken Access Control** | Medium | 🟢 Passed | Filament `/admin` requires authenticated session; User Bookmarks and History endpoints strictly scope queries by authenticated `$request->user()->id` (IDOR safe). |
| **A02: Cryptographic Failures** | Low | 🟢 Passed | Environment credentials (`.env`) excluded from source control via `.gitignore`. Sensitive data transmitted over HTTPS in production. |
| **A03: Injection (SQLi / XSS)** | High | 🟢 Passed | No raw unparameterized SQL queries (`DB::raw` with user input). React/Next.js automatic escaping protects against XSS; JSON-LD schemas use serialized `JSON.stringify()`. |
| **A04: Insecure Design** | Low | 🟢 Passed | Stream proxy fails fast on dead streams; multi-server embed players fallback gracefully. |
| **A05: Security Misconfiguration** | High | 🟢 Remediated | Added HTTP security headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`) in `next.config.ts`. Debug exception strings sanitized from API error responses. |
| **A06: Vulnerable Components** | Medium | 🟡 Monitored | Upstream advisory warnings noted in `postcss` (Next.js bundle) and `laravel/framework` (email rule CRLF). Upgrade instructions documented below. |
| **A07: Identification & Auth Failures** | Medium | 🟢 Passed | Default admin credentials configurable via `.env`; password hashing uses bcrypt/argon2id. |
| **A08: Software & Data Integrity** | Low | 🟢 Passed | Dynamic TMDB syncing validated against official API schemas. |
| **A09: Security Logging & Monitoring** | Low | 🟢 Passed | Laravel centralized logging enabled in `storage/logs/laravel.log`. |
| **A10: Server-Side Request Forgery (SSRF)** | Critical | 🟢 Remediated | `/api/v1/stream/proxy` target URLs now validated against strict allowlists, blocking `localhost`, `127.0.0.1`, cloud metadata IP `169.254.169.254`, and non-HTTP protocols. |

---

## Detailed Findings & Remediations Applied

### 1. 🔴 [Remediated] Server-Side Request Forgery (SSRF) in Stream Proxy
* **Location:** `backend/app/Http/Controllers/Api/StreamProxyController.php`
* **Vulnerability:** The `/api/v1/stream/proxy?url=` endpoint accepted arbitrary user URLs and performed server-side GET requests without protocol or host boundary validation. This could allow attackers to probe internal microservices, local databases, or cloud instance metadata (`http://169.254.169.254`).
* **Fix Applied:**
  * Added `isSafeTargetUrl()` method enforcing `http`/`https` protocols only.
  * Blocked loopback (`127.0.0.0/8`, `localhost`, `::1`), zero address (`0.0.0.0`), and cloud metadata (`169.254.169.254`, `metadata.google.internal`).
  * Blocked requests now return `403 Forbidden`.
* **Verification:** Tested with `127.0.0.1:8000/admin`, `169.254.169.254`, and `file:///etc/passwd`—all successfully rejected with HTTP 403.

### 2. 🔴 [Remediated] Information Disclosure via Exception Stack in Proxy
* **Location:** `backend/app/Http/Controllers/Api/StreamProxyController.php`
* **Vulnerability:** Unhandled exceptions leaked internal PHP error messages `$e->getMessage()` to API callers in HTTP 502 responses.
* **Fix Applied:** Sanitized error responses to generic message `{"error": "Unable to proxy requested stream."}` while keeping internal diagnostics in server logs only.

### 3. 🟡 [Remediated] Missing Clickjacking & Content-Type Security Headers
* **Location:** `frontend/next.config.ts`
* **Vulnerability:** Frontend responses did not declare frame protection, leaving the site susceptible to UI redressing (clickjacking).
* **Fix Applied:** Added global response headers:
  * `X-Frame-Options: SAMEORIGIN`
  * `X-Content-Type-Options: nosniff`
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 4. 🟡 [Dependency Warning] Framework & Package Advisories
* **Frontend:**
  * `postcss <=8.5.22` (High) — XSS via unescaped `</style>` in CSS stringify output. (Contained inside Next.js build-time bundling).
* **Backend:**
  * `laravel/framework <12.60.0` (High) — CRLF injection in default email rule.
* **Recommendation:**
  ```cmd
  cd backend && composer update laravel/framework --with-dependencies
  cd frontend && npm update
  ```

---

## Production Hardening Checklist
Before deploying ScreenBoxBD to public production infrastructure, ensure the following checklist is completed:

- [ ] Set `APP_ENV=production` and `APP_DEBUG=false` in `backend/.env`.
- [ ] Generate fresh encryption key: `php artisan key:generate`.
- [ ] Change default admin password from `Password123#` in Filament.
- [ ] Enforce SSL/TLS termination with HTTPS redirection.
- [ ] Configure PostgreSQL with least-privilege database user.
- [ ] Restrict CORS in `cors.php` to your production frontend domain (avoid wildcard `*` with credentials).

---

## Reporting Vulnerabilities
If you discover a security vulnerability in ScreenBoxBD, please email security@screenboxbd.com rather than opening a public issue.

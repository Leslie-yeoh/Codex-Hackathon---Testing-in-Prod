---
name: web-dev-rules
description: Use when building, editing, or reviewing backend/server/API code in this repo (Node, Python, Java, Go, Ruby, PHP, C#, Rust, Elixir). Covers folder structure, naming conventions, server-side security pipeline, auth/authz, error handling, caching, logging, queues, and API/deploy standards.
---

# Web Development Rules

**Role:** Senior Web Developer & Systems Engineer
**Specialty:** Enterprise-grade server-side applications with zero-trust security
**Mission:** Build resilient backend systems with comprehensive, layered security.

## Supported frameworks
Node.js (Express, NestJS, Fastify, Koa) · Python (Django, Flask, FastAPI) · Java (Spring Boot, Quarkus) · Go (Gin, Echo, Fiber) · Ruby on Rails · PHP (Laravel, Symfony) · C# (.NET Core) · Rust (Actix, Rocket) · Elixir (Phoenix)

## Folder structure
```
src/
├── controllers/    ├── models/        ├── services/       ├── repositories/
├── middleware/     ├── routes/        ├── validators/     ├── schemas/
├── config/         ├── constants/{shared,features}/       ├── utils/  ├── helpers/
├── decorators/     ├── guards/        ├── interceptors/   ├── pipes/  ├── filters/
├── auth/           ├── authorization/ ├── security/       ├── logging/ ├── monitoring/
├── caching/        ├── queue/         ├── jobs/           ├── events/  ├── listeners/
├── subscribers/    ├── tasks/         ├── migrations/     ├── seeders/ ├── tests/
├── docs/           ├── types/         ├── interfaces/     ├── enums/   ├── dto/
├── entities/       ├── providers/     ├── factories/
└── .env            # Never commit; all secrets live here only
```

## Naming conventions

- **Controllers:** `[Entity]Controller` — `UserController`, `OrderController`, `AuthController`. Files: `user.controller.js` / `user_controller.py` / `UserController.java` / `user_controller.go` / `UserController.cs`.
- **Services:** `[Purpose]Service` — `AuthService`, `PaymentService`, `TokenService`, `AuditService`. Same per-language file conventions as above (`.service.js`, `_service.py`, etc.).
- **Repositories:** `[Entity]Repository` — `UserRepository`, `OrderRepository`.
- **Models/entities:** bare `[Entity]` — `User`, `Order`, `Payment`, `AuditLog`, `Session`, `Token`.
- **DTOs:** `[Action][Entity]DTO` (`CreateUserDTO`, `UpdateUserDTO`) or `[Entity][Action]Request/Response` (`UserLoginRequest`, `UserLoginResponse`).
- **Middleware:** `[purpose]Middleware` — `authMiddleware`, `rateLimitMiddleware`, `csrfMiddleware`, `auditMiddleware`.
- **Validators:** `[Entity][Action]Validator` — `UserCreateValidator`, `OrderCreateValidator`.
- **Constants:** `UPPER_SNAKE_CASE` globally (`JWT_SECRET`, `DATABASE_URL`, `RATE_LIMIT_MAX`) and `[FEATURE]_UPPER_SNAKE_CASE` per domain (`ORDER_STATUSES`, `PAYMENT_METHODS`).
- **Utilities** grouped by purpose: security (`hashPassword`, `generateCSRFToken`, `sanitizeInput`), data (`deepClone`, `deepMerge`), file (`uploadFile`, `validateFileType`), date, string, number, array, object helpers — keep pure and colocated by category.

## Server-side security pipeline

Every input passes through, in order:

1. **Sanitize** — strip dangerous characters, escape, strip HTML, normalize unicode, block SQL/NoSQL injection vectors.
2. **Validate** — type, pattern, length/range, format, business rule, schema validation against DB constraints.
3. **Authorize** — authentication check, permission check, role check, ownership check, scope check, IP whitelist, rate limit.
4. **Encrypt** — AES-256 for data at rest, RSA where asymmetric is needed, bcrypt/argon2 for passwords, sign sensitive payloads.
5. **Decrypt** — corresponding decrypt/verify on read.
6. **Log** — audit trail, security events, access logs, error logs, performance metrics.

### Protection protocols
1. SQL injection — parameterized queries / ORM / prepared statements only, never string-concatenated SQL.
2. NoSQL injection — schema validation + input sanitization before any query.
3. XSS — output encoding + CSP.
4. CSRF — tokens + `SameSite` cookies.
5. Rate limiting — per IP, per user, per endpoint.
6. Authentication — JWT / OAuth2 / OIDC, MFA where sensitive.
7. Authorization — RBAC (below) or ABAC/PBAC as the domain requires.
8. Encryption — in transit (TLS) and at rest.
9. Input validation — whitelist-first, regex/schema-backed.
10. Output encoding on every response surface.
11. Session management — secure, `HttpOnly`, `Secure`, `SameSite` cookies.
12. Error handling — generic client-facing messages, no stack traces leaked.
13. Logging & monitoring — audit logs + security events retained per policy.
14. Dependency management — regular updates, vulnerability scanning (`npm audit`, `safety`, etc.).
15. Security headers — HSTS, `X-Content-Type-Options`, `X-Frame-Options`.

### Env variables (secrets — never commit)
Server: `NODE_ENV`, `PORT`, `HOST`, `API_PREFIX`. Database: `DATABASE_URL`, pool size, timeout, SSL. Redis: `REDIS_URL`, password, TTL. JWT: `JWT_SECRET` (32+ chars), expiry, algorithm, issuer/audience. Session: `SESSION_SECRET`, timeout, cookie flags. Encryption: `ENCRYPTION_KEY` (AES-256), `HASH_SALT_ROUNDS` (bcrypt, ≥12). Email/SMS provider creds. Cloud storage creds (least-privilege IAM). Rate limiting: window/max/burst. CORS: explicit origin allowlist, not `*`, with `CORS_CREDENTIALS` only when needed. CSP + HSTS directives. Logging level/destination. Metrics/tracing/health-check endpoints — keep these behind auth or internal network only. Queue/cache provider config. OAuth2 client id/secret per provider. 2FA/TOTP config. Webhook timeout/retry/payload-size limits.
Keep a `.env.example` template in the repo with keys but no values.

## API endpoint checklist

Every endpoint must cover: input validation (body/query/params/headers, sanitized, typed, pattern/length/range/format-checked) → authentication + authorization + permission/role/ownership/scope + rate limit → business rule validation and transformation → data access with transaction and cache management → response serialization with correct status/headers (rate-limit, cache, CORS) → error handling via try/catch with sanitized, generic messages and full server-side logging → request/response/error/performance/security/audit logging → performance (pagination, filtering, sorting, field selection, caching, compression, timeouts, connection pooling).

### Standard response shape
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {},
  "meta": { "timestamp": "", "version": "1.0.0", "path": "", "method": "", "duration": 0 },
  "pagination": { "page": 1, "limit": 25, "total": 100, "totalPages": 4, "hasNext": true, "hasPrev": false },
  "links": { "self": "", "next": "", "prev": null, "last": "" }
}
```

### Error response shape
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email format", "code": "INVALID_EMAIL" }],
  "meta": { "timestamp": "", "version": "1.0.0", "path": "", "method": "" }
}
```

## Middleware layers

Security (CORS, CSP, HSTS, XSS/clickjacking/MIME-sniffing protection, rate limiting, IP filtering) → Authentication (token/session/JWT/OAuth/2FA verification, lockout checks) → Authorization (role/permission/ownership/scope) → Validation (body/query/params/headers/schema + sanitization) → Logging (request/response/error/performance/security/audit) → Performance (compression, caching, timeouts, pooling, circuit breaker, retry).

## Repository pattern

`BaseRepository` implements `create`, `findById`, `findAll`, `update`, `delete`, each validating input, checking cache, applying pagination/sorting/filtering where relevant, checking ownership/permissions before mutation, updating cache after writes, and logging the operation. Also provides `transaction()` (start → execute → commit/rollback) and `invalidateCache()`.

## Authentication service (JWT-based)

`register` → validate/sanitize → uniqueness check → hash password → create user → verification token/email → log.
`login` → validate/sanitize → rate-limit check → find user → verify password → check account status/MFA → issue tokens → update session → log.
`verifyToken` / `refreshToken` → signature, expiry, issuer/audience, revocation checks.
`logout` → clear session, invalidate tokens, log.
`resetPassword` / `updatePassword` → validate, hash new password with bcrypt/argon2, log.
`setupMFA` / `verifyMFA` → generate secret + QR, verify code, enable MFA.

## Authorization (RBAC)

Define permissions as `resource:action` strings (`user:create`, `order:update`, `system:admin`, `audit:export`). Define roles (`admin`, `manager`, `user`, `guest`) as permission sets — admin gets full CRUD + system + audit; manager gets scoped read/update + reporting; user gets self-service create/read; guest gets read-only public data. `checkPermission` must verify role, permission, resource ownership, and resource type before allowing an action. Role assignment/removal requires admin permission and is logged.

## Error handling

Use a typed `AppError(message, statusCode, errorCode, details)`. Categorize by type (`VALIDATION_ERROR`, `AUTHENTICATION_ERROR`, `AUTHORIZATION_ERROR`, `NOT_FOUND_ERROR`, `RATE_LIMIT_ERROR`, `CONFLICT_ERROR`, `DATABASE_ERROR`, `BUSINESS_RULE_ERROR`, `INTERNAL_SERVER_ERROR`) with numeric codes grouped by range (validation 1000s, auth 2000s, authorization 3000s, not-found 4000s, conflict 5000s, database 6000s, file 7000s, external-service 8000s, business-rule 9000s). Central `ErrorHandler` logs, sanitizes, determines status/error code, builds the standard error response, tracks/alerts on critical errors, and never leaks internals to the client.

## Caching

`CacheService` (Redis-backed) exposes `get`/`set`/`delete`/`clear(pattern)`/`remember(key, callback, ttl)`, all wrapped in try/catch that logs and fails soft (never throws into request path on a cache miss/outage).

## Logging

Structured `Logger` with levels (`error`, `warn`, `info`, `http`, `debug`, `trace`), each entry timestamped with metadata/context. Dedicated methods for request/response logging, audit logging (user, action, resource, details), security event logging, and performance logging (operation, duration, metadata).

## Queue & background jobs

`QueueService` (e.g. Bull/Redis) exposes `addJob`, `processJob` (with success/failure/retry handling), and `scheduleJob` (cron-based). Common job types: `sendEmail`, `sendSMS`, `generateReport`, `exportData`, `processPayment`, `sendWebhook` — each validates its payload before enqueueing.

## Testing

Unit (Jest/Mocha/PyTest/JUnit), integration, API (Supertest/Postman), security (OWASP ZAP), performance/load/stress (K6/JMeter), penetration, database, cache, queue, migration, and seeder tests.

## Deployment gate

Env vars validated · migrations run (and seeded if needed) · TLS + security headers set · rate limiting active · auth/authz enabled · CORS configured · error handling correct · logging/monitoring active · backups configured · dependencies audited · health check + metrics/trace endpoints secured (not public) · API docs (OpenAPI/Swagger) current · load balancing/auto-scaling configured · disaster-recovery and incident-response plans ready · alerting and on-call configured · rollback plan ready.
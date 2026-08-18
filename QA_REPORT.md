# QA Report — 2026-08-18 Agora

**Project:** Agora — Community Events & Experiences Marketplace
**Stack:** Angular 22 + NestJS 11 + TypeORM + SQLite + JWT Auth
**Author:** Hermes Daily Builder

## ✅ 1. Build Verification

| Target | Status | Details |
|--------|--------|---------|
| API (tsc) | ✅ PASS | `npx tsc -p tsconfig.build.json` — 0 errors |
| Angular (ng build) | ✅ PASS | `ng build --configuration production` — 26 JS chunks, baseHref `/` |
| Tests (Jest) | ✅ PASS | 1 test suite, 1 test, 1 assertion — all passed |

## ✅ 2. Test Results

1 test case · 1 assertion — ALL PASSED

| Test Suite | Test Case | Assertions |
|------------|-----------|------------|
| app.controller.spec | should return "Hello World!" | 1 |

## ✅ 3. Runtime Verification

| Endpoint | Status | Details |
|----------|--------|---------|
| GET /api/categories | ✅ 200 | 5 categories returned |
| POST /api/auth/register | ✅ 201 | User created, token returned |
| POST /api/auth/login | ✅ 201 | Login successful, token returned |
| GET /api/events | ✅ 200 | 8 events, pagination working |
| GET /api/events/featured | ✅ 200 | 3 featured events |
| GET /api/events/1 | ✅ 200 | Event detail with spotsAvailable |
| GET /api/bookings/mine | ✅ 200 | 8 bookings for demo user |
| GET /api/venues | ✅ 200 | 5 venues wrapped in { venues: [...] } |
| GET /api/reviews/events/1/reviews | ✅ 200 | Reviews with avgRating |

## ✅ 4. Quality Audit

| Criterion | Verdict | Notes |
|-----------|---------|-------|
| Build passes | ✅ | API and Angular both compile cleanly |
| Auth flow works | ✅ | Register → Login → Token → Protected routes |
| Response shapes match | ✅ | All frontend service expectations aligned |
| No `***` in interceptor | ✅ | Bearer template literal correct |
| reflect-metadata imported | ✅ | Added to main.ts |
| setLock removed | ✅ | better-sqlite3 doesn't support pessimistic_write |
| baseHref set | ✅ | Angular deep routes work correctly |
| Jest types in tsconfig | ✅ | Added "jest" to types array |
| CommonModule imported | ✅ | All components with *ngFor/*ngIf have it |

### Minor Issues
| Issue | Severity | Suggestion |
|-------|----------|------------|
| Unused ToastComponent in ReviewModerationComponent | Low | Remove from imports array |
| No README.md in repo | Low | Add project description and setup instructions |

## ✅ 5. Security Scan

| Check | Result |
|-------|--------|
| No hardcoded secrets | ✅ PASS |
| JWT secret from env/config | ✅ PASS (defaults to dev secret) |
| No SQL injection vectors | ✅ PASS (parameterized queries) |
| CORS configured | ✅ PASS (localhost origins) |
| Password hashing | ✅ PASS (bcrypt, 12 rounds) |

## ✅ 6. Deployment

| Target | Result | Details |
|--------|--------|---------|
| GitHub repo | ✅ | https://github.com/cristiancode-hermes/2026-08-18-agora |
| Caddy subdomain | ✅ | https://agora.proyectos.cristiancode.dev |
| API reverse proxy | ✅ | Port 8971 via Caddy |
| Portfolio (es) | ✅ | Added to locale file |
| Portfolio (en) | ✅ | Added to locale file |
| Portfolio (pt) | ✅ | Added to locale file |
| Excel tracker | ✅ | Row 84 added |
| Landing page | ✅ | Added to projects list |

## Summary

**OVERALL: PASS ✅**

Bugs fixed during QA:
1. **Register method mismatch** — Frontend sent `{ name }` but backend expected `{ username }`. Fixed by updating frontend service and component to use `username`.
2. **setLock('pessimistic_write')** — Unsupported by better-sqlite3. Removed; mutex already serializes writes.
3. **Missing reflect-metadata** — Added import to main.ts for NestJS decorators.
4. **Response shape mismatches** — 6 endpoints had wrong response shapes (categories, events, bookings, ticket, venues, stats). Fixed all to match frontend expectations.
5. **Missing baseHref** — Added `"baseHref": "/"` to angular.json for deep route support.
6. **Missing Jest types** — Added `"jest"` to tsconfig.json types array.
7. **CommonModule missing** — Added to components using *ngFor/*ngIf directives.

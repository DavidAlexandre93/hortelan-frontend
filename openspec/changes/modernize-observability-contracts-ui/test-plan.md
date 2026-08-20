# Modernization Test Plan

## 1. Objective

Prove every scenario in `modernize-observability-contracts-ui` across deterministic unit, contract, integration, SSR, browser, accessibility, visual, privacy, security, resilience, and delivery checks. The plan defines what "100 percent covered" means and prevents a high percentage from hiding an incomplete source denominator or an untested user outcome.

## 2. Release Criteria

- All OpenSpec scenarios have passing automated evidence, except explicitly identified manual reviews with retained screenshots or reports.
- Critical reliability modules maintain 100 percent statements, branches, functions, and lines.
- Broader maintained-source coverage does not fall below the recorded honest baseline in any metric and follows a nondecreasing ratchet.
- Required suites contain no unexpected skips, retries, focused tests, flaky quarantine, console errors, unhandled rejections, or external network dependency.
- OpenAPI generation is deterministic, valid, and produces no tracked diff.
- Accessibility scans report no unresolved WCAG 2.2 AA violations on required routes and states.
- Responsive visual baselines have no unapproved diff, overlap, clipping, inaccessible action, or page-level horizontal overflow.
- Production and SSR builds pass Node 24, CSP, asset security, dependency audit, source reachability, and compressed bundle budgets.
- Telemetry-disabled, telemetry-enabled, collector-unavailable, backend-unavailable, health-absent, and interrupted-mutation scenarios all preserve a usable application.

## 3. Ownership

| Area                                               | Accountable owner                  | Required collaboration                                  |
| -------------------------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| UI, application services, contracts, tests         | Frontend maintainers               | Product and design for pt-BR copy and visual acceptance |
| API DTO compatibility and committed outcomes       | Backend API owner                  | Frontend maintainers                                    |
| ACID transactions and idempotency persistence      | Backend service and database owner | Frontend maintainers                                    |
| OTLP endpoint, authentication, sampling, retention | Platform/observability owner       | Security and privacy owner                              |
| CI, Vercel, Node 24, release evidence              | Delivery owner                     | Frontend maintainers                                    |
| PII classification, consent, telemetry policy      | Security/privacy owner             | Product and platform owners                             |

Unresolved external ownership does not weaken a frontend assertion. The corresponding integration stays disabled or unknown until a compatible contract is confirmed.

## 4. Coverage Policy

### Critical 100 Percent Scope

The following implemented concerns must have per-file 100 percent statement, branch, function, and line coverage:

- DTO primitives, operation registry, request validation, response validation, and OpenAPI generation helpers.
- Error kinds, error normalization, stack-location parsing, safe presentation mapping, and incident identifiers.
- Telemetry allowlisting, PII redaction, JSON serialization, aggregation, limits, sampling, and no-op behavior.
- Retry classification, correlation identifiers, idempotency-key lifecycle, duplicate-command locks, and committed-outcome mapping.
- Health DTO, cache, concurrency deduplication, freshness, offline combination, and state mapping.
- Shared failure recovery policy and any pure logic controlling user recovery actions.

Every true and false branch, fallback, default, enum member, boundary, and error path must execute. Ignore comments are prohibited unless the code is provably unreachable by platform contract and the reason is approved in this file.

### Maintained-Source Denominator

Include application and platform logic under `src`, selective SSR logic under `server` and `src/entry-server.js`, and maintained delivery helpers whose failure could invalidate a release. Exclusions are limited to generated OpenAPI output, static declarative fixtures, third-party code, and environment-only entry wiring that is covered by build or browser evidence. Every excluded path must appear with a reason in the final verification report.

The first implementation run records the honest baseline. CI then rejects any decrease in statements, branches, functions, or lines. Threshold increases are committed with the tests that achieve them.

## 5. Requirement Matrix

| ID      | Requirement and scenario                                                                        | Level and fixture                                               | Expected evidence                                                                                   |
| ------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| OBS-01  | Structured exception with optional correlation and source fields                                | Unit with browser and Node stack fixtures                       | Exact sanitized JSON snapshot and 100 percent branch coverage                                       |
| OBS-02  | Missing trace or source metadata                                                                | Unit with minimal Error and non-Error throws                    | Valid event without optional fields and no secondary throw                                          |
| OBS-03  | PII, token, cookie, authorization, query, body, and nested-field redaction                      | Property and table-driven unit tests                            | No forbidden value in serialized output or snapshots                                                |
| OBS-04  | Telemetry disabled by env or consent                                                            | Integration with no-op adapter                                  | Zero export calls; application action succeeds                                                      |
| OBS-05  | OTEL trace and allowlisted W3C propagation                                                      | Integration with local request collector                        | Correlated span and header only on approved origin                                                  |
| OBS-06  | OTLP collector unavailable                                                                      | Browser and integration timeout fixture                         | No blocked navigation or API call; bounded exporter failure                                         |
| OBS-07  | Duplicate event storm and memory bounds                                                         | Fake-clock unit test                                            | Aggregate count retained; buffers and retries remain within limits                                  |
| OBS-08  | Lifecycle flush                                                                                 | Browser page visibility and unload fixture                      | One bounded best-effort flush; navigation completes                                                 |
| CON-01  | Valid and invalid outbound DTOs                                                                 | Contract tests per operation                                    | Invalid transport call count remains zero                                                           |
| CON-02  | Valid, nullable, boundary, unknown-enum, and malformed responses                                | Contract tests with MSW fixtures                                | Typed data or distinct contract error for every fixture                                             |
| CON-03  | OpenAPI validity and deterministic drift                                                        | Generation plus validator in a clean worktree                   | Valid OpenAPI 3.1 and zero generated diff                                                           |
| CON-04  | Healthy, degraded, invalid, and unavailable health payloads                                     | Contract and integration tests                                  | Bounded status enum and safe unknown fallback                                                       |
| CON-05  | Same-command retry and new-command key lifecycle                                                | Unit and integration with interrupted response                  | Key reused only for same uncertain command; duplicates blocked                                      |
| CON-06  | Committed, rollback, conflict, partial, pending, and unknown outcomes                           | Contract plus component integration                             | Success UI only after committed response                                                            |
| REL-01  | Request and incident correlation with sanitized API diagnostics                                 | Integration with each error class                               | Stable logical request correlation and no raw body/query                                            |
| REL-02  | Safe-read retry with backoff, jitter, and retry guidance                                        | Fake-clock unit test                                            | Bounded attempts and deterministic timing envelope                                                  |
| REL-03  | Mutation without backend idempotency                                                            | Integration with transport interruption                         | No automatic retry and explicit unknown-outcome guidance                                            |
| REL-04  | Cancellation versus timeout and service failure                                                 | Unit and component tests                                        | Distinct kinds; cancellation avoids alarming notification                                           |
| REL-05  | Health freshness and stale transition                                                           | Fake-clock unit and component test                              | Healthy changes to stale or unknown at exact boundary                                               |
| ARC-01  | Production, demo, test, browser, and SSR adapter composition                                    | Integration per composition mode                                | Same feature interface with expected adapter and no direct imports                                  |
| ARC-02  | Route and application render failure recovery                                                   | Component and Playwright injected-error fixture                 | Branded state, focus, incident ID, retry, and successful recovery                                   |
| ARC-03  | Forbidden dependency direction                                                                  | Static architecture fixture                                     | Gate fails on intentionally invalid import and passes repository graph                              |
| GOV-01  | Requirement traceability and frontend/backend ownership                                         | Documentation validation                                        | Every scenario maps to task and evidence; external guarantees named                                 |
| GOV-02  | Runtime dependency and major-upgrade governance                                                 | Delivery review and bundle report                               | Rationale, compatibility, audit, and measured cost retained                                         |
| UI-01   | Dashboard and monitoring hierarchy                                                              | Playwright visual and manual design review                      | Scope, freshness, status, metrics, evidence, and actions scan in order                              |
| UI-02   | Dynamic values and stable dimensions                                                            | Component and browser long-label fixtures                       | No overlap, clipping, unexpected reflow, or shifted controls                                        |
| UI-03   | 320, 768, and 1440 responsive routes                                                            | Playwright screenshots for primary routes and states            | No horizontal overflow and all required actions reachable                                           |
| UI-04   | Loading, empty, offline, degraded, unauthorized, not-found, stale, unknown, and incident states | Component, accessibility, and visual tests                      | Distinct pt-BR state, semantics, icon, and appropriate action                                       |
| UI-05   | Keyboard, focus, live-region, heading, and accessible-name behavior                             | Testing Library and Playwright keyboard journeys                | Logical focus order, visible focus, valid landmarks and announcements                               |
| UI-06   | Contrast, zoom, touch target, and reduced motion                                                | Axe, browser media emulation, and manual report                 | WCAG AA, stable 200 percent zoom, and no nonessential motion                                        |
| QLT-01  | Format, lint, type, architecture, contracts, build, and semantic commits                        | CI fixtures plus repository run                                 | Every expected-invalid fixture fails for the intended reason                                        |
| QLT-02  | Honest denominator, critical 100 percent, and global ratchet                                    | Coverage threshold fixtures                                     | Untested critical branch and any global decrease fail CI                                            |
| QLT-03  | Dependency, reachability, deprecation, vulnerability, and bundle governance                     | Audit scripts against lockfile and build output                 | No high-severity issue, unused runtime dependency, dead source, or budget excess                    |
| SEC-01  | No credentials, secrets, PII, raw stacks, or private endpoints in assets and storage            | Build scan, browser storage inspection, and diagnostic fixtures | Zero forbidden matches and sanitized user-facing output                                             |
| AUTH-01 | Temporary fixed login in explicitly enabled demo production build                               | Production-build Playwright journey with backend unavailable    | Matching credential reaches the dashboard without backend delay and remains visibly labeled as demo |
| SEC-02  | Standard production demo authentication denied                                                  | Production-mode Playwright journey without explicit demo config | Fixed/demo credentials cannot authenticate and the service error remains recoverable                |
| SEC-03  | Demo verifiers do not disclose fixed credentials                                                | Production asset scan                                           | Plaintext email and password are absent from assets and stored session data                         |
| SSR-01  | Selective SSR with structured failures                                                          | Node tests and SSR smoke server                                 | Expected markup, valid JSON stderr, safe diagnostics, no hydration blocker                          |

## 6. Browser And Viewport Matrix

| Runtime                    | 320 px                                     | 768 px         | 1440 px        | Required focus                                           |
| -------------------------- | ------------------------------------------ | -------------- | -------------- | -------------------------------------------------------- |
| Chromium current           | Yes                                        | Yes            | Yes            | Full journey, accessibility, visual, offline, failures   |
| Firefox current            | Representative primary and incident routes | Yes            | Yes            | Navigation, forms, layout, reduced motion                |
| WebKit current             | Representative primary and incident routes | Yes            | Yes            | Safari behavior, focus, storage, transport cancellation  |
| Production SSR in Chromium | Not required for every route               | Representative | Representative | HTML response, hydration, route manifest, error boundary |

All dimensions are CSS pixels. Browser zoom at 200 percent and mobile touch interaction are separate required checks, not substitutes for the viewport matrix.

## 7. Data And Fixtures

- Use deterministic UUID, clock, random, retry, network, health, and telemetry adapters in unit and integration tests.
- Use MSW for API behavior and a local in-process OTLP-compatible fixture; required tests never call public services.
- Maintain valid, minimum, maximum, nullable, unknown-field, unknown-enum, malformed, delayed, canceled, unauthorized, rate-limited, conflict, partial, and interrupted fixtures.
- Use synthetic Brazilian names and addresses that are clearly fictional. Never copy production payloads, tokens, emails, telemetry, or screenshots into the repository.
- Seed each browser test independently and clean its state so order, retries, and parallel execution do not affect results.

## 8. Performance And Bundle Evidence

- Record compressed entry, Material UI, chart, telemetry-disabled, and telemetry-enabled chunk sizes.
- Compare startup, route transition, and primary dashboard rendering before and after the change under the same production build and browser profile.
- Fail when an approved bundle budget is exceeded; do not hide regression by increasing a budget without an OpenSpec decision.
- Verify collector failure adds no blocking request to application startup and no unbounded retry activity.

## 9. Execution Commands

Current commands remain valid while focused commands are added by the implementation:

```text
npm run openspec:validate
npm run format:check
npm run lint
npm run test:coverage
npm run build:ssr
npm run security:assets
npm run bundle:check
npm run audit:frontend
npm run security:dependencies
npm run test:a11y
npm run test:e2e
npm run quality:gate
```

The implementation must add deterministic commands for scoped `checkJs`, import boundaries, OpenAPI generation/validation/drift, commit-message validation, and responsive visual comparison, then include them in `quality:gate`.

## 10. Evidence And Exit Report

The final verification report must record commit, Node and package-manager versions, environment mode, all command exit results, test counts, skipped and retried tests, per-metric coverage, explicit exclusions, bundle deltas, dependency findings, browser matrix, accessibility report, approved visual diffs, telemetry outage results, backend contract dependencies, and remaining risks. A task or scenario is complete only when its evidence is linked from the traceability matrix.

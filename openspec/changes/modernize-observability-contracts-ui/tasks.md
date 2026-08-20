## 1. Baseline And Integration Decisions

- [ ] 1.1 Record the current lint, format, unit, Node, coverage, build, SSR, dependency-audit, bundle, and source-reachability baselines in the change verification notes.
- [ ] 1.2 Inventory every API operation and classify its method, request DTO, response DTO, authentication, retry safety, mutation outcome, and backend idempotency support without assuming unavailable backend guarantees.
- [ ] 1.3 Resolve and document the OTLP endpoint, allowed origins, authentication policy, sampling, consent, retention owner, and environment rollout; keep export disabled by default wherever these values remain unresolved.
- [ ] 1.4 Confirm the backend health endpoint and schema or document the temporary unknown-state adapter until the backend contract exists.
- [ ] 1.5 Create a requirement-to-design-to-task-to-test traceability matrix for every scenario in this change.

## 2. Dependencies, Environment, And Boundaries

- [ ] 2.1 Validate current Node 24 compatibility, package deprecations, peer requirements, licenses, and browser support for the proposed OpenTelemetry and Zod-to-OpenAPI packages before adding them.
- [ ] 2.2 Add only the approved OpenTelemetry runtime packages and verify they are isolated in a conditionally loaded production chunk.
- [ ] 2.3 Add the approved OpenAPI generation and validation development packages and lock deterministic versions.
- [ ] 2.4 Add environment schemas for telemetry enablement, collector URL, allowed propagation origins, sampling, health path, freshness interval, and diagnostic limits with privacy-safe defaults.
- [ ] 2.5 Add narrow platform ports for transport, observability, health, identity, clock, and identifier generation with JSDoc contracts.
- [ ] 2.6 Add a single composition root that selects browser, SSR, production, demo, no-op, and test adapters without changing feature presentation imports.
- [ ] 2.7 Add deterministic import-boundary rules that prevent pages and presentation components from importing concrete transport, storage, or telemetry adapters.

## 3. Errors And Privacy-Safe Diagnostics

- [ ] 3.1 Define bounded enums and a typed application error envelope for validation, contract, authentication, authorization, conflict, timeout, cancellation, offline, rate-limit, dependency, and unexpected failures.
- [ ] 3.2 Implement error normalization for thrown values, fetch failures, schema failures, aborts, HTTP errors, and render errors with safe retry guidance.
- [ ] 3.3 Implement best-effort stack parsing for supported browser and Node formats, including error class, source file, line, and column.
- [ ] 3.4 Implement an allowlist-first telemetry serializer that removes PII, secrets, raw bodies, unsafe query values, and unapproved nested fields before buffering.
- [ ] 3.5 Replace persisted raw reliability examples with a bounded in-memory diagnostic buffer that aggregates duplicate events and stores only sanitized fields.
- [ ] 3.6 Implement structured JSON browser and SSR log adapters with stable timestamp, severity, service, environment, event, route, incident, request, trace, and span fields.
- [ ] 3.7 Replace production raw console error paths with the structured diagnostic port while preserving useful local development output.
- [ ] 3.8 Integrate Sentry through the observability port so protected stack traces are captured once and user-facing messages remain sanitized.
- [ ] 3.9 Add exhaustive tests proving redaction, allowlisting, source extraction, aggregation limits, safe serialization, and telemetry failure isolation at 100 percent coverage.

## 4. OpenTelemetry Tracing

- [ ] 4.1 Implement a no-op trace adapter that is the default when telemetry configuration or consent does not permit export.
- [ ] 4.2 Implement lazy browser OpenTelemetry initialization with validated OTLP HTTP export configuration and bounded queue, batch, retry, and flush behavior.
- [ ] 4.3 Add manual spans for route transitions, application commands, and shared API operations with approved low-cardinality attributes only.
- [ ] 4.4 Propagate W3C trace context only to configured API origins and verify that credentials, user identifiers, and raw URL queries never become span attributes.
- [ ] 4.5 Add lifecycle flushing and duplicate-event suppression without delaying navigation or page termination.
- [ ] 4.6 Test enabled, disabled, sampled, malformed configuration, collector timeout, collector failure, and page lifecycle paths at 100 percent coverage for telemetry policy modules.
- [ ] 4.7 Measure disabled and enabled telemetry chunk sizes and startup cost against the approved bundle and performance budgets.

## 5. DTOs And OpenAPI

- [ ] 5.1 Create reusable Zod primitives for identifiers, dates, pagination, status enums, health, committed outcomes, and sanitized API errors.
- [ ] 5.2 Create a typed operation registry that pairs each API operation with method, route template, request, response, error, authentication, retry, and idempotency metadata.
- [ ] 5.3 Validate outbound path, query, header, and body DTOs before transport and return typed request-validation errors.
- [ ] 5.4 Validate successful and error responses before exposing them to application services and return distinct contract failures for drift.
- [ ] 5.5 Remove unjustified permissive schema passthrough behavior and document each intentionally extensible contract.
- [ ] 5.6 Generate a deterministic OpenAPI 3.1 document with reusable components, operation identifiers, security schemes, request schemas, success schemas, and typed error responses.
- [ ] 5.7 Add OpenAPI syntax validation and generated-artifact drift checks that leave a clean worktree when current.
- [ ] 5.8 Add positive, boundary, malformed, unknown-enum, nullable, and backend-drift fixtures for every operation contract.
- [ ] 5.9 Achieve 100 percent statement, branch, function, and line coverage for DTO primitives, operation metadata, generation, and validation logic.

## 6. API Reliability, Health, And Idempotency

- [ ] 6.1 Add a client request identifier to every API operation and correlate retries under one logical operation without logging raw request data.
- [ ] 6.2 Refactor retry classification into one policy that considers method safety, idempotency support, health, network state, status, timeout, cancellation, and server retry guidance.
- [ ] 6.3 Implement stable idempotency-key creation and reuse for the same uncertain command, plus a new key for each distinct user intent.
- [ ] 6.4 Add pending-command duplicate submission locks and preserve an explicit unknown outcome when transport ends before commit confirmation.
- [ ] 6.5 Prevent automatic mutation retries unless the operation registry declares compatible backend idempotency semantics.
- [ ] 6.6 Implement the health adapter with DTO validation, bounded timeout, short cache, freshness expiry, concurrency deduplication, and healthy, degraded, unavailable, unknown, offline, and stale states.
- [ ] 6.7 Map committed, rolled-back, conflict, partial, pending, and unknown outcomes to typed application results without optimistic false success.
- [ ] 6.8 Add deterministic 100 percent coverage for retry policy, request correlation, idempotency lifecycle, duplicate locking, health caching, staleness, and committed-outcome mapping.

## 7. Service Migration And Clean-Code Sweep

- [ ] 7.1 Migrate authentication and account services to the operation registry and bidirectional DTO validation while preserving backend identity and explicit demo-mode rules, including hash-verified temporary access for the configured demo deployment.
- [ ] 7.2 Migrate dashboard, monitoring, alerts, irrigation, tasks, reports, subscription, integration, community, support, and security services to centralized operation contracts.
- [ ] 7.3 Remove duplicated local schemas, error mapping, retry logic, unsafe diagnostic persistence, and obsolete compatibility paths after each migration is covered.
- [ ] 7.4 Run source reachability, unused export, unused dependency, duplicate dependency, and dead asset analysis; remove only verified unreachable code and assets.
- [ ] 7.5 Review modules for single responsibility, dependency direction, repetition, needless abstraction, and overlong functions, applying small behavior-preserving refactors backed by focused tests.
- [ ] 7.6 Verify that no production bundle, browser storage, source map, fixture, or environment example contains credentials, plaintext secrets, private tokens, or PII.

## 8. Application Shell And Modern Visual System

- [ ] 8.1 Refine theme tokens for surfaces, borders, typography, focus, status, density, elevation, compact radii, and reduced motion while preserving product identity and WCAG AA contrast.
- [ ] 8.2 Refine authenticated shell navigation, page headers, scope controls, freshness indicators, status summaries, and responsive content widths for faster operational scanning.
- [ ] 8.3 Create or refine shared loading, empty, offline, degraded, unauthorized, not-found, stale-data, unknown-outcome, and incident states with distinct semantics and concise pt-BR copy.
- [ ] 8.4 Upgrade application and route error boundaries with safe retry, back navigation, support path, focus management, and a copyable incident identifier.
- [ ] 8.5 Add nonintrusive health and freshness presentation that communicates limited availability without blocking unaffected workflows.
- [ ] 8.6 Refine dashboard and monitoring hierarchy so scope, freshness, primary status, metrics, evidence, and actions remain stable when data and labels change.
- [ ] 8.7 Ensure charts and dense tables expose accessible text or list alternatives and usable mobile transformations.
- [ ] 8.8 Verify every primary and failure route at 320, 768, and 1440 CSS pixels with no overlap, clipped text, page-level horizontal overflow, inaccessible action, or layout shift.
- [ ] 8.9 Verify keyboard navigation, visible focus, landmarks, headings, live regions, contrast, touch targets, zoom, and reduced-motion behavior with automated and manual evidence.

## 9. Static Analysis And Delivery Gates

- [ ] 9.1 Apply Prettier consistently and add a nonmutating format-check command to the required gate.
- [ ] 9.2 Enable scoped JavaScript `checkJs` for contracts, platform ports, error types, and service boundaries and resolve all diagnostics without broad suppression.
- [ ] 9.3 Extend ESLint rules for unsafe console use, import boundaries, promises, hooks, accessibility-sensitive patterns, and unused code using existing tooling where possible.
- [ ] 9.4 Add Conventional Commit validation in CI and document accepted types, scopes, breaking-change syntax, and release behavior.
- [ ] 9.5 Add deterministic dependency audit, deprecated-package report, unused-dependency check, source-reachability check, and compressed bundle budgets to the unified quality gate.
- [ ] 9.6 Verify CSP and connect-source configuration permits only approved API, Sentry, and OTLP endpoints in each environment.
- [ ] 9.7 Confirm Node 24.x across package metadata, CI, Vercel, local documentation, SSR, and generated artifacts with no remaining Node 20 pin.

## 10. Complete Test Plan And Coverage

- [ ] 10.1 Finalize `test-plan.md` with the implemented module paths, owners, commands, and evidence links while preserving coverage of every requirement scenario.
- [ ] 10.2 Replace the narrow coverage include list with a documented maintained-source denominator and explicit justified exclusions.
- [ ] 10.3 Configure per-file 100 percent statement, branch, function, and line thresholds for contracts, errors, redaction, idempotency, health, and recovery policy modules.
- [ ] 10.4 Record the honest broader-project coverage baseline and add nondecreasing statement, branch, function, and line ratchets.
- [ ] 10.5 Add unit tests for all deterministic branches and contract tests for every request, response, enum, error, health, and committed-outcome schema.
- [ ] 10.6 Add integration tests for composition, service migration, retry correlation, no-op adapters, collector failure, health degradation, and duplicate mutation prevention.
- [ ] 10.7 Add Node tests for selective SSR, structured JSON stderr events, redaction, route manifests, and telemetry-disabled rendering.
- [ ] 10.8 Add Playwright journeys for login boundaries, primary operations, offline recovery, degraded health, malformed API responses, unknown mutation outcomes, and route-level render failure.
- [ ] 10.9 Add automated accessibility audits and responsive visual baselines for primary, loading, empty, degraded, offline, and incident states at all target viewports.
- [ ] 10.10 Add security tests for PII and secret redaction, storage policy, CSP, trace propagation allowlists, production demo-auth denial, and sanitized user-facing errors.
- [ ] 10.11 Add resilience tests for request timeout, cancellation, rate limit, bounded retry, stale health, OTLP outage, duplicate event storms, and interrupted mutation responses.

## 11. Verification, Documentation, And Rollout

- [ ] 11.1 Document architecture boundaries, design-pattern rationale, environment variables, DTO workflow, OpenAPI generation, telemetry privacy model, health semantics, idempotency ownership, and ACID responsibility.
- [ ] 11.2 Update the traceability matrix with links to all implemented modules, tests, screenshots, reports, and quality-gate commands.
- [ ] 11.3 Run strict OpenSpec validation and resolve every warning or mismatch for this change and the canonical specification set.
- [ ] 11.4 Run the complete unified quality gate and retain passing evidence for format, lint, type checks, architecture, contracts, coverage, client build, SSR, dependencies, bundles, accessibility, visual, security, and browser journeys.
- [ ] 11.5 Verify the production-like build with telemetry disabled, telemetry enabled against a controlled collector, collector unavailable, backend unavailable, and health endpoint absent.
- [ ] 11.6 Confirm the final dependency tree has no known vulnerabilities, unjustified deprecated packages, unused runtime packages, or unreviewed major upgrades.
- [ ] 11.7 Perform a final browser review of every primary route and operational state, resolving visual inconsistency, overlap, focus, copy, and responsive defects.
- [ ] 11.8 Record rollout and rollback controls, unresolved backend dependencies, measured bundle and performance deltas, final coverage values, and residual risks before requesting archive.

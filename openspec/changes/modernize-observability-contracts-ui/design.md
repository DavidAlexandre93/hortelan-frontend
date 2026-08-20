## Context

The current React 19 and Vite 7 frontend already has a capable API client, Zod response validation, selective SSR, Sentry error capture, shared UI states, and passing build and lint gates. The audit found that contracts are repeated and permissive, outbound DTOs are not consistently validated, browser telemetry is local and can retain unsafe examples, SSR logging is unstructured, and coverage measures only a narrow hand-selected subset. The visual system is sound but operational states, hierarchy, freshness, and failure recovery can be more coherent.

This change crosses service contracts, browser and SSR diagnostics, application composition, CI, and the shared visual system. It therefore uses a lightweight ports-and-adapters structure around platform concerns while preserving stable feature and presentation code.

## Goals / Non-Goals

**Goals:**

- Provide privacy-safe JSON diagnostics and vendor-neutral trace correlation with graceful degradation.
- Validate request and response DTOs from one contract model and publish deterministic OpenAPI 3.1 documentation.
- Make errors, health, retries, idempotency, and committed outcomes explicit and testable.
- Improve the operational UI through existing Material UI primitives, tokens, and shared states.
- Enforce architecture, formatting, lint, contract, bundle, semantic commit, and honest coverage gates.
- Reach 100 percent branch, line, function, and statement coverage for critical reliability modules and prevent broader coverage regression.

**Non-Goals:**

- Moving database transactions, ACID enforcement, telemetry retention policy, or idempotency persistence into the browser.
- Rewriting all features into a ceremonial Clean Architecture directory tree.
- Adding a second component framework, a decorative animation framework, or libraries without measured value.
- Migrating the repository to TypeScript, Vite 8, or another application framework in this change.
- Exposing Swagger UI, stack traces, internal health details, or raw diagnostics to production users.

## Decisions

### 1. Use lightweight ports and adapters around platform concerns

Create narrow ports for transport, observability, health, identity, clock, and identifier generation. A composition root selects production, demo, browser, and SSR adapters. Application services coordinate DTO validation and reliability policy; pages and components consume services or hooks.

This applies Dependency Inversion where external systems change and a Facade where repeated service policy currently leaks into callers. Strategy is used only for adapter selection and retry classification. Adapter and Factory responsibilities stay small and explicit. A full domain-layer rewrite was rejected because this frontend has limited domain computation and the churn would not improve current failure modes.

### 2. Make Zod contracts executable and generate OpenAPI 3.1

Central operation definitions pair request, response, error, and parameter schemas. Service modules reference these definitions instead of declaring local permissive response shapes. Outbound DTOs are parsed before transport and inbound DTOs before use. Enums replace repeated open string unions where the backend contract is bounded.

OpenAPI is generated deterministically from the runtime schemas using a focused Zod-to-OpenAPI generator, committed as an artifact, validated in CI, and checked for drift. JavaScript remains the project language; JSDoc inference and `checkJs` are enabled first for contracts, platform ports, and service boundaries. A repository-wide TypeScript migration is a separate concern.

### 3. Introduce a sanitized error envelope and structured logger

All caught values are normalized into an application error envelope containing a stable error kind, safe message key, retry guidance, operation, incident identifier, correlation identifiers, safe status, and cause for internal handling. Source file, line, and column are parsed from supported stack formats on a best-effort basis.

The logging pipeline builds an allowlisted JSON event and performs redaction before buffering or export. Browser diagnostics use a bounded in-memory buffer; no raw event context is persisted to local storage. SSR writes one JSON object per line to standard error. Complete stacks may be sent only to the configured protected diagnostic backend. User views receive a safe message and incident identifier, never the stack or raw backend response.

### 4. Add OpenTelemetry as a conditional tracing adapter

Use the OpenTelemetry API plus focused browser tracing and OTLP HTTP export packages. Initialize them lazily only when a validated collector endpoint is configured and telemetry policy allows export. Manual spans cover navigation transitions, application commands, and the shared transport path first; broad auto-instrumentation is deferred until its bundle cost, browser support, and duplicate reporting with Sentry are measured.

W3C trace context is propagated only to allowlisted API origins. Export queues, batches, retry time, and shutdown flush are bounded. Sentry remains the error and release diagnostic adapter during migration; OpenTelemetry provides vendor-neutral traces through the observability port. Neither provider is allowed to gate application startup or API calls.

### 5. Treat health and idempotency as explicit contracts

The health adapter validates `/health`, caches successful responses for a short configured interval, marks them stale after expiry, and combines them with browser connectivity without treating either signal as proof of backend health. Shared state maps healthy, degraded, unavailable, stale, unknown, and offline states to consistent UI guidance.

Mutation commands receive an idempotency key at creation, lock duplicate submissions while pending, and reuse the key only when retrying the same uncertain command. A new user intent creates a new key. Automatic retry remains limited to safe reads and mutations whose backend contract explicitly supports idempotency. Backend persistence and transactional ACID semantics are integration requirements; the UI waits for a committed outcome and represents unknown or partial outcomes honestly.

### 6. Evolve the visual system without adding a competing UI library

Keep Material UI and its icon set as the component foundation. Refine semantic tokens for surfaces, borders, focus, typography, status, density, and motion; limit card radii to the established compact range. Update the shell and monitoring views so scope, freshness, status, metrics, evidence, and actions have a predictable hierarchy. Shared loading, empty, offline, degraded, unauthorized, not-found, and incident states receive distinct accessible layouts and concise Portuguese copy.

Responsive verification targets 320, 768, and 1440 CSS pixels. Reduced motion removes nonessential transitions. Charts and dense tables provide textual or list alternatives where needed. This route avoids a new design dependency because the existing system already supplies the necessary primitives and a second framework would increase bundle and consistency risk.

### 7. Use an honest test matrix and coverage ratchet

Coverage configuration includes maintained application logic under a documented policy instead of a small positive list. Generated contracts, declarative fixtures, build entry points that cannot execute in the test runtime, and third-party wrappers may be excluded only with written reasons. Critical contract, error, redaction, idempotency, health, and recovery modules have 100 percent thresholds in every metric. Broader thresholds start from the measured baseline and ratchet upward without regression.

Unit tests cover deterministic policy. Contract tests exercise every DTO and OpenAPI drift. Integration tests cover service and adapter composition. Node tests cover SSR and JSON stderr output. Browser tests cover production identity rules, core workflows, failures, offline recovery, accessibility, reduced motion, and responsive visual screenshots. Collector outages and malformed backend responses use local deterministic fakes. Coverage percentage is evidence, not a substitute for scenario coverage.

### 8. Enforce governance in CI

Add deterministic checks for formatting, lint, scoped JavaScript type analysis, import boundaries, OpenAPI validity and drift, unit and Node coverage, production build, SSR smoke, browser flows, accessibility, visual baselines, dependency audit, unused dependency audit, and bundle budgets. Conventional Commit subjects are checked with commitlint in CI and may also be checked locally without making local hooks the sole enforcement point.

Major dependency upgrades require a dedicated compatibility change when they alter build semantics. Vite 8 is intentionally deferred because the current JavaScript-with-JSX source path requires an explicit Oxc migration. Dependency additions in this change are limited to telemetry, contract generation, and quality enforcement packages named by implementation tasks.

## Risks / Trade-offs

- **Browser OpenTelemetry support and bundle cost:** Conditional lazy loading, manual initial spans, and chunk budgets limit impact; tracing remains optional.
- **Two telemetry backends during migration:** A single observability port prevents feature coupling and avoids duplicate event capture by assigning traces and error reporting deliberately.
- **Strict DTO validation exposes existing backend drift:** Roll out operation by operation with contract fixtures and clear contract errors; do not silently pass through malformed payloads.
- **A broader coverage denominator lowers reported percentages:** Publish the new honest baseline, enforce 100 percent on critical modules immediately, and ratchet the rest through explicit milestones.
- **Health checks can add traffic or false confidence:** Use short caching, bounded timeouts, stale states, and treat health as guidance rather than a guarantee.
- **Idempotency cannot be guaranteed by frontend keys alone:** Gate automatic mutation retry on declared backend support and document the service ownership clearly.

## Migration Plan

1. Add contract, error, redaction, identifier, observability, and health primitives behind adapters with exhaustive unit tests.
2. Generate and validate OpenAPI, then migrate existing service operations incrementally to centralized bidirectional DTOs.
3. Add request correlation and idempotency metadata, keeping current retry behavior until each operation declares support.
4. Integrate structured browser and SSR diagnostics, then enable conditional OpenTelemetry export in a nonproduction environment.
5. Replace shared error and health states and refine shell and monitoring visuals; capture accessible responsive baselines.
6. Expand coverage scope and CI gates, record the baseline, and activate the critical 100 percent thresholds and global ratchet.
7. Validate production build, selective SSR, browser flows, CSP/connect policies, telemetry outage behavior, and rollback controls before enabling export in production.

Rollback is configuration-first: disable OTLP export and retain the no-op adapter, preserve Sentry error capture, and revert individual service operations to the previous adapter while contract defects are corrected. Contract artifacts and user-safe error boundaries remain useful independently.

## Open Questions

- Which OTLP collector endpoint, authentication header policy, sampling rate, and retention environment will production use?
- Which backend mutations currently guarantee idempotency-key persistence and replay semantics?
- Does the backend already expose a compatible health endpoint, or must the frontend use an interim unknown/degraded state until it is available?

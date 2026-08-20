## Why

The frontend passes its current gates, but observability, API contracts, error diagnostics, and coverage are fragmented across permissive service schemas and browser-local telemetry. Operators need a more coherent, privacy-safe experience when dependencies fail, while maintainers need traceable contracts and tests that measure the actual critical surface rather than a narrow subset.

## What Changes

- Introduce privacy-safe OpenTelemetry tracing and structured JSON diagnostics correlated by trace, span, request, and incident identifiers.
- Centralize request and response DTO schemas, validate both directions, generate an OpenAPI 3.1 contract, and verify contract drift in CI.
- Standardize application errors, stack-location extraction, retry guidance, health checks, and polished recoverable failure states without exposing backend details or PII.
- Add mutation idempotency keys and duplicate-submission controls; document that transactional ACID guarantees remain backend responsibilities validated through the API contract.
- Refine the operational shell, monitoring hierarchy, status surfaces, focus states, responsive density, contrast, and reduced-motion behavior using the existing Material UI system.
- Adopt a lightweight ports-and-adapters structure for contracts, observability, identity, and platform services without rewriting stable feature presentation code.
- Expand static analysis, type checking for JavaScript contract boundaries, dependency governance, semantic commit validation, and deterministic architecture checks.
- Replace the misleading partial coverage denominator with a documented test matrix and progressive gates, reaching 100% branch/line/function/statement coverage for critical contracts, errors, redaction, idempotency, and health logic.
- Add a complete test plan covering unit, contract, integration, SSR, browser, accessibility, visual, security, resilience, and observability verification.
- Preserve existing routes, production identity rules, selective SSR, Node 24, and Vite 7 compatibility. Vite 8 and large framework migrations are explicit non-goals until their JSX/Oxc migration is specified separately.

## Capabilities

### New Capabilities

- `platform/observability`: Privacy-safe structured logs, OTEL traces, correlation, sampling, export, and diagnostics behavior.
- `platform/api-contracts`: Central DTO validation, OpenAPI generation, health contracts, idempotency semantics, and compatibility verification.

### Modified Capabilities

- `architecture/frontend-app-shell`: Add explicit application ports/adapters and unified recoverable-error presentation boundaries.
- `architecture/sdd-governance`: Require traceability from OpenSpec requirements to contract, observability, visual, and coverage verification.
- `delivery/frontend-quality`: Expand static analysis, type checks, coverage scope, conventional commits, and quality-gate evidence.
- `experience/accessible-responsive-ui`: Strengthen operational visual hierarchy, contrast, state design, responsive density, and reduced-motion criteria.
- `identity/auth-session`: Permit the requested temporary fixed demo access in an explicitly enabled deployment without shipping the email or password as plaintext client assets.
- `platform/api-reliability`: Add request correlation, idempotency metadata, health-aware recovery, DTO validation in both directions, and sanitized diagnostics.

## Impact

- Affects `src/services`, new contract and observability modules, global/route error boundaries, shared operational states, the dashboard shell, monitoring views, selective SSR logging, tests, CI, environment configuration, CSP, and documentation.
- Adds focused OpenTelemetry browser packages and OpenAPI generation/validation tooling only where measured value justifies bundle or maintenance cost; telemetry SDK loading remains conditional and lazy.
- Requires a compatible backend/collector for OTLP export, `/health` responses, trace propagation, and idempotency-key enforcement. The frontend degrades safely when those integrations are absent.
- Does not move database transactions into the browser, expose Swagger UI to production users, persist sensitive diagnostics, or log raw request/response bodies.

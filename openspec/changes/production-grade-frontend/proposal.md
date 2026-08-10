## Why

The frontend passes its current build gate, but it is not yet production-grade: critical flows have routing defects, browser security and dependency risks remain open, the initial bundle carries development-only data, large modules are difficult to test, and accessibility, responsive behavior, and UI states are not protected by automated checks. This change turns the broad quality goal into verifiable product behavior so Hortelan becomes safer, faster, clearer, and easier to evolve.

## What Changes

- Correct the application shell and identity journeys, including a real registration route, protected legacy routes, useful lazy-loading fallbacks, recoverable route errors, and accurate document metadata.
- **BREAKING**: require an explicit `VITE_ENABLE_DEMO_AUTH=true` opt-in for local/demo authentication; localhost alone will no longer activate seeded credentials or browser-stored password flows.
- Split authentication/session and the largest dashboard pages into cohesive domain modules with stable service and view-model boundaries.
- Remove development-only mock generation from the production entry graph and improve route/vendor chunking with enforceable performance budgets.
- Introduce an accessible, responsive interface contract covering keyboard use, focus, semantics, contrast, reduced motion, touch targets, and non-overlapping layouts.
- Standardize loading, empty, error, offline, success, and permission-denied states for dashboard workflows and mutations.
- Harden browser delivery with patched dependencies, environment-driven telemetry, consent-aware recording, secure headers, and removal of embedded vendor agents and stale credentials from source.
- Strengthen API boundaries with runtime response validation, canonical errors, cancellation, retry limits, and user-facing recovery behavior.
- Replace the shallow lint/audit baseline with meaningful React, accessibility, component, integration, and end-to-end checks; fix the import-graph audit so lazy modules are not reported as orphans.
- Refine the visual system and dense operational shell while preserving the Hortelan brand, routes, backend contracts, and supported product capabilities.
- Non-goals: replacing the backend, changing API endpoint contracts, migrating the whole codebase to TypeScript in one change, redesigning the Hortelan brand, or inventing backend data for unfinished integrations.

## Capabilities

### New Capabilities

- `experience/accessible-responsive-ui`: Consistent responsive layouts, keyboard and assistive-technology support, motion preferences, visual hierarchy, and interaction feedback.
- `experience/operational-workflows`: Predictable navigation and complete loading, empty, error, offline, success, and mutation states across operational dashboard journeys.
- `platform/browser-security`: Secure browser delivery, telemetry governance, dependency remediation, and prevention of production demo credentials or sensitive client configuration.

### Modified Capabilities

- `architecture/sdd-governance`: Make capability ownership, requirement traceability, readiness/completion criteria, strict local validation, synchronization, and archive evidence explicit and executable.
- `architecture/frontend-app-shell`: Correct route ownership, registration behavior, protected legacy entry points, recoverable lazy loading, metadata, and route error handling.
- `identity/auth-session`: Make backend identity authoritative, explicitly gate demo mode, remove persisted plaintext credentials, and keep session/security flows modular and testable.
- `platform/api-reliability`: Add runtime contract validation, cancellation semantics, canonical recovery behavior, and resilient user-visible states.
- `delivery/frontend-quality`: Add representative test layers, accessibility and performance budgets, secure dependency checks, and a reliable lazy-import-aware source audit.

## Impact

- Affected areas: `src/routes.js`, application bootstrap, auth/session modules, API services, theme/layout/navigation, dashboard pages, forms, shared UI states, localization, telemetry, SSR, and deploy configuration.
- Tooling and delivery: package dependencies, Vite chunking, ESLint, test runners, browser automation, accessibility checks, bundle budgets, CI/CD, and frontend audit scripts.
- Runtime behavior: clearer loading and failure recovery, explicit demo authentication, reduced initial payload, stricter client-side validation, and secure browser headers.
- Compatibility: public route URLs and backend API contracts remain stable; demo environments must opt in through configuration.

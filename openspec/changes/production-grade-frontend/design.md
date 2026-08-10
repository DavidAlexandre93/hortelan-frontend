## Context

See `proposal.md` for motivation and the delta specs for behavior contracts. The application is a React 19/Vite 7/MUI 7 frontend with route-level lazy loading, a protected dashboard, browser-backed demo identity, and selective Node SSR for public routes.

The review established the following implementation constraints and baselines:

- The source contains 134 JavaScript modules and about 19,300 lines. `MonitoringPage.js` (2,672 lines), `ProfileSettingsPage.js` (1,302), `auth/session.js` (1,045), and `PlatformStatusPage.js` (690) combine orchestration, state, domain rules, and presentation.
- The current production build succeeds, but the entry chunk is 825.19 kB minified/274.61 kB gzip, charts are 516.28 kB/139.60 kB gzip, and the entry source map shows `@faker-js/faker` contributing roughly 488 kB of unminified source to the initial graph.
- The 55 kB HTML document embeds a legacy New Relic loader and credentials, loads a missing `/fonts/index.css`, and declares English while the default interface is Brazilian Portuguese. The current CSP permits inline code and conflicts with some requested external resources.
- The dependency audit reports 15 vulnerabilities, including fixable high-severity findings in the current React Router and Vite versions.
- The automated test suite covers promotion-rule utilities only. The current structural audit marks dynamically imported routes and known imported modules as potential orphans, so its result is not trustworthy enough for deletion decisions.
- Existing backend endpoints, documented route paths, selective SSR scope, MUI foundation, and the Hortelan visual identity must remain compatible.

## Goals / Non-Goals

**Goals:**

- Establish domain boundaries that let auth, API behavior, shell behavior, and high-value pages be tested independently.
- Deliver complete, accessible, responsive, and recoverable states for critical journeys.
- Reduce security and initial-load risk with measurable, enforced delivery gates.
- Keep the change deployable in stages and preserve public URLs and backend contracts.

**Non-Goals:**

- A repository-wide TypeScript migration. New boundaries may be type-checked with JSDoc and runtime schemas, leaving a future incremental TypeScript migration possible.
- Replacing MUI, React Router, Vite, the backend identity protocol, or the Hortelan brand.
- Converting every static prototype into a live backend feature. Unintegrated data will be labeled honestly instead.
- Full dashboard SSR. Only public/auth routes remain server-rendered.

## Decisions

### 1. Deliver in guarded vertical increments

Implementation will begin with characterization tests and a fresh baseline, then proceed through security/routing, shared UI foundations, auth/API boundaries, page decomposition, and final browser/performance gates. Each increment must keep the build and the applicable test subset green.

This order makes high-risk behavior observable before moving code and prevents the broad change from becoming a single unreviewable rewrite. A full rewrite was rejected because it would obscure regressions in existing operational workflows and require simultaneous migration of every page.

### 2. Introduce feature boundaries behind stable facades

New code will be grouped by capability under `src/features/<capability>/` with `api`, `model`, `hooks`, and `ui` submodules only where each layer has real responsibility. Shared application primitives will live under `src/app/` and reusable presentation under `src/components/`.

The first extraction targets are:

- Identity: session state, demo fixtures/storage, MFA, consent, devices, and account lifecycle behind one auth facade consumed by `AuthContext`.
- Monitoring: data/model helpers, section components, dialogs, and page orchestration.
- Profile: account, security, privacy, notification, and preference sections.
- Platform status: service data, incident timeline, and status presentation.

Existing imports will migrate through compatibility exports before old modules are removed. Leaf UI modules should remain below roughly 350 lines and route orchestrators below 500 lines; exceptions require a short rationale in the quality report.

Alternatives considered: organizing only by technical type preserves current cross-domain coupling; extracting a generic abstraction for every page would create framework code before repeated behavior is known.

### 3. Use one route manifest with explicit boundaries and metadata

A route descriptor will own path, lazy module, access policy, title/description, and canonical redirect information. The client router and selective SSR route list will derive from the same descriptors where practical.

Every lazy route will render a shared accessible pending state and a route error boundary that distinguishes chunk-load/version mismatch from an application exception. Registration will load the existing registration module. Legacy product routes will redirect inside the protected boundary and preserve safe query parameters.

The splash will become bounded, reduced-motion aware, and repeat-visit aware. SSR will bypass animated splash output and render the selected public route with the same theme, helmet, auth initialization, and localization providers used by the client so hydration markup is consistent.

Alternatives considered: full dashboard SSR adds browser-storage and authenticated-data complexity without a stated SEO need; keeping separate client/server route lists would continue metadata and route drift.

### 4. Make backend identity authoritative and isolate demo identity

`AuthContext` remains the public React facade but delegates to smaller services and exposes an explicit initialization state. Production identity stores only backend-approved session material and safe profile summaries. Passwords, password history, reset tokens, MFA secrets, and simulated server records will not be persisted in browser storage.

Demo identity moves to a development-only adapter and fixture loaded only when `VITE_ENABLE_DEMO_AUTH=true`. The flag, not hostname or API misconfiguration, selects the adapter. The UI displays a persistent demo indicator. Redirect destinations are normalized to same-application paths before use.

Alternatives considered: removing demo mode entirely would disrupt local product work; automatically enabling it on localhost reproduces the current security ambiguity. Moving to a new OAuth/OIDC flow is outside the existing backend contract.

### 5. Add validated API contracts and canonical failures

`apiClient` will expose a canonical `ApiError` shape and combine timeout and caller cancellation signals. Retries remain limited to idempotent operations and will include the final retry count in sanitized telemetry. Feature services own endpoint-specific runtime validation using a direct runtime-schema dependency; malformed 2xx payloads become contract errors before reaching views.

Pages will consume feature services or hooks, never call `fetch` directly. Superseded reads are cancelled or ignored through request ownership. A shared error-to-recovery mapper selects retry, reauthentication, wait, permissions, offline, or support guidance.

Zod is preferred for response schemas because it offers synchronous parsing and structured issues without coupling API contracts to form state. Reusing Yup was considered, but its current role is form validation and mixing server-contract parsing into those schemas would blur ownership.

### 6. Build a restrained operational UI foundation

MUI remains the rendering system. Theme tokens will be normalized for spacing, radii, typography, elevation, status colors, focus rings, and motion. Excess gradients, pill shapes, and decorative elevation will be reduced in operational views while retaining Hortelan green as a brand signal and using neutral/information/warning/error colors for meaning.

Shared primitives will include route/page pending states, empty/error/offline/permission states, page headers, status indicators, confirmation dialogs, feedback regions, responsive data presentation, and stable skeletons. Pages compose these primitives instead of defining one-off state cards.

Desktop keeps a dense persistent navigation shell; mobile uses a drawer and compact toolbar with 44-pixel targets. Tables gain an intentional narrow-screen representation or contained scrolling, depending on whether row comparison or individual record scanning is primary.

Alternatives considered: a visual redesign from scratch risks brand and workflow churn; retaining every page-specific treatment prevents consistency and accessibility from becoming enforceable.

### 7. Treat accessibility and language as architecture

The theme will provide visible focus, contrast-safe status tokens, reduced-motion defaults, and global skip navigation. Icon-only controls require accessible names, overlays restore focus, async statuses use appropriate live regions, and charts provide text summaries or tabular equivalents for essential information.

The default document language becomes `pt-BR`; route metadata and the active language remain synchronized. Existing translation behavior will be wrapped behind the localization service and tested for graceful failure so third-party translation cannot block core workflows. Unsupported or incomplete locale options will not be presented as fully supported.

Automated checks combine component semantics with browser-level axe and keyboard smoke tests. Automation is not treated as proof of complete accessibility, so critical login, navigation, monitoring, and form flows also receive explicit keyboard assertions.

### 8. Consolidate telemetry and tighten browser delivery

The embedded New Relic loader will be removed. Sentry remains the error/performance provider and Vercel Analytics remains the aggregate analytics provider, both initialized from environment configuration. Optional session replay starts only after the relevant consent and uses conservative production sampling. Meticulous remains development-only and moves to development dependencies behind an explicit development flag.

Public Sans will be served locally through bundled, selected font weights or replaced by the documented system fallback; the missing stylesheet and external font dependency will be removed. With inline telemetry gone, the CSP can drop broad inline script permission and declare only required Sentry/Vercel/API origins. Equivalent headers will be applied by Vercel and the local production SSR server.

Alternatives considered: running New Relic and Sentry together duplicates browser instrumentation and expands CSP/privacy surface; keeping the inline loader also prevents a strict script policy.

### 9. Measure the actual initial graph and remove development data

Runtime modules will import deterministic static fixtures rather than Faker-generated values. Faker moves to development dependencies and is used only by test/fixture generation scripts. Chart code is loaded only by routes and sections that render charts. Manual chunks will be based on measured shared dependencies rather than a permanent chunk for every library.

The first enforced budgets will be committed after the fresh implementation baseline, with these initial targets guiding the work:

- Built HTML at or below 20 kB gzip.
- Main application entry at or below 225 kB gzip.
- No individual minified JavaScript chunk above 500 kB.
- No development-only fixture generator in the production manifest graph.
- No regression above the committed initial-route and per-route budgets without an approved OpenSpec decision.

Alternatives considered: raising Vite's warning threshold hides the current issue; aggressive micro-chunking increases requests and cache coordination without proving a user benefit.

### 10. Replace nominal checks with risk-based verification

The test stack will use Vitest and Testing Library for domain/component/integration tests, MSW for HTTP behavior, and Playwright with axe for critical browser journeys. Existing Node tests remain for standalone CI utilities. Coverage thresholds will start at a meaningful global floor and apply higher targeted expectations to auth, redirects, API errors, and security policy rather than chasing a repository-wide percentage through low-value snapshots.

The frontend audit will parse static imports, dynamic imports, and re-exports from all configured entry points before reporting reachability. Its orphan list remains advisory; duplicates, invalid boundaries, and budget breaches can be blocking. CI will run the same `quality:gate` command locally and in automation, and production dependency audits will stop being `continue-on-error` after the initial remediation.

Alternatives considered: adding snapshots for every page creates noisy coverage with little behavioral confidence; relying only on end-to-end tests makes failures slower and harder to localize.

### 11. Patch within current major lines before optional upgrades

React Router, Vite, Lodash, and affected transitive dependencies will first move to compatible patched releases and be verified by the complete suite. Major MUI, Vite, Babel, motion, or chart migrations are deferred unless a compatible security fix is unavailable.

This separates vulnerability remediation from framework migration. Blind `npm audit fix --force` was rejected because it can introduce unreviewed major-version behavior.

### 12. Treat SDD governance as executable delivery architecture

OpenSpec will remain pinned as a repository dependency and the `spec-driven` schema will carry product context, capability domains, artifact rules, and apply/archive guidance. Canonical capabilities use the stable `<domain>/<capability>` hierarchy, and modified requirements retain their canonical names so synchronization is deterministic.

One `sdd:check` command will combine root diagnosis with strict, non-interactive validation of every canonical spec and active change. The unified quality gate and CI will call that same command before implementation checks. The architecture guide and pull request template will define readiness, completion, traceability, sync, and archive evidence so the workflow remains understandable outside an agent session.

Alternatives considered: relying on a globally installed CLI makes validation depend on developer state; documenting the process without executable scripts allows drift; creating a custom schema now would add maintenance without a project-specific artifact requirement that the standard `spec-driven` graph cannot express.

### 13. Keep the production surface minimal and isolate temporary local access

Static reachability, lint, dependency, and export analysis will be combined instead of treating one tool as authoritative. Confirmed obsolete configuration, unused package roots, unconsumed exports, dead helpers, and controls with fabricated behavior will be removed. Internally used symbols remain private instead of being exported, and existing direct composition remains preferable to adding generic layers without multiple real consumers.

The requested fixed login will live only in the dynamically loaded demo identity adapter and will be selected automatically only by the Vite development environment. Production and preview builds continue to use backend-first identity unless an explicit demo deployment is configured, and build-time security scanning must prove that the unique local email and credential-bearing development branch do not appear in generated HTML, JavaScript, source maps, or static assets.

Alternatives considered: embedding the credential in the login page exposes it through presentation code and production risk; storing it in `.env.example` still requires local setup; weakening the production asset scanner would hide an actual regression. A development-only compile-time branch preserves local convenience without making the fixed credential a production authentication source.

## Risks / Trade-offs

- [Broad scope creates long-lived divergence] -> Land ordered, independently verifiable slices and keep compatibility exports until each consumer migrates.
- [Auth extraction changes security-sensitive behavior] -> Add characterization and adversarial redirect/storage tests before moving implementation; keep backend contracts unchanged.
- [Explicit demo opt-in surprises local developers] -> Add a documented `.env.example`, a visible startup error, and demo-mode instructions without enabling it by default.
- [Runtime schemas reject previously tolerated backend drift] -> Start at critical boundaries, log sanitized schema issues, and coordinate contract discrepancies instead of rendering untrusted shapes.
- [Stricter CSP breaks third-party services] -> Test the final production headers in staging and maintain a minimal documented allowlist with provider-specific smoke checks.
- [Accessibility refactors alter layout density] -> Use representative desktop/mobile visual checks and preserve task completion efficiency as an acceptance criterion.
- [Page decomposition causes subtle state resets] -> Keep state in route-level controllers or dedicated hooks and test filter, dialog, and unsaved-form continuity.
- [Bundle budgets become flaky] -> Measure deterministic production output, compare gzip bytes with small explicit tolerances, and pin the build environment.
- [New test tooling increases install and CI time] -> Split fast unit/component checks from browser checks while retaining one aggregate gate and cached browser dependencies.
- [Selective SSR differs from hosted SPA rewrites] -> Validate both static-host and SSR modes; keep SPA deployment as rollback while SSR remains optional per environment.
- [SDD artifacts drift from implementation] -> Use stable capability ownership, strict local validation, pull request traceability, canonical sync before archive, and one CI command shared with local development.
- [Temporary local credential leaks into production] -> Keep it behind the Vite development constant, dynamically load the demo adapter, and retain an exact production-asset scanner assertion for both values.

## Migration Plan

1. Capture current routes, auth outcomes, bundle graph, accessibility findings, and browser journeys as characterization tests and baseline artifacts.
2. Patch compatible vulnerable dependencies; remove embedded New Relic and broken font loading; align security headers and environment examples.
3. Correct registration, protected legacy routing, route metadata, splash behavior, lazy fallbacks, and SSR provider parity.
4. Introduce shared UI states and theme/accessibility tokens, then migrate the shell and critical auth routes.
5. Extract auth/session and API contracts behind compatibility facades; explicitly gate demo mode and migrate or discard unsafe local data.
6. Decompose monitoring, profile, and platform-status routes while applying honest data labels and complete operational states.
7. Remove production Faker reachability, tune lazy/vendor boundaries, commit budgets, and update the performance baseline.
8. Enable component, accessibility, browser, source-graph, dependency, and bundle gates in CI; run the complete quality gate in Node 24.
9. Synchronize completed delta specs, harden OpenSpec configuration and local workflows, and enforce the same strict SDD check in CI.
10. Deploy to staging with demo mode disabled, exercise CSP/telemetry/API/auth journeys, then promote through existing approval rules.

Rollback uses the previous immutable build artifact and environment configuration. The browser-storage migration is one-way only for prohibited demo secrets: rollback may require users of the old demo mode to reinitialize local demo data, but production backend sessions remain governed by the backend and public route URLs do not change.

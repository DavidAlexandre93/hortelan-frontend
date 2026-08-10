## 1. Characterization and Test Foundation

- [x] 1.1 Add direct development dependencies and scripts for Vitest, jsdom, Testing Library, MSW, Playwright, axe, and deterministic coverage reporting while retaining Node tests for CI utilities.
- [x] 1.2 Configure shared test setup, browser-safe environment mocks, API handlers, and test factories that do not enter the production bundle.
- [ ] 1.3 Add characterization tests for login, registration, session restore, MFA challenge, logout, protected-route redirect, and safe return-path behavior.
- [ ] 1.4 Add characterization tests for route paths, legacy redirects, splash timeout/error behavior, lazy loading, public SSR selection, and route metadata.
- [x] 1.5 Record a fresh reproducible baseline for dependency audit results, built asset graph, gzip sizes, document size, major route chunks, and oversized source modules.

## 2. Dependency and Browser Security Remediation

- [x] 2.1 Update React Router, Vite, Lodash, and affected transitive packages to compatible patched releases and verify that no fixable high or critical production advisory remains.
- [x] 2.2 Remove the embedded New Relic loader and credentials from the HTML document, set `lang="pt-BR"`, and provide non-empty product title, description, theme, and canonical metadata defaults.
- [x] 2.3 Replace the missing/external font chain with locally bundled selected Public Sans weights or the documented system fallback and verify offline rendering.
- [x] 2.4 Move Meticulous to development-only configuration and centralize Sentry/Vercel initialization behind environment validation and consent-aware replay controls.
- [x] 2.5 Tighten Vercel and production SSR security headers, remove unnecessary inline-script permission, and add automated assertions for CSP, framing, referrer, MIME, permissions, and transport policies.
- [x] 2.6 Add `.env.example` and deployment documentation for API, demo auth, Sentry, analytics, recording, allowed origins, and safe defaults without real credentials.
- [x] 2.7 Add a production asset scan that fails on demo passwords, prohibited auth secrets, undeclared embedded vendor credentials, or development-only modules.

## 3. Application Shell, Routing, and SSR

- [x] 3.1 Create a route manifest that owns canonical path, access policy, lazy loader, page title, description, and legacy aliases without changing documented URLs.
- [x] 3.2 Add accessible route and page pending components plus a lazy-route error boundary with bounded retry/refresh recovery.
- [x] 3.3 Route `/register` to the registration workflow, keep authenticated-user redirects, and add field, consent, service-error, and navigation tests for registration.
- [x] 3.4 Move all legacy product aliases inside the authenticated routing boundary and preserve only validated same-application query and return parameters.
- [x] 3.5 Add an explicit auth-initialization state to public/protected guards so route decisions never render a blank or incorrect intermediate page.
- [x] 3.6 Make the splash bounded, repeat-visit aware, reduced-motion aware, and safe on errors while retaining the Hortelan first-visit identity.
- [x] 3.7 Compose one provider tree for client rendering and selective SSR, render public routes instead of animated splash markup on the server, and verify hydration without mismatch warnings.
- [x] 3.8 Drive route-aware title, description, canonical identity, and document language from the route manifest and verify updates during navigation.
- [x] 3.9 Replace global error-to-404 redirection with differentiated not-found, authorization, chunk, and unexpected-error recovery plus sanitized diagnostics.

## 4. Accessible Operational UI Foundation

- [x] 4.1 Normalize theme tokens for spacing, radii, typography, elevation, focus, status colors, and motion; reduce excessive gradients, pills, and decorative shadows in operational surfaces.
- [x] 4.2 Add reusable page header, loading/skeleton, empty, error, offline, permission, status, feedback, confirmation, and responsive data-view primitives.
- [x] 4.3 Add a skip link, semantic application landmarks, visible global focus styles, reduced-motion overrides, and minimum 44-pixel target behavior.
- [x] 4.4 Refine the desktop and mobile dashboard shell for stable dimensions, scannable navigation, active-route context, compact toolbars, and no 320-pixel viewport overlap.
- [x] 4.5 Audit icon-only controls, images, menus, popovers, drawers, dialogs, and charts; add accessible names, useful alt behavior, focus restoration, and text equivalents where required.
- [x] 4.6 Synchronize active language with the document, make translation failure non-blocking, and hide any locale option that cannot provide a coherent supported experience.
- [x] 4.7 Refine login, registration, recovery, reset, not-found, and global error views using the shared states and verify keyboard, validation, mobile, and reduced-motion behavior.

## 5. Identity and Session Architecture

- [x] 5.1 Extract explicit backend and demo identity adapters, move seeded demo data into development-only fixtures, and require `VITE_ENABLE_DEMO_AUTH=true` to load the demo adapter.
- [x] 5.2 Extract session storage and lifecycle logic with minimal production persistence, idle expiry, current/all/other-session logout, and safe storage parsing.
- [ ] 5.3 Extract MFA challenge and trusted-device behavior with bounded expiry, revocation, compromise handling, and no persisted MFA secrets.
- [ ] 5.4 Extract consent, privacy export, account deletion/deactivation, and account-security operations behind the backend-authoritative facade.
- [x] 5.5 Refactor `AuthContext` to orchestrate the facade, expose initialization/demo state, preserve its consumer API where compatible, and remove implicit localhost/API-misconfiguration fallback.
- [x] 5.6 Add one-way cleanup for prohibited legacy browser values and verify that passwords, history, reset tokens, and MFA secrets are absent after every identity journey.
- [ ] 5.7 Add unit and integration coverage for adapters, storage failure, expiry, MFA, trusted devices, consent, destructive account actions, backend failure, explicit demo mode, and malicious redirects.

## 6. API Contracts and Recovery

- [x] 6.1 Implement a canonical API error model for HTTP, transport, offline, timeout, cancellation, contract, authentication, authorization, and rate-limit outcomes.
- [x] 6.2 Combine caller cancellation with request timeout, retain idempotent-only bounded retry, and include sanitized outcome kind and retry count in reliability telemetry.
- [ ] 6.3 Add Zod as a direct runtime dependency and validate authentication, session, profile, monitoring, alert, report, subscription, and integration response boundaries before rendering data.
- [x] 6.4 Add request-ownership hooks that cancel or ignore obsolete route/filter reads and prove that stale responses cannot replace newer results.
- [x] 6.5 Map canonical failures to shared retry, reauthentication, permissions, wait, offline, and support recovery states without exposing raw backend details.
- [x] 6.6 Add deterministic tests for malformed success payloads, sanitized errors, timeout versus cancellation, retry exhaustion, non-idempotent requests, stale responses, and session expiry.

## 7. Critical Page Decomposition and Workflow Polish

- [ ] 7.1 Extract monitoring domain calculations, filters, fixtures, and orchestration from `MonitoringPage` with behavior-preserving unit tests.
- [ ] 7.2 Split monitoring summary, urgent alerts, sensor health, irrigation, charts, dialogs, and secondary analysis into focused components using shared operational states.
- [ ] 7.3 Split profile account, security, privacy, notification, preference, device, and session sections while preserving unsaved input and mutation feedback.
- [ ] 7.4 Split platform-status service summaries, incidents, telemetry, and history into focused data and presentation modules.
- [ ] 7.5 Apply loading, empty, error, offline, permission, freshness, severity, and retry behavior to monitoring, alerts, reports, administration, integrations, subscriptions, species, community, status, profile, and support pages.
- [ ] 7.6 Add named confirmation and duplicate-submission protection to deletion, revocation, disconnection, deactivation, export, save, and integration mutations.
- [x] 7.7 Label mock/demo/planned data consistently and replace fabricated success for unavailable integrations with an honest unavailable state.
- [x] 7.8 Make operational tables, filters, charts, action groups, and dialogs usable at 320, 768, and 1440-pixel viewports with no unintended page overflow.
- [ ] 7.9 Add focused component/integration tests for monitoring, profile, platform status, destructive actions, offline recovery, and representative empty/error states.

## 8. Bundle, Audit, and Repository Cleanup

- [x] 8.1 Replace runtime Faker generation with deterministic static fixtures, move Faker to development dependencies, and prove it is absent from the production manifest graph.
- [x] 8.2 Load chart implementations only from chart-owning routes/sections and tune manual chunks from measured shared usage until no minified JavaScript chunk exceeds 500 kB.
- [x] 8.3 Add a deterministic bundle-budget script for HTML, entry, route, vendor, total, and forbidden-module checks using committed gzip thresholds.
- [x] 8.4 Rewrite the frontend reachability audit to resolve static imports, dynamic imports, re-exports, aliases, extensions, and all configured client/SSR entry points.
- [x] 8.5 Re-run the corrected reachability audit, manually verify candidates, and remove only confirmed dead modules, assets, legacy service-worker code, and unused dependencies.
- [x] 8.6 Review `@mui/styles`, webpack-only SVGR tooling, `history`, duplicate mock sections, and production test dependencies; remove each only after verified lack of runtime consumers.
- [x] 8.7 Update the committed performance baseline with before-and-after sizes, initial graph composition, build time, and representative route measurements.

## 9. Browser Journeys and Delivery Gates

- [x] 9.1 Configure Playwright projects and deterministic test identity/API fixtures for Chromium mobile and desktop journeys without production credentials.
- [ ] 9.2 Cover login, explicit demo login, registration, recovery, safe redirects, protected routes, logout, and auth service failure end to end.
- [ ] 9.3 Cover dashboard navigation, monitoring state/retry, profile save, destructive confirmation, legacy redirect, lazy-load recovery, and global error recovery end to end.
- [x] 9.4 Add axe scans, keyboard smoke tests, reduced-motion assertions, target-size checks, and page-overflow checks for representative public and dashboard routes.
- [x] 9.5 Add static-host and selective-SSR smoke suites that verify public route content, provider parity, metadata, security headers, hydration, and dashboard SPA fallback.
- [x] 9.6 Expand ESLint to enforce React hooks, accessibility, import hygiene, and unsafe browser patterns with zero warnings in production source.
- [x] 9.7 Update `quality:gate` and CI to run OpenSpec, strict lint/format, Node tests, Vitest coverage, build, asset security, dependency audit, bundle budgets, source audit, and browser/accessibility gates with deterministic failures.

## 10. Final Verification and Handoff

- [x] 10.1 Run the complete quality gate under the supported Node 20.x runtime and resolve every failing OpenSpec, lint, format, test, build, security, bundle, audit, browser, or accessibility check.
- [x] 10.2 Inspect the final production HTML, manifest, source maps, headers, browser storage, network requests, console, and telemetry consent behavior for prohibited data or unexpected third-party traffic.
- [ ] 10.3 Perform final desktop and mobile visual review of every route for hierarchy, copy, loading/error/empty states, focus, overlap, overflow, and brand consistency.
- [x] 10.4 Update README and architecture, security, testing, demo-mode, performance, environment, and deployment documentation to match the implemented system.
- [ ] 10.5 Re-run `openspec validate --all`, record final before-and-after metrics in the change notes, and leave all implementation tasks checked for archive review.

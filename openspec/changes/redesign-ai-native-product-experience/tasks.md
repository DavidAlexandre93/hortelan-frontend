## 1. Baseline, Dependencies, and Evidence

- [ ] 1.1 Confirm the frontend contract versions and ownership boundaries supplied by `add-ai-agronomy-copilot` and `modernize-observability-contracts-ui` before changing shared shell, state, or AI presentation modules.
- [ ] 1.2 Inventory every public and authenticated route, route group, access rule, page archetype, live or demo data source, mutation, and complete-state requirement in a versioned redesign matrix.
- [ ] 1.3 Capture deterministic before screenshots for representative routes at 320, 768, and 1440 pixel widths in light and dark themes, including loading, empty, error, offline, stale, and dense-content fixtures.
- [ ] 1.4 Record the current client entry, shell, route chunks, fonts, images, charts, interaction latency, layout shift, accessibility, console, and page-overflow baselines with reproducible commands.
- [ ] 1.5 Define approved visual, accessibility, interaction, bundle, image, and route-promotion budgets, including owners and the evidence required to approve exceptions.
- [ ] 1.6 Create a requirement-to-task-to-evidence matrix that maps every scenario in this change to implementation modules and automated or reviewed proof.
- [ ] 1.7 Define the temporary route-level redesign flag, promotion criteria, rollback behavior, and final removal criteria without changing canonical URLs or authorization.

## 2. Semantic Theme and Design Foundations

- [ ] 2.1 Replace feature-local foundation values with documented semantic tokens for canvas, surfaces, text, borders, actions, focus, status, and chart series in light and dark themes.
- [ ] 2.2 Implement the balanced green, neutral, information, warning, success, and critical palette without gradients, decorative color, or color-only meaning, then verify contrast for every state.
- [ ] 2.3 Compare Manrope-only and Manrope plus Public Sans fixtures for headings, body copy, forms, tables, navigation, and metrics, and retain the smallest option that materially improves legibility.
- [ ] 2.4 Tokenize typography roles, line heights, line lengths, tabular metrics, wrapping, truncation, and zero letter spacing without viewport-scaled font sizes.
- [ ] 2.5 Tokenize the 4-pixel spacing foundation, responsive gutters, content widths, section rhythm, grid tracks, dense and comfortable modes, and stable control dimensions.
- [ ] 2.6 Tokenize restrained radii, borders, elevations, overlays, named z-index layers, focus rings, icon sizes, and touch targets with theme parity.
- [ ] 2.7 Add instant, fast, standard, and deliberate motion tokens with approved easing and reduced-motion mappings for navigation, disclosure, refresh, streaming, and feedback.
- [ ] 2.8 Define chart tokens for categorical series, thresholds, grids, axes, tooltips, focus, selection, sparse data, stale data, and dark-theme contrast without relying on color alone.
- [ ] 2.9 Make light, dark, and system preference initialization SSR-safe, persistent, hydration-stable, and covered for charts, dialogs, status components, forms, and AI surfaces.
- [ ] 2.10 Add a static design-token governance check that rejects prohibited raw production values while allowing reviewed data-derived visualization and external-brand exceptions.

## 3. Shared Composition and State Primitives

- [ ] 3.1 Build a compact page-context primitive for title, concise purpose, provenance, freshness or health, route actions, breadcrumbs where needed, and responsive overflow.
- [ ] 3.2 Build section-header, metric-strip, status-summary, evidence-row, freshness-label, and source-list primitives with stable dimensions and accessible semantics.
- [ ] 3.3 Build a consistent data toolbar with search, filter group, sorting, segmented view, result count, refresh, export, selection, bulk action, reset, and compact responsive behavior.
- [ ] 3.4 Build dense-list, table-frame, pagination, selection, row-action, detail-drawer, and compact-card fallback patterns without nested cards or unstable toolbars.
- [ ] 3.5 Build form-section, field-group, field-help, validation, step-progress, sticky-action, confirmation, destructive-action, and field-diff patterns that preserve layout when messages appear.
- [ ] 3.6 Build shared page, section, and action states for initial loading, skeleton, empty, no result, stale, offline, degraded, unauthorized, not found, validation, rate limit, incident, pending mutation, success, failure, and retry.
- [ ] 3.7 Build chart-frame, accessible-summary, legend, tooltip, source, unit, period, freshness, sparse-series, simulated-series, and stale-series patterns with reserved responsive geometry.
- [ ] 3.8 Build media-tile, species-identity, comparison-media, loading placeholder, alternative-text, and failure-fallback patterns using stable aspect ratios and inspectable crops.
- [ ] 3.9 Build shared AI command, contextual prompt, insight item, citation, uncertainty, streaming status, generated-content label, and action-draft presentation on the dependent AI state contracts.
- [ ] 3.10 Component-test every shared primitive in long-content, compact, dense, light, dark, keyboard, reduced-motion, loading, failure, and recovery fixtures before route adoption.

## 4. Responsive Application Shell

- [ ] 4.1 Extend the route manifest with ordered Operacao, Conhecimento, Gestao, and Conta groups while preserving canonical paths, labels, access rules, lazy modules, and selective SSR metadata.
- [ ] 4.2 Redesign desktop navigation as a stable 248-pixel grouped sidebar with current-location semantics and an optional persistent icon rail whose labels remain discoverable.
- [ ] 4.3 Redesign mobile navigation as an accessible temporary drawer with focus containment, current route, context preservation, dismissal, and predictable return focus.
- [ ] 4.4 Recompose the 64-pixel top bar around navigation, deterministic search and AI command entry, operational notifications, theme, help, and account with stable utility priority.
- [ ] 4.5 Integrate direct destinations, semantic results, generated answers, and reviewable action plans in one lazy command surface with distinct semantics and a deterministic fallback.
- [ ] 4.6 Add a stable shell band for offline, degraded service, active incident, and recovery communication without covering navigation or page commands.
- [ ] 4.7 Replace route-level spinners with context-preserving pending frames and route-scoped lazy-load recovery that avoid blank pages and layout jumps.
- [ ] 4.8 Verify sidebar, rail, drawer, top bar, menus, badges, tooltips, dialogs, notifications, account controls, and route transitions with keyboard, touch, zoom, long labels, and both themes.
- [ ] 4.9 Prove that the redesigned shell remains fully usable when AI, notifications, telemetry exporters, or optional backend capabilities are disabled or unavailable.

## 5. Operational Overview Routes

- [ ] 5.1 Recompose monitoring around active risk, current environment, sensor freshness, next actions, compact metrics, trends, evidence, and automation while preserving live, demo, stale, and missing-data truthfulness.
- [ ] 5.2 Recompose alerts as an urgency-ordered queue plus detail, affected scope, evidence, timeline, authoritative actions, and adjacent labeled AI explanation without obscuring severity.
- [ ] 5.3 Recompose reports around period, comparison, source and freshness controls, summary metrics, charts, accessible narrative, source detail, and truthful export states.
- [ ] 5.4 Recompose platform status around service health, dependency state, incident chronology, impact, recovery, and runbook-oriented actions with safe route-local failure handling.
- [ ] 5.5 Recompose integration operations around connection health, synchronization freshness, recent failures, affected resources, retry or repair actions, and auditable outcomes.
- [ ] 5.6 Add consistent responsive list or table behavior, detail drawers, filters, empty states, offline states, stale states, incidents, pending mutations, success, and recovery to every operational route.
- [ ] 5.7 Add focused unit, component, integration, and Playwright coverage for monitoring, alerts, reports, status, and integration operations without changing domain calculations or transport ownership.

## 6. Knowledge and AI Workspaces

- [ ] 6.1 Recompose the species catalog with task-oriented search, filters, regional and seasonal context, clear plant photography, stable identity, core care facts, comparison, sources, and contextual actions.
- [ ] 6.2 Recompose species detail and comparison with inspection-grade media, responsive crops, image failure fallback, evidence, care conditions, uncertainty, and adjacent contextual AI assistance.
- [ ] 6.3 Recompose help as task-oriented search, topic navigation, authoritative articles, related workflows, source freshness, and contextual product assistance without decorative category grids.
- [ ] 6.4 Recompose community around useful posts, readable discussion, evidence, author and moderation status, search, filters, contribution states, and truthful unavailable actions.
- [ ] 6.5 Evolve Hortelan 360 into the complete conversation and intelligence workspace with history, sources, context, insight queue, semantic discovery, natural-language plans, feedback, and contextual launch points.
- [ ] 6.6 Present proactive insights, personalized reasons, semantic result explanations, form diffs, citations, uncertainty, refusals, and generated drafts through shared product patterns rather than a separate AI visual theme.
- [ ] 6.7 Source or produce only clear, rights-recorded, local or allowlisted species and crop assets, create responsive variants, register alternative-text behavior, and remove misleading or purely atmospheric media.
- [ ] 6.8 Add focused unit, component, integration, screenshot, and Playwright coverage for species, help, community, and Hortelan 360 across AI enabled, disabled, loading, empty, partial, refusal, quota, offline, and error states.

## 7. Dense Resource and Management Workspaces

- [ ] 7.1 Recompose administration around a stable resource toolbar, user or role table, selection, filters, status, detail, scoped actions, confirmation, and auditable mutation feedback.
- [ ] 7.2 Recompose integrations management around provider identity, capability, connection status, permissions, health, configuration, test, disconnect, and truthful unsupported states.
- [ ] 7.3 Recompose subscriptions around current plan, limits, usage, renewal, billing state, available changes, consequence, confirmation, and honest plan-limited or unavailable controls.
- [ ] 7.4 Recompose sessions and devices as dense inspectable resources with current-device clarity, last activity, trust or risk state, revoke actions, confirmation, progress, result, and recovery.
- [ ] 7.5 Apply shared sorting, filtering, pagination, selection, bulk actions, refresh, detail drawer, dense mode, compact fallback, empty result, error, and preservation of safe context to every management workspace.
- [ ] 7.6 Add focused unit, component, integration, and Playwright coverage for administration, integrations, subscriptions, sessions, and devices, including authorization and consequential-action paths.

## 8. Guided Forms, Account, Public, and Recovery Routes

- [ ] 8.1 Decompose onboarding into clear progress, grouped fields, contextual guidance, optional schema-validated AI field diffs, stable actions, saved progress, validation, completion, and safe recovery.
- [ ] 8.2 Recompose profile and preferences around clear sections, current state, validation, pending and saved feedback, personalization controls, privacy controls, and neutral fallbacks.
- [ ] 8.3 Recompose security around password, MFA, sessions, devices, recovery, privacy, and destructive actions with explicit scope, consequence, confirmation, audit result, and failure recovery.
- [ ] 8.4 Recompose integration setup as a guided connection flow with provider requirements, permissions, validation, test, success, rollback, and secrets that never reappear in rendered or logged state.
- [ ] 8.5 Redesign login and registration with compact brand identity, clear provider and credential states, autofill and password-manager compatibility, field-level errors, pending behavior, and truthful social-provider availability.
- [ ] 8.6 Redesign password recovery, verification, invitation, and access-denied flows with clear identity context, expiry, resend, rate-limit, success, and safe navigation.
- [ ] 8.7 Redesign not-found, route failure, global incident, maintenance, offline, and unexpected-error experiences so users retain context, receive an incident identifier when available, and have a relevant retry or safe exit.
- [ ] 8.8 Verify every guided and public form with keyboard, touch, browser autofill, long localized content, 200 percent zoom, reduced motion, light and dark themes, validation, pending, success, failure, and duplicate submission.
- [ ] 8.9 Add focused unit, component, integration, and Playwright coverage for onboarding, profile, security, integration setup, authentication, recovery, access denied, not found, and error routes.

## 9. Clean Architecture and Source Cleanup

- [ ] 9.1 Split materially changed oversized pages along independent feature state, clear input and output, repeated composition, or focused-test boundaries without extracting pass-through components solely by line count.
- [ ] 9.2 Keep route modules responsible for composition and route data, feature modules responsible for presentation and use cases, domain modules responsible for calculations, and services responsible for transport.
- [ ] 9.3 Add architecture checks that shared visual primitives cannot import pages or feature services and that route pages cannot call `fetch` directly.
- [ ] 9.4 Consolidate demonstrated duplicate toolbars, state panels, form structures, chart frames, media treatment, source treatment, and AI presentation while deleting speculative or unused variants.
- [ ] 9.5 Run source-reachability, dependency, export, style, and asset audits; remove only proven unreachable modules, obsolete overrides, duplicate styles, unused assets, and unused production dependencies.
- [ ] 9.6 Preserve unrelated user changes and existing behavior, then verify that no cleanup removes canonical routes, access rules, demo fallbacks, domain calculations, observability hooks, or security controls.
- [ ] 9.7 Enforce documented maintainability thresholds for changed pages and shared components, with a scoped, owned, time-bounded rationale for any temporary exception.

## 10. Responsive, Accessible, Visual, and Performance Gates

- [ ] 10.1 Add deterministic Playwright visual fixtures at 320, 768, and 1440 pixels for representative public and dashboard routes in light and dark themes.
- [ ] 10.2 Cover primary, loading, empty, no-result, stale, offline, degraded, unauthorized, not-found, validation, rate-limit, incident, pending, success, AI-assisted, AI-disabled, and recovery states in the visual matrix.
- [ ] 10.3 Fail the visual gate on page overflow, incoherent overlap, clipping, blank lazy routes, broken imagery, inaccessible primary controls, theme mismatch, unexpected console errors, or material layout shift.
- [ ] 10.4 Run automated accessibility checks plus keyboard, focus return, landmark, heading, dialog, form error, live region, chart summary, tooltip, touch target, 200 percent zoom, and screen-reader-oriented journeys.
- [ ] 10.5 Verify reduced-motion behavior for route transitions, drawers, menus, hover, data refresh, charts, skeletons, streaming, and success feedback without motion-dependent meaning.
- [ ] 10.6 Validate every production image and icon for purpose, subject clarity, dimensions, aspect ratio, origin or rights record, alternative-text behavior, fallback, responsive variants, format, loading strategy, and transfer budget.
- [ ] 10.7 Measure and enforce approved client entry, shell, route chunk, font, image, chart, icon, AI lazy chunk, route transition, theme switch, filter, form feedback, layout shift, and interaction budgets.
- [ ] 10.8 Run unit, component, integration, SSR and hydration, route smoke, behavior regression, visual, accessibility, architecture, asset, security, and end-to-end suites with deterministic evidence.
- [ ] 10.9 Run lint, formatting, type or contract checks, production build, bundle analysis, OpenSpec strict validation, and the repository quality gate with zero unexplained warnings or failures.

## 11. Promotion, Documentation, and Finalization

- [ ] 11.1 Promote redesigned routes by archetype only after their complete-state, responsive, theme, accessibility, behavior, asset, console, and performance evidence passes the approved matrix.
- [ ] 11.2 Execute a documented rollback rehearsal for each archetype and prove deterministic workflows remain usable when AI, optional assets, or backend enhancements are unavailable.
- [ ] 11.3 Update contributor documentation for semantic tokens, page archetypes, state composition, asset registration, route promotion, visual testing, accessibility testing, and exception ownership.
- [ ] 11.4 Update user-facing operational documentation only where navigation, terminology, workflow order, or recovery behavior materially changed, keeping the copy concise and in pt-BR.
- [ ] 11.5 Remove the temporary redesign flag, old visual paths, obsolete overrides, duplicate components, unreachable modules, and stale screenshots only after final reachability and rollback approval.
- [ ] 11.6 Re-run the complete quality and test evidence matrix after cleanup, reconcile every OpenSpec scenario, record any accepted residual risk, and obtain final release approval.
- [ ] 11.7 Sync the completed delta specifications to the main OpenSpec source of truth and archive the change only after every task and release gate is complete.

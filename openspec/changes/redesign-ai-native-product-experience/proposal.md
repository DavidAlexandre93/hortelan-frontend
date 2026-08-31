## Why

Hortelan has strong functional breadth, but the current template-derived visual language, oversized page modules, repeated card patterns, and inconsistent hierarchy make the product feel assembled rather than intentionally designed. The new AI capabilities also need to feel native to daily work, so the interface must evolve as one coherent operational product instead of attaching a chatbot to the existing shell.

## What Changes

- Replace the current visual foundation with a premium, restrained operational design system covering semantic color, typography, spacing, density, grids, surfaces, elevation, borders, iconography, charts, imagery, focus, motion, and light and dark themes.
- Redesign the authenticated shell with clearer information architecture, responsive sidebar and mobile navigation, compact page context, global deterministic search plus the AI command surface defined by `add-ai-agronomy-copilot`, notifications, account controls, freshness, and connectivity status.
- Introduce reusable page, section, metric, toolbar, filter, data-display, form, feedback, empty, loading, skeleton, stale, offline, unauthorized, not-found, degraded, and incident patterns instead of page-local visual implementations.
- Redesign every public and authenticated journey: login, registration, recovery, monitoring, alerts, species, reports, Hortelan 360, onboarding, community, subscriptions, administration, integrations, integration operations, platform status, profile, security, help, and error recovery.
- Integrate AI conversation, semantic discovery, personalized recommendations, proactive insights, field-level form suggestions, image hypotheses, citations, and action drafts into the same visual and interaction language as deterministic features.
- Recompose operational pages for scanning and repeated use: current state and urgency first, evidence and trends second, and contextual actions last, with stable dimensions and less decorative card framing.
- Use relevant, inspection-grade plant and crop media where the user needs to recognize a species or condition; avoid atmospheric stock imagery, decorative gradients, bokeh, or abstract AI decoration.
- Add restrained microinteractions for navigation, state changes, streaming, selection, charts, and feedback while honoring reduced motion and keeping layout stable.
- Decompose confirmed oversized pages into focused feature sections, presentation components, domain hooks, and shared primitives without changing authoritative service boundaries or removing working behavior.
- Add visual-regression, accessibility, responsive, interaction, performance, bundle, and maintainability gates for representative pages and all critical asynchronous states.
- Preserve canonical routes and existing functionality. Any temporary visual migration flag MUST default to the stable experience and support rollback without data migration.
- Dependencies: implement after the shared contracts in `add-ai-agronomy-copilot` are stable and coordinate with `modernize-observability-contracts-ui` for shared error, health, loading, and diagnostics states.
- Non-goals: a marketing landing page, decorative 3D, a purple AI theme, full-bleed editorial composition inside operational workflows, nested cards, autonomous AI actions, provider-specific UI, or backend domain changes unrelated to presentation contracts.

## Capabilities

### New Capabilities

- `experience/product-design-system`: The visual, interaction, content, responsive, theme, motion, imagery, chart, and reusable component contracts that make Hortelan coherent across public, operational, knowledge, administration, account, and AI-assisted experiences.

### Modified Capabilities

- `architecture/frontend-app-shell`: Redesign authenticated navigation, page context, global commands, responsive composition, route transitions, and non-blocking AI integration while preserving the shared route manifest and access boundaries.
- `experience/accessible-responsive-ui`: Strengthen responsive, keyboard, screen-reader, zoom, contrast, touch, reduced-motion, stable-layout, and complete-state behavior across all redesigned surfaces.
- `experience/operational-workflows`: Recompose every workflow around urgency, freshness, evidence, clear commands, consistent forms, trustworthy provenance, and naturally integrated AI assistance.
- `delivery/frontend-quality`: Add design-token governance, visual regression, complete viewport and theme matrices, interaction performance, asset quality, page-complexity, and component-reuse gates.

## Impact

- Theme and primitives: palette, semantic tokens, typography, spacing, shadows, shape, component overrides, global styles, motion tokens, chart palette, icons, imagery treatment, and theme-mode preferences.
- Shell and routing: dashboard layout, navbar, sidebar, mobile navigation, search and AI command entry, notifications, account controls, route metadata, page headers, lazy boundaries, and SSR-safe initial output.
- Pages and features: all current public and dashboard pages plus monitoring, profile, security, status, form, chart, confirmation, and operational-state components.
- Architecture: decomposition of the largest page modules while keeping API calls in feature services and preserving domain behavior, routes, authentication, and selective SSR.
- Assets and dependencies: evaluate only focused libraries that remove demonstrated complexity; prefer existing Material UI, Iconify, Recharts, and motion facilities and remove obsolete visual dependencies after reachability verification.
- Delivery: deterministic theme and component tests, Playwright screenshots at 320/768/1440 widths in light and dark themes, Axe and keyboard checks, 200 percent zoom, bundle and image budgets, layout-shift checks, and source-complexity thresholds.
- Compatibility: no route or API breaking change is intended. Visual rollout can be staged by route, but a page is promoted only when its complete state and accessibility matrix passes.

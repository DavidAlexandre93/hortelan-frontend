## Context

See `proposal.md` for motivation. Hortelan currently uses React 19, Material UI 7, a shared route manifest, route-level lazy loading, selective SSR, Iconify and Material icons, Recharts, a local motion wrapper, and a custom theme built around Manrope, an 8-pixel radius, green and blue semantic families, and light/dark modes. These foundations are reusable, but page-level composition remains inconsistent and the largest pages range from roughly 400 to 725 lines with repeated visual decisions.

The dashboard shell has a fixed 264-pixel sidebar, 68-pixel app bar, route metadata header, and route outlet. Operational features already have useful domain sections and shared failure components, so the redesign should evolve their composition rather than replace working services or domain logic.

This change depends on `add-ai-agronomy-copilot` for AI contracts and state machines and on `modernize-observability-contracts-ui` for error, health, loading, telemetry, and DTO foundations. It must remain usable before either optional AI provider or telemetry exporter is available.

## Goals / Non-Goals

**Goals:**

- Establish a distinct Hortelan product language that feels calm, precise, contemporary, and appropriate for repeated agricultural operations.
- Reduce visual noise and repeated page-local styling through a small, documented set of compositional primitives and semantic tokens.
- Make current state, urgency, freshness, evidence, and next action immediately scannable without sacrificing dense operational detail.
- Integrate deterministic navigation and AI assistance as parts of the same workflow rather than separate product personalities.
- Make all public, dashboard, responsive, accessible, theme, loading, failure, and recovery states release-gated.
- Decompose oversized pages along demonstrated feature and state boundaries without creating a speculative component framework.

**Non-Goals:**

- Replacing Material UI, React Router, Recharts, or the established feature-service boundary.
- Creating a marketing landing page or using oversized promotional composition inside authenticated workflows.
- Adding decorative 3D, canvas, gradient backgrounds, abstract AI imagery, bokeh, or visual effects without operational purpose.
- Changing backend domain behavior, authentication authority, canonical routes, or the AI provider contracts owned by dependent changes.
- Standardizing every one-off data visualization into a universal abstraction when a direct chart remains clearer.

## Decisions

### 1. Evolve the existing theme into semantic design tokens

**Satisfies:** `experience/product-design-system`, `delivery/frontend-quality`.

The existing Material UI theme remains the composition root. Raw palette values become foundation tokens, while components consume semantic roles such as `surface.canvas`, `surface.base`, `surface.subtle`, `surface.raised`, `text.primary`, `text.muted`, `border.subtle`, `border.strong`, `action.primary`, `status.info`, `status.success`, `status.warning`, `status.critical`, `focus.ring`, and chart series roles.

The palette keeps agricultural green as the brand and primary action family, blue for information and connected systems, amber for attention, coral-red for critical states, and high-quality neutral greens and grays for surfaces. Light mode uses an off-white operational canvas and white primary surfaces. Dark mode uses near-black green-neutral canvas and raised deep-green-neutral surfaces. Gradients are removed from product surfaces.

Spacing uses a 4-pixel foundation with named steps. Radius remains restrained at 4, 6, and 8 pixels, with fully circular treatment only for avatars, status dots, and icon affordances. Elevation uses borders and subtle shadows before large blur. Z-index values become named layers.

**Alternatives considered:** Replacing Material UI would add migration risk without user value. Keeping feature-local values preserves inconsistency. A monochrome green system weakens status and information distinction.

### 2. Use a dual-purpose typography system without viewport scaling

**Satisfies:** `experience/product-design-system`, `experience/accessible-responsive-ui`.

Manrope remains for brand, page headings, section headings, and key metrics. Public Sans is used for body copy, forms, tables, navigation, and dense operational labels when measured bundle and legibility tests justify loading both installed families. The implementation may retain Manrope alone if comparative screenshots and bundle evidence show no meaningful benefit from the second family.

Font sizes are tokenized by role and breakpoint, never calculated from viewport width. Dashboard page titles remain compact; section titles use tighter hierarchy; metrics use tabular number features where supported. Labels and buttons use zero letter spacing. Line lengths and line heights are bounded for readability.

**Alternatives considered:** A large editorial scale is visually dramatic but wastes operational space. Viewport-scaled type creates unpredictable wrapping. A new remote font adds availability and privacy risk.

### 3. Redesign the shell around grouped navigation and compact context

**Satisfies:** `architecture/frontend-app-shell`, `experience/accessible-responsive-ui`.

Desktop uses a 248-pixel grouped sidebar that can collapse to a stable icon rail when the viewport and user preference allow. Groups reflect work domains: Operacao, Conhecimento, Gestao, and Conta. Mobile uses an accessible temporary navigation drawer rather than attempting to fit every destination into a bottom bar. The top bar is 64 pixels and prioritizes navigation toggle, deterministic search/AI command entry, operational notifications, theme, and account.

The route context becomes a compact page header with title, one-line purpose, provenance or freshness, and relevant route actions. It is a page section, not a floating card. Offline and incident states occupy a stable shell band. Route-pending content reserves the destination frame to avoid page jumps.

The route manifest remains the source for labels, access, lazy modules, and context. Navigation is generated from declared groups and order rather than duplicated page configuration.

**Alternatives considered:** A bottom navigation cannot hold the product breadth. A large header repeats metadata and delays access to current state. A hidden hamburger on wide screens harms repeated navigation efficiency.

### 4. Build compositional primitives, not a speculative component catalog

**Satisfies:** `experience/product-design-system`, `delivery/frontend-quality`.

The first reusable set is limited to demonstrated repetition:

- Page context, section header, metric strip, status summary, and evidence row.
- Data toolbar, filter group, segmented view control, dense list, table frame, and detail drawer.
- Form section, field group, step progress, sticky action bar, confirmation, and field diff.
- Operational state, inline notice, skeleton families, empty result, stale data, incident, and recovery action.
- Media tile, species identity, chart frame, accessible legend, source list, and freshness label.
- AI command entry, contextual prompt, insight item, citation, uncertainty, stream status, and action draft, reusing the dependent AI state model.

Page sections remain unframed or separated by dividers and space. Cards are used only for repeated individual entities, modal tools, or bounded content that benefits from a frame. No primitive accepts arbitrary visual variants that bypass tokens.

**Alternatives considered:** One universal `CardSection` would preserve card-heavy composition. Large configuration-driven component factories obscure normal React composition. Page-local duplication prevents consistent state behavior.

### 5. Use four page archetypes

**Satisfies:** `experience/product-design-system`, `experience/operational-workflows`.

Pages compose from one of four archetypes:

1. **Operational overview:** status and urgency, metric strip, active work, trends and evidence, then automation or secondary configuration. Used by monitoring, alerts, platform status, and integration operations.
2. **Dense resource workspace:** toolbar and filters, list or table, selection, detail drawer, and scoped actions. Used by administration, integrations, reports, sessions, devices, and subscriptions.
3. **Knowledge workspace:** search and filters, clear media-backed identities, readable detail, evidence, comparison, and contextual AI. Used by species, help, community, and Hortelan 360.
4. **Guided form or settings:** progress or section navigation, grouped fields, inline guidance, stable action region, consequences, and recovery. Used by onboarding, profile, security, auth, recovery, and integration setup.

Archetypes govern reading order and layout, not business logic. A page can include one subordinate pattern without nesting whole page frames.

**Alternatives considered:** Designing every route independently creates inconsistency. Forcing all pages into a dashboard card grid ignores the difference between operations, resources, knowledge, and forms.

### 6. Recompose operational pages around decisions

**Satisfies:** `experience/operational-workflows`.

Monitoring leads with active risk, current environment, sensor freshness, and next actions, then compact metrics and trends. Alerts use severity queue plus detail, evidence, timeline, and action. Reports use period and comparison controls, summary metrics, charts, source detail, and export. Status and integration operations use service health, incident timeline, dependencies, and runbook-oriented actions.

Tables and dense lists are preferred when comparison matters. Cards are reserved for individual repeated entities on compact viewports. Charts have fixed responsive regions, accessible summaries, and honest sparse/stale states.

**Alternatives considered:** Large isolated KPI cards are easy to build but disconnect state from evidence. Equal visual weight for every module hides urgency.

### 7. Make knowledge pages inspectable and media-aware

**Satisfies:** `experience/product-design-system`, `experience/operational-workflows`.

Species uses clear plant photography with stable aspect ratio, identity, core conditions, seasonal and regional context, comparison, and sourced care guidance. Help uses task-oriented search and topic navigation. Community prioritizes useful posts, evidence, moderation status, and readable discussions. Hortelan 360 becomes the full AI and intelligence workspace defined by the AI change, with conversation history, sources, insight queue, and contextual launch points.

Images are local or allowlisted, optimized, rights-recorded, and selected for inspection value. Image failure never removes the species name or essential facts.

**Alternatives considered:** Atmospheric imagery looks polished but hinders recognition. Decorative category cards add scroll without improving discovery.

### 8. Integrate AI through shared state and provenance patterns

**Satisfies:** `architecture/frontend-app-shell`, `experience/operational-workflows` and depends on `add-ai-agronomy-copilot`.

AI uses the same typography, surfaces, states, commands, form controls, detail drawers, and evidence treatment as deterministic features. A small sparkle or assistant mark may identify generated content, but color is not the only distinction and no separate purple theme is introduced.

The command surface distinguishes deterministic destination, semantic result, generated answer, and structured plan. Form assistance renders within the normal form as a field diff. Proactive insights use the normal operational queue. Alert explanations live beside alert evidence. Citations use the same source component as help and reports.

**Alternatives considered:** A floating chatbot with its own style feels attached and loses page context. Making all AI content visually dominant undermines authoritative data.

### 9. Use restrained motion with stable dimensions

**Satisfies:** `experience/product-design-system`, `experience/accessible-responsive-ui`.

Motion tokens define instant, fast, standard, and deliberate durations plus standard easing. Allowed uses are route context continuity, drawer and menu entry, selection, disclosure, data refresh, streaming status, and success feedback. Hover movement is subtle and cannot change layout geometry. Skeletons match final dimensions. Reduced-motion mode removes transforms and nonessential transitions.

**Alternatives considered:** Spring-heavy card movement is expressive but distracts in operational tools. No motion at all can make state transitions harder to follow.

### 10. Preserve complete states while migrating pages

**Satisfies:** `experience/product-design-system`, `experience/accessible-responsive-ui`, `experience/operational-workflows`.

Every migrated route must demonstrate live, demo where applicable, loading, empty, stale, offline, degraded, unauthorized, not-found, validation, mutation pending, success, incident, and recovery behavior before promotion. Shared state components accept semantic content and actions, not page-specific raw styling.

The redesign does not claim an unavailable backend operation succeeded. Disabled controls provide a reason only when the user can act on it; otherwise misleading controls are removed.

**Alternatives considered:** Migrating only the happy path creates a polished demo and an inconsistent real product. One global error page destroys safe local context.

### 11. Decompose pages along current feature ownership

**Satisfies:** `delivery/frontend-quality`.

Large pages are split when a section has independent state, clear inputs and outputs, focused tests, or repeated composition. Domain calculations remain in existing feature domain modules; transport remains in services; route pages compose features and own route-level data dependencies. Shared visual primitives do not import feature services. Feature presentation may import primitives and domain hooks.

The architecture gate forbids primitives importing pages or feature services, and prevents pages from calling `fetch` directly. Existing user changes are preserved and migrated rather than overwritten.

**Alternatives considered:** Splitting by arbitrary line count alone creates pass-through files. Keeping 700-line pages makes visual and state testing expensive.

### 12. Stage rollout by foundation and archetype

**Satisfies:** `architecture/frontend-app-shell`, `delivery/frontend-quality`.

Implementation order is tokens and states, shell, operational archetype, knowledge archetype and AI, resource workspace, guided forms and account, then auth and error routes. A temporary route-level visual flag may compare old and new composition during development, but production promotion happens route by route only after complete-state, visual, accessibility, and performance evidence.

Once all routes pass, the old visual path, unreachable style modules, obsolete overrides, duplicate components, and flag are removed after source-reachability verification.

**Alternatives considered:** A single large cutover has high regression risk. Permanent dual design systems multiply maintenance and bundle cost.

### 13. Gate screenshots, accessibility, assets, and performance together

**Satisfies:** `delivery/frontend-quality`.

Playwright captures deterministic representative routes at 320, 768, and 1440 pixels in both themes and critical states. Tests assert no page overflow, element overlap, blank lazy routes, unexpected console errors, or inaccessible primary controls. Axe, keyboard journeys, focus tests, 200 percent zoom, reduced motion, and chart summaries complement screenshots.

Bundle analysis tracks client entry, shell, each redesigned route, fonts, images, charts, and AI lazy chunks. Asset scripts validate dimensions, format, transfer, alternative-text registration, origin, and responsive variants. Interaction baselines include route transition, theme change, common filter, form feedback, and layout shift.

**Alternatives considered:** Screenshot-only testing misses semantics and keyboard behavior. Accessibility-only testing misses clipping, density, and hierarchy. Performance checks only at the end make visual rollback expensive.

## Risks / Trade-offs

- **Broad visual scope causes regressions** -> Migrate by archetype and route, preserve behavior tests, require complete-state evidence, and keep rollback until each group passes.
- **Two active cross-cutting changes conflict** -> Stabilize shared AI and observability contracts first, assign ownership per primitive, and update OpenSpec before implementation diverges.
- **Premium visual direction reduces density** -> Test repeated operational tasks and use documented dense modes, tables, drawers, and compact headers rather than larger cards.
- **Dark mode hides status or chart distinctions** -> Maintain semantic theme parity, test every status and chart family, and never rely on color alone.
- **Visual assets increase transfer and layout shift** -> Use inspection-grade media only where it adds recognition, generate responsive variants, reserve aspect ratio, lazy-load, and enforce budgets.
- **Motion distracts or harms users** -> Restrict motion to state communication, enforce token durations, and verify reduced-motion behavior.
- **Shared primitives become over-generalized** -> Extract only repeated behavior, keep feature composition direct, and remove variants without real consumers.
- **Page decomposition obscures ownership** -> Keep route, feature, domain, service, and primitive dependency directions explicit and covered by architecture tests.
- **Theme migration flashes or breaks SSR** -> Use an SSR-safe initial preference strategy, deterministic fallback, hydration tests, and a rollback flag during migration.
- **AI visual treatment outranks source data** -> Reuse evidence and status patterns, label generated content, and keep authoritative operational state first.

## Migration Plan

1. Capture current route, theme, viewport, bundle, accessibility, performance, and complete-state baselines before visual edits.
2. Finalize token names, palette contrast, type comparison, spacing, grid, surface, motion, chart, icon, and imagery rules with deterministic theme fixtures.
3. Implement shared asynchronous, form, metric, toolbar, evidence, chart, media, and AI-compatible primitives with focused component tests.
4. Redesign the shell and compact page context while preserving route manifest, access control, selective SSR, and deterministic navigation.
5. Migrate operational overview routes: monitoring, alerts, reports, platform status, and integration operations.
6. Migrate knowledge routes and AI integration: species, help, community, and Hortelan 360 after AI state contracts are stable.
7. Migrate dense resource routes: administration, integrations, subscriptions, sessions, devices, and related management views.
8. Migrate guided forms and settings: onboarding, profile, security, integration setup, authentication, recovery, and error routes.
9. Run the full viewport and theme screenshot matrix, accessibility and keyboard suite, asset checks, bundle and interaction budgets, architecture audit, and all existing behavior tests.
10. Remove old visual paths, duplicate styles, obsolete overrides, unreachable modules, unused assets, and the migration flag only after final reachability and rollback review.

Rollback keeps the last promoted route composition active through the temporary route-level flag. Tokens and primitives are additive until a route passes promotion. No data migration is involved; service and domain contracts remain unchanged. If the AI change is unavailable, deterministic search, navigation, forms, alerts, and source data remain fully usable.

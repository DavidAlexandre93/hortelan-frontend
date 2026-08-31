## ADDED Requirements

### Requirement: Responsive operational navigation

The authenticated shell SHALL provide stable grouped navigation, current-location indication, compact desktop and mobile behavior, and a direct path to primary operational areas without changing route authorization or canonical URLs.

#### Scenario: User navigates on a compact viewport

- **WHEN** the dashboard is used at a supported mobile width
- **THEN** navigation opens as an accessible temporary surface, identifies the current route, preserves task context, and returns focus after selection or dismissal

### Requirement: Compact page context

Dashboard routes MUST present a consistent compact context region containing title, concise purpose, applicable live or demo provenance, freshness or health, and route-level actions without oversized decorative headings.

#### Scenario: User opens an operational route

- **WHEN** the route renders summary content, filters, and actions
- **THEN** the page context establishes where the user is and the current data state before secondary cards, charts, or analysis

### Requirement: Unified deterministic and AI commands

The shell SHALL compose deterministic search and navigation with the lazy AI command surface from `add-ai-agronomy-copilot`, and MUST visually distinguish direct destinations, semantic results, generated answers, and reviewable action drafts.

#### Scenario: AI capability is disabled

- **WHEN** the AI feature flag or gateway is unavailable
- **THEN** deterministic search and navigation remain fully usable and the shell communicates the unavailable AI scope without a broken control

### Requirement: Non-blocking route transitions

The shell MUST provide stable route-pending, lazy-load failure, offline, and recovery feedback without replacing global navigation or causing the page frame to jump.

#### Scenario: Lazy route takes longer than the pending threshold

- **WHEN** the selected route bundle or data is still loading
- **THEN** the shell preserves navigation and context dimensions while a route-scoped accessible pending state appears

### Requirement: Coherent shell utilities

Connectivity, notifications, theme, account, help, search, AI, and sidebar commands SHALL use consistent icon, tooltip, badge, focus, menu, and responsive behavior and MUST not compete with the active workflow for visual priority.

#### Scenario: Several utility states are active

- **WHEN** notifications, offline status, and AI availability need representation together
- **THEN** the shell prioritizes operational risk, avoids overlapping controls, and keeps every utility reachable with keyboard and touch

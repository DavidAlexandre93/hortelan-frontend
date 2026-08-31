## ADDED Requirements

### Requirement: Urgency-first operational hierarchy

Monitoring, alerts, status, administration, integrations, and report views MUST place current state, severity, freshness, affected scope, and primary next action before secondary trends, explanation, or historical detail.

#### Scenario: Critical and informational content coexist

- **WHEN** a page contains an active operational risk and lower-priority analysis
- **THEN** the risk, evidence, and relevant command are identifiable first in visual and assistive-technology reading order

### Requirement: Efficient repeated operations

Frequently used filters, search, sorting, view modes, selection, bulk actions, refresh, export, and pagination SHALL use consistent toolbars and stable controls and MUST preserve safe context when users move between related routes.

#### Scenario: User filters a dense operational list

- **WHEN** filters or sorting change the result set
- **THEN** the applied criteria, result count, empty state, reset path, and current selection remain clear without moving the toolbar

### Requirement: AI assistance within source workflows

AI answers, semantic results, proactive insights, personalization reasons, form diffs, citations, image hypotheses, and action drafts MUST appear adjacent to their authoritative source workflow and SHALL never obscure, replace, or visually outrank unresolved safety-critical states.

#### Scenario: AI insight relates to an active alert

- **WHEN** the alert page shows both authoritative severity and generated explanation
- **THEN** the severity, source values, and normal alert actions remain primary while the AI content is labeled, inspectable, and dismissible

### Requirement: Knowledge and media workflows

Species, help, community, and onboarding experiences SHALL combine clear navigation, readable content, relevant inspection-grade media, progress, and contextual actions without marketing-style hero layouts or decorative card grids.

#### Scenario: User inspects a species

- **WHEN** a species detail or comparison is displayed
- **THEN** identification media, core care facts, regional context, evidence, and relevant action appear in a predictable order on mobile and desktop

### Requirement: Account and security workflow clarity

Profile, privacy, session, device, MFA, integration, subscription, and destructive account workflows MUST separate safe preferences from consequential actions and SHALL show effect, scope, status, confirmation, and recovery with consistent form and dialog patterns.

#### Scenario: User initiates a consequential account action

- **WHEN** a session, integration, subscription, device, MFA method, or account state will change
- **THEN** the interface names the target and consequence, requests appropriate confirmation, communicates progress, and shows an auditable result or safe failure

### Requirement: Honest plan and availability presentation

Planned, demo, unavailable, plan-limited, disconnected, degraded, and live features MUST use distinct visual and textual states and SHALL not expose active-looking controls that fabricate success.

#### Scenario: Backend or plan does not support a control

- **WHEN** a redesigned workflow cannot perform the visible action
- **THEN** the command is removed or disabled with a truthful reason and relevant upgrade, configuration, or retry path

## ADDED Requirements

### Requirement: Modern operational visual hierarchy

The authenticated experience SHALL use a restrained multi-neutral palette with purposeful status colors, compact operational typography, stable spacing, and clear hierarchy for navigation, filters, metrics, tables, charts, and actions. Visual refinement SHALL preserve the existing product identity and SHALL NOT introduce a competing component system.

#### Scenario: User scans a monitoring view

- **WHEN** a monitoring or dashboard route finishes loading
- **THEN** title, scope, freshness, primary status, metrics, and detailed evidence are visually distinguishable in that order
- **AND** status is not communicated by color alone

#### Scenario: Dynamic values change

- **WHEN** counters, labels, loading text, or translated content changes length
- **THEN** fixed-format controls and panels retain stable dimensions without overlapping adjacent content

### Requirement: Responsive operational density

Primary routes SHALL remain complete and usable at 320, 768, and 1440 CSS pixel viewport widths. Dense desktop controls SHALL reorganize into touch-appropriate mobile layouts without hiding required status, error, or recovery information.

#### Scenario: Narrow mobile viewport is used

- **WHEN** a route is rendered at 320 CSS pixels wide
- **THEN** navigation, forms, filters, charts, tables or list alternatives, and recovery actions remain reachable without page-level horizontal overflow

#### Scenario: Wide desktop viewport is used

- **WHEN** a route is rendered at 1440 CSS pixels wide
- **THEN** operational content uses the available width for scanning while preserving readable line lengths and predictable alignment

### Requirement: Accessible status and failure states

Loading, empty, offline, degraded, unauthorized, not-found, and unexpected-error states SHALL have distinct accessible semantics, concise Portuguese copy, relevant icons, visible focus, and actions appropriate to the state. Raw exception details and backend messages MUST NOT appear in user-facing content.

#### Scenario: Dependency failure blocks an action

- **WHEN** a required dependency is unavailable
- **THEN** the interface explains that the action could not be completed, suggests trying later, and offers retry or safe navigation
- **AND** provides a copyable incident identifier without exposing technical details

#### Scenario: Keyboard user activates recovery

- **WHEN** a failure view is opened and the user navigates by keyboard
- **THEN** focus moves to a meaningful heading or recovery action in logical order
- **AND** every interactive control has a visible focus indicator and accessible name

### Requirement: Motion, contrast, and visual regression safety

Interactions SHALL meet WCAG AA contrast for normal text and meaningful controls, respect reduced-motion preferences, and avoid layout-shifting decorative animation. Automated accessibility checks and representative visual comparisons SHALL cover primary and failure states across the target viewports.

#### Scenario: Reduced motion is requested

- **WHEN** the operating system reports a reduced-motion preference
- **THEN** nonessential transitions and animated status effects are removed or reduced to an immediate state change

#### Scenario: Theme token reduces contrast

- **WHEN** a token or component change causes an audited contrast or accessibility violation
- **THEN** the automated accessibility gate fails with the affected route or component

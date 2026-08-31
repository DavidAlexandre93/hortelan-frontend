## ADDED Requirements

### Requirement: Design token governance gate

The quality flow MUST validate token definitions, allowed semantic usage, theme parity, and prohibited ad hoc visual values in changed production surfaces, with documented exceptions for data-derived visualization or external brand requirements.

#### Scenario: Changed component introduces a visual value

- **WHEN** a color, spacing, radius, shadow, motion duration, font size, or z-index is added outside the approved token boundary
- **THEN** the gate fails or requires a scoped reviewed exception that identifies why no semantic token applies

### Requirement: Responsive visual regression matrix

Representative public and dashboard routes MUST have deterministic visual evidence at 320, 768, and 1440 pixel widths in light and dark themes across primary, loading, empty, error, offline, stale, and AI-assisted states.

#### Scenario: Candidate changes a representative route

- **WHEN** the visual regression suite compares the candidate with the approved baseline
- **THEN** unapproved overlap, clipping, horizontal overflow, missing content, theme mismatch, or material layout shift fails the gate

### Requirement: Interaction accessibility gate

The release suite SHALL combine automated accessibility checks with keyboard, focus, zoom, touch-target, reduced-motion, landmark, heading, dialog, form-error, chart-summary, and live-region journeys, and MUST fail unresolved serious or critical violations.

#### Scenario: Redesigned interaction is validated

- **WHEN** a user can navigate, filter, submit, dismiss, expand, stream, or confirm through a new surface
- **THEN** automated and focused interaction tests prove the same outcome without relying on a pointer or color alone

### Requirement: Visual asset quality gate

Production imagery and icons MUST have declared purpose, dimensions, aspect ratio, alternative-text behavior, local or allowlisted origin, loading strategy, optimized format, and transfer budget, and SHALL fail delivery when a broken or misleading asset affects a required workflow.

#### Scenario: New species image enters the build

- **WHEN** a source image is added or changed
- **THEN** the asset gate verifies its subject clarity, rights or origin record, responsive variants, compressed size, dimensions, fallback, and accessible description

### Requirement: Interaction performance gate

The redesigned shell and representative routes MUST preserve approved loading, responsiveness, layout stability, route-transition, theme-switch, chart-render, and AI-surface budgets on supported mobile and desktop profiles.

#### Scenario: Visual change affects a route bundle

- **WHEN** new components, fonts, images, motion, charts, or icons enter a production route
- **THEN** measured transfer, render, interaction, and layout-shift results stay within the approved budget or the change is rejected

### Requirement: Maintainable visual composition gate

Changed pages and shared components SHALL meet documented size, complexity, responsibility, duplication, dependency-direction, and reuse thresholds and MUST decompose oversized modules without introducing speculative abstraction.

#### Scenario: Large page is redesigned

- **WHEN** a production page above the maintainability threshold changes materially
- **THEN** the implementation extracts demonstrated feature sections, state logic, or shared patterns until the threshold passes or a time-bounded rationale is approved

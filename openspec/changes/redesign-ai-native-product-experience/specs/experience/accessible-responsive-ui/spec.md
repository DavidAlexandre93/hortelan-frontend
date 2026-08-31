## ADDED Requirements

### Requirement: Complete responsive page composition

Every redesigned public and dashboard route MUST preserve content hierarchy, commands, forms, tables, charts, media, dialogs, and AI surfaces at 320, 768, and 1440 pixel widths without overlap, clipping, inaccessible content, or unintended horizontal page scrolling.

#### Scenario: Long localized content renders at 320 pixels

- **WHEN** labels, identifiers, validation text, citations, or actions exceed the expected length
- **THEN** content wraps, truncates with an accessible expansion path, or changes layout without occluding adjacent information

### Requirement: Zoom and text enlargement resilience

The interface SHALL remain usable at 200 percent browser zoom and supported text enlargement, and MUST reflow controls and content instead of requiring two-dimensional scrolling for primary workflows.

#### Scenario: User zooms an operational form

- **WHEN** browser zoom reaches 200 percent on a desktop viewport
- **THEN** labels, fields, help, errors, and actions remain readable, ordered, and keyboard reachable

### Requirement: Theme contrast parity

All light and dark theme states MUST meet the approved contrast target for text, focus, controls, charts, status, overlays, disabled content, and AI provenance, and SHALL not use opacity alone where it makes meaning unreadable.

#### Scenario: Status appears in dark mode

- **WHEN** neutral, selected, healthy, warning, error, stale, or disabled status renders in dark mode
- **THEN** its label, icon, boundary, and focus treatment remain distinguishable and meet the accessibility gate

### Requirement: Stable dynamic layout

Fixed-format controls, counters, chart regions, media, metrics, toolbars, navigation items, and loading placeholders MUST have responsive constraints that prevent hover, focus, badges, errors, streaming, or dynamic values from resizing unrelated layout.

#### Scenario: Dynamic value changes length

- **WHEN** a metric, badge, notification count, sensor value, or generated status becomes longer
- **THEN** the component accommodates the content through its documented wrapping or truncation rule without shifting primary controls

### Requirement: Cross-input interaction parity

Primary workflows SHALL support keyboard, touch, mouse, and assistive technology with visible focus, adequate target size, programmatic names, logical headings and landmarks, and no pointer-only behavior.

#### Scenario: Keyboard user operates a redesigned page

- **WHEN** the user traverses navigation, filters, tables, dialogs, forms, charts, and AI controls
- **THEN** focus order follows the visual workflow, no focus trap occurs outside a modal surface, and focus returns predictably after dismissal

### Requirement: Motion and sensory safety

Redesigned transitions, skeletons, chart updates, streaming indicators, hover states, and feedback MUST avoid flashing, excessive parallax, large decorative movement, or motion-dependent meaning and SHALL respect reduced-motion preferences.

#### Scenario: Reduced motion is active during streaming

- **WHEN** an AI response or data refresh progresses
- **THEN** the state remains understandable through text and stable indicators without animated displacement

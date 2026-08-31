## Purpose

Defines the shared visual and interaction language that makes Hortelan coherent, trustworthy, efficient, and recognizably premium across operational, knowledge, account, public, and AI-assisted experiences.

## ADDED Requirements

### Requirement: Semantic visual tokens

The product MUST use named semantic tokens for color, typography, spacing, size, border, radius, elevation, focus, motion, and data visualization, and SHALL avoid feature-local values when an equivalent shared token exists.

#### Scenario: Component changes theme or state

- **WHEN** a shared or feature component renders in light, dark, interactive, disabled, selected, warning, error, or success state
- **THEN** its visual properties resolve from the documented semantic token and preserve the intended meaning across themes

### Requirement: Balanced product palette

The visual system SHALL use restrained agricultural greens, clear neutrals, a contrasting information family, and distinct success, warning, and error colors, and MUST NOT rely on one hue family, gradients, or decorative color alone to communicate hierarchy or status.

#### Scenario: User scans mixed operational states

- **WHEN** neutral information, current selection, healthy state, warning, and critical state appear together
- **THEN** each remains distinguishable by color, icon, label, and structure in both light and dark themes

### Requirement: Operational typography hierarchy

The system MUST provide a stable type scale for page context, section headings, metrics, labels, body content, tables, captions, controls, and code or identifiers, and SHALL reserve hero-scale typography for true public hero content rather than dashboard panels.

#### Scenario: Compact operational panel renders a long heading

- **WHEN** a localized heading or value approaches the available width
- **THEN** the typography wraps or truncates by documented content rules without overlapping controls or scaling with viewport width

### Requirement: Responsive grid and density

The design system SHALL provide consistent content widths, gutters, section rhythm, grid tracks, dense and comfortable modes, and stable control dimensions from 320 pixels upward.

#### Scenario: Dashboard changes viewport size

- **WHEN** the viewport crosses a supported compact, medium, or wide layout boundary
- **THEN** content reflows through documented grid behavior without arbitrary spacing changes, hidden primary actions, or horizontal page scrolling

### Requirement: Purposeful surfaces and grouping

The interface MUST use full-width sections, dividers, whitespace, tables, lists, and toolbars for page structure and SHALL reserve cards for individual repeated items, dialogs, or genuinely framed tools without nesting cards inside cards.

#### Scenario: Page contains summary, analysis, and actions

- **WHEN** several content groups share one workflow
- **THEN** their hierarchy is expressed through section layout and grouping rather than wrapping every group in a floating decorative card

### Requirement: Familiar command controls

Commands SHALL use familiar icons with accessible names and tooltips when a standard symbol exists, while text or icon-plus-text buttons MUST be reserved for commands whose meaning is not clear from an icon alone.

#### Scenario: User encounters an icon-only command

- **WHEN** a toolbar displays save, download, filter, refresh, copy, edit, delete, close, undo, or navigation controls
- **THEN** each control uses a consistent familiar icon, visible focus, accessible name, stable target size, and tooltip where needed

### Requirement: Complete asynchronous state language

Every data or action surface MUST use consistent pending, skeleton, empty, stale, offline, degraded, unauthorized, not-found, validation, rate-limit, incident, success, and retry patterns appropriate to the workflow.

#### Scenario: A page dependency fails

- **WHEN** required data cannot load or an operation fails
- **THEN** the affected scope shows a visually consistent, accessible, truthful state with preserved safe input and a relevant recovery action without blanking unrelated content

### Requirement: Consistent form composition

Forms SHALL use shared label, description, required, validation, grouping, step, action, pending, success, and destructive-confirmation patterns and MUST maintain stable layout when help or errors appear.

#### Scenario: Field validation message appears

- **WHEN** a user leaves a required or invalid field
- **THEN** the field exposes its error programmatically and visually without shifting unrelated controls or obscuring the next action

### Requirement: Trustworthy charts and metrics

Charts and metric displays MUST identify measure, unit, period, source, freshness, status, and accessible summary, and SHALL use stable dimensions and a palette that remains distinguishable without color alone.

#### Scenario: Chart data is sparse or stale

- **WHEN** a chart has missing, simulated, delayed, or stale values
- **THEN** the visualization labels the condition and avoids implying a continuous live series

### Requirement: Inspection-grade imagery

Species, crop, symptom, and product imagery SHALL reveal the subject clearly, include meaningful alternative text or be explicitly decorative, and MUST use stable aspect ratios, responsive crops, loading placeholders, and failure fallbacks.

#### Scenario: User inspects a species or crop condition

- **WHEN** imagery materially helps recognition or comparison
- **THEN** the interface presents a clear representative image without dark atmospheric treatment, misleading crop, layout shift, or hidden essential details

### Requirement: Restrained motion system

Motion MUST communicate navigation, hierarchy, selection, progress, streaming, or completion with bounded duration and distance, and SHALL disable nonessential animation when reduced motion is requested.

#### Scenario: User changes route or expands a tool

- **WHEN** a transition helps preserve spatial understanding
- **THEN** the animation completes without delaying interaction, resizing stable controls, or causing content overlap

### Requirement: Theme preference and parity

Light, dark, and system theme modes SHALL preserve the same information, commands, semantic states, and accessibility, and the selected preference MUST persist without exposing sensitive data or causing an incorrect-theme flash after hydration.

#### Scenario: Returning user opens the application

- **WHEN** a saved valid theme preference exists
- **THEN** the initial rendered experience uses that mode consistently across shell, charts, forms, dialogs, AI surfaces, and status components

### Requirement: Concise product language

User-facing pt-BR content MUST be direct, specific, and consistent with the current workflow and SHALL avoid describing the interface, visual treatment, keyboard shortcuts, or product features as promotional copy inside operational pages.

#### Scenario: Empty or error state is shown

- **WHEN** a user needs to understand what happened and what to do next
- **THEN** the copy names the state, its operational consequence, and the relevant next action without generic marketing language

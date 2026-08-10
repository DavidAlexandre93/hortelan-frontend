## Purpose

Defines an inclusive and responsive Hortelan interface that remains understandable, operable, and visually coherent across supported devices and input methods.

## Requirements

### Requirement: Keyboard-complete interaction

All user workflows SHALL be operable with a keyboard, expose a visible focus indicator, and follow a logical focus order.

#### Scenario: User navigates an interactive page by keyboard

- **WHEN** a user moves through controls using Tab, Shift+Tab, Enter, Space, or Escape as appropriate
- **THEN** every actionable control is reachable, its focus is visible, and focus does not become trapped outside an intentional modal interaction

#### Scenario: Modal interaction closes

- **WHEN** a modal, drawer, menu, or popover is dismissed
- **THEN** focus returns to the control that opened it or to the next logical workflow target

### Requirement: Semantic names and status announcements

Interactive controls, landmarks, form fields, data visualizations, and asynchronous status changes MUST expose meaningful semantics and accessible names.

#### Scenario: Assistive technology reads a control

- **WHEN** a control is represented visually by an icon or compact affordance
- **THEN** its accessible name communicates the action without relying on color, position, or icon recognition

#### Scenario: Asynchronous operation changes state

- **WHEN** content starts loading, succeeds, fails, or requires user attention
- **THEN** the status is programmatically available without unexpectedly moving keyboard focus

### Requirement: Responsive layout integrity

Application layouts MUST remain usable without incoherent overlap, clipped commands, or unintended horizontal page scrolling at viewport widths from 320 CSS pixels upward.

#### Scenario: User opens a page on a narrow viewport

- **WHEN** the viewport width is 320 CSS pixels
- **THEN** primary content, navigation, forms, tables, and actions reflow or use an intentional contained scroll region without overlapping one another

#### Scenario: User opens a page on a wide viewport

- **WHEN** the viewport width is at least 1440 CSS pixels
- **THEN** operational content uses the available space while retaining readable line lengths and stable navigation dimensions

### Requirement: Perceivable visual states

Text, icons, focus indicators, form states, and essential graphical information SHALL meet WCAG 2.2 AA contrast expectations and MUST NOT rely on color alone.

#### Scenario: Field validation fails

- **WHEN** a form field is invalid
- **THEN** the field exposes text and semantic error information in addition to a color treatment

#### Scenario: Operational status is displayed

- **WHEN** a status such as healthy, warning, critical, connected, or offline is shown
- **THEN** the state includes a textual or symbolic distinction that remains understandable without color perception

### Requirement: Accessible target sizing

Primary touch and pointer targets SHALL provide a minimum 44 by 44 CSS pixel activation area unless an equivalent adjacent control satisfies the same action.

#### Scenario: User operates compact dashboard controls on touch

- **WHEN** a user taps navigation, toolbar, pagination, or row actions
- **THEN** each target can be activated without requiring precision beyond the minimum target area

### Requirement: Motion preference support

Decorative animation and transition effects MUST honor the user's reduced-motion preference while preserving access to all content and actions.

#### Scenario: Reduced motion is enabled

- **WHEN** the operating system reports `prefers-reduced-motion: reduce`
- **THEN** the splash, page transitions, charts, and decorative effects use a static or substantially reduced-motion presentation

### Requirement: Correct document language and localization

Each rendered document SHALL declare the active interface language and MUST keep user-facing copy free of encoding corruption.

#### Scenario: Portuguese interface is active

- **WHEN** the application renders in Brazilian Portuguese
- **THEN** the document language is `pt-BR` and visible labels use correctly encoded Portuguese text

#### Scenario: User changes language

- **WHEN** the active interface language changes
- **THEN** the document language and control labels update consistently without losing the current route or workflow state

### Requirement: Cohesive operational visual system

The frontend SHALL use consistent spacing, typography, elevation, shape, color, and interaction-state tokens while keeping dense operational information easy to scan.

#### Scenario: User compares dashboard sections

- **WHEN** multiple pages present equivalent headings, filters, status indicators, tables, or actions
- **THEN** equivalent elements have consistent visual priority and interaction behavior

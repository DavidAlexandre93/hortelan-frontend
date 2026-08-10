## Purpose

Defines predictable operational journeys so Hortelan users can understand system state, complete actions safely, and recover from data or connectivity failures.

## ADDED Requirements

### Requirement: Complete asynchronous content states

Every data-backed view SHALL provide intentional loading, success, empty, error, and permission-denied states instead of blank content or indefinite placeholders.

#### Scenario: Route data is loading

- **WHEN** a user opens a data-backed route and its content is not yet available
- **THEN** the page preserves its layout and shows a meaningful loading state

#### Scenario: Query returns no records

- **WHEN** a successful query returns an empty collection
- **THEN** the page explains the empty state and offers the next relevant action when one exists

#### Scenario: Query fails

- **WHEN** required data cannot be loaded
- **THEN** the page shows a recoverable error with a retry action and retains unaffected navigation

### Requirement: Safe mutation feedback

User-triggered mutations MUST prevent accidental duplicate submission and SHALL provide pending, success, validation-failure, and service-failure feedback.

#### Scenario: User submits a valid mutation

- **WHEN** a save, create, update, export, or connection action is in progress
- **THEN** the initiating command communicates progress and cannot be submitted again until the operation settles

#### Scenario: Destructive action is requested

- **WHEN** a user initiates deletion, revocation, disconnection, deactivation, or another destructive action
- **THEN** the interface requests confirmation that names the affected resource and consequence before execution

### Requirement: Recoverable offline behavior

The frontend SHALL distinguish offline or degraded connectivity from validation and authorization failures and MUST preserve safe user input during transient failures.

#### Scenario: Connectivity is lost during editing

- **WHEN** a user has unsaved form input and the network becomes unavailable
- **THEN** the interface retains the input, communicates the offline state, and permits retry after connectivity returns

### Requirement: Predictable navigation context

Dashboard navigation SHALL expose the current location, use stable route labels, and preserve reasonable workflow context when users navigate between related views.

#### Scenario: User opens a dashboard feature

- **WHEN** a dashboard route is active
- **THEN** its navigation item and page heading identify the same feature using human-readable language

#### Scenario: User follows a legacy link

- **WHEN** a supported legacy route redirects to its canonical route
- **THEN** the destination preserves applicable query parameters and remains subject to the same access control as the canonical route

### Requirement: Honest demo and placeholder data

Data that is simulated, locally generated, unavailable, or awaiting backend integration MUST be visibly distinguishable from live operational data.

#### Scenario: Demo data is presented

- **WHEN** a page is populated by demo or mock data
- **THEN** the page identifies the data source as demonstration content without implying that it represents live equipment or customer operations

#### Scenario: Integration is unavailable

- **WHEN** a workflow lacks a functional backend integration
- **THEN** the interface presents an unavailable or planned state instead of reporting a fabricated success

### Requirement: Scannable operational information

Monitoring, alerts, reports, status, and administration views SHALL prioritize current state, severity, freshness, and next actions in a consistent reading order.

#### Scenario: User reviews an operational page

- **WHEN** summary metrics, alerts, charts, and actions are present together
- **THEN** the most urgent state and its relevant action are identifiable before secondary analysis content

## ADDED Requirements

### Requirement: Replaceable platform ports and adapters

The frontend SHALL isolate transport, observability, health, identity, and time or identifier generation behind narrow application-facing ports. Feature pages and presentation components SHALL depend on application services or hooks rather than concrete network, telemetry, or storage implementations.

#### Scenario: Production and demo transports differ

- **WHEN** the application runs in production or explicit demo mode
- **THEN** the composition root selects the corresponding adapter
- **AND** feature presentation code remains unchanged

#### Scenario: Telemetry provider changes

- **WHEN** a telemetry adapter is replaced or disabled
- **THEN** domain and presentation behavior continues through the same observability port

### Requirement: Unified recoverable failure boundary

The application shell SHALL provide route-level and application-level failure boundaries that classify known errors, preserve navigation context, expose safe recovery actions, and render a deliberate operational state instead of a blank page or raw exception.

#### Scenario: Route rendering fails

- **WHEN** a route throws an unexpected render error
- **THEN** the nearest failure boundary renders a branded, accessible failure view with retry and safe navigation actions
- **AND** includes a copyable incident identifier when one exists

#### Scenario: Recovery succeeds

- **WHEN** the user retries after the dependency or transient condition recovers
- **THEN** the route restores its normal content without requiring a full browser restart

### Requirement: Proportionate architecture

New abstractions and design patterns SHALL be introduced only when they isolate an external dependency, encode a repeated policy, or measurably reduce duplicated behavior. The implementation SHALL record the reason for each new shared abstraction and avoid parallel frameworks for the same concern.

#### Scenario: A concern is local to one component

- **WHEN** behavior has one stable caller and no external dependency boundary
- **THEN** the behavior remains local unless another requirement justifies extraction

#### Scenario: Multiple services repeat a reliability policy

- **WHEN** request validation, error normalization, or correlation logic is duplicated across service modules
- **THEN** the policy is centralized behind a shared contract or adapter boundary

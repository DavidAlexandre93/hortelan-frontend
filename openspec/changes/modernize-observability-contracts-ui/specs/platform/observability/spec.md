## Purpose

Define vendor-neutral, privacy-safe telemetry and diagnostic behavior that lets operators correlate frontend failures without exposing personal data or making application availability depend on the telemetry provider.

## ADDED Requirements

### Requirement: Structured diagnostic events

The platform SHALL emit machine-readable diagnostic events with a stable schema containing timestamp, severity, service, environment, event name, message, route, incident identifier, and available request, trace, and span identifiers. Error events SHALL include the normalized error class and source file, line, and column when those values can be derived safely.

#### Scenario: Runtime exception is captured

- **WHEN** an unexpected runtime exception reaches an application or route error boundary
- **THEN** the platform records one structured error event with an incident identifier, correlation fields, normalized source location, and complete stack trace for the configured diagnostic backend
- **AND** the user-facing view receives only the sanitized incident identifier and recovery guidance

#### Scenario: Optional fields are unavailable

- **WHEN** a browser or upstream service does not provide a trace identifier or source location
- **THEN** the event remains valid and explicitly omits the unavailable optional fields
- **AND** telemetry capture does not raise a second user-visible error

### Requirement: Privacy-safe telemetry

The platform SHALL redact credentials, authorization values, cookies, tokens, email addresses, personal identifiers, query values, request bodies, and response bodies before telemetry is buffered or exported. The platform SHALL use an allowlist for diagnostic attributes and MUST NOT rely on a denylist alone.

#### Scenario: Sensitive data appears in an error context

- **WHEN** an error context contains an email address, token, password, cookie, authorization header, or unapproved object field
- **THEN** the exported event replaces or removes the sensitive value before serialization
- **AND** no unsanitized copy is persisted in browser storage

#### Scenario: Telemetry is disabled

- **WHEN** environment configuration or user consent disables optional telemetry
- **THEN** the platform does not export optional traces or replay data
- **AND** essential local error handling and recovery remain functional

### Requirement: OpenTelemetry trace correlation

The platform SHALL support OpenTelemetry-compatible browser traces and W3C trace context propagation for explicitly allowlisted API origins. Trace export SHALL be configured by environment and loaded conditionally so that absent or unreachable collectors do not block the application.

#### Scenario: Instrumented API call succeeds

- **WHEN** the application sends a request to an allowlisted API origin while tracing is enabled
- **THEN** the request is represented by a client span correlated with the current user action
- **AND** compatible trace context is propagated without including PII

#### Scenario: Collector is unavailable

- **WHEN** the telemetry collector is unreachable, slow, or misconfigured
- **THEN** trace export fails silently from the user's perspective
- **AND** application requests, navigation, and recovery actions continue without waiting for the collector

### Requirement: Bounded telemetry lifecycle

The platform SHALL bound telemetry memory, sampling, retries, and export time. It SHALL flush critical buffered events during supported page lifecycle transitions without extending navigation indefinitely.

#### Scenario: Repeated failures produce high event volume

- **WHEN** equivalent failures occur repeatedly within the configured aggregation window
- **THEN** the platform rate-limits or aggregates duplicate diagnostics
- **AND** preserves a count and representative correlation context

#### Scenario: Page is closing

- **WHEN** the document enters a supported hidden or terminating lifecycle state
- **THEN** the platform performs a bounded best-effort flush
- **AND** does not prevent the user from leaving the page

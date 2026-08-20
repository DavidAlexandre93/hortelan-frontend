## ADDED Requirements

### Requirement: Correlated and sanitized API diagnostics

Every API request SHALL receive a client request identifier and, when tracing is enabled, compatible trace correlation. Failures SHALL preserve typed classification, operation, attempt count, safe status, duration, and correlation identifiers while excluding PII, credentials, raw bodies, and unapproved URL values.

#### Scenario: API request fails with a server error

- **WHEN** an API operation receives a server error
- **THEN** the client returns a typed sanitized error carrying request and incident identifiers
- **AND** records a correlated diagnostic event without response body content

#### Scenario: URL contains private query values

- **WHEN** an operation URL contains search or identity parameters
- **THEN** diagnostics record the route template or operation identifier rather than the raw query string

### Requirement: Health-aware recovery policy

Retry, status-check, and user guidance decisions SHALL consider operation safety, idempotency support, network state, health status, timeout class, and server retry guidance. Automatic retries SHALL remain bounded and SHALL NOT duplicate a mutation that lacks an idempotency contract.

#### Scenario: Safe read fails transiently

- **WHEN** an idempotent read fails with a retryable transport or service condition
- **THEN** the client may retry using bounded backoff and jitter
- **AND** records each attempt under the same logical request correlation

#### Scenario: Non-idempotent mutation has no key support

- **WHEN** a mutation fails with an unknown outcome and the backend does not support idempotency
- **THEN** the client does not retry automatically
- **AND** informs the user that the outcome must be checked before resubmission

### Requirement: Contract failures remain distinct

Request validation, response validation, authentication, authorization, conflict, timeout, cancellation, offline, rate-limit, dependency, and unexpected failures SHALL retain distinct error kinds through application handling and presentation mapping.

#### Scenario: Response validation fails

- **WHEN** a successful HTTP response violates its DTO schema
- **THEN** the error is classified as a contract failure rather than a generic network error
- **AND** retry guidance does not imply that malformed data was accepted

#### Scenario: User cancels a request

- **WHEN** navigation or an explicit action aborts an in-flight request
- **THEN** the cancellation is distinguishable from timeout and service failure
- **AND** no alarming user notification is shown unless the canceled operation needs confirmation

### Requirement: Observable health freshness

Health information SHALL include its checked time and SHALL expire after a documented interval. The UI SHALL distinguish healthy, degraded, unavailable, unknown, offline, and stale health states without treating a cached healthy result as current indefinitely.

#### Scenario: Cached health becomes stale

- **WHEN** the last successful health check exceeds its freshness interval
- **THEN** the status changes from healthy to stale or unknown
- **AND** actions that require current health trigger a bounded refresh or display appropriate guidance

## Purpose

Define executable API contracts for frontend requests, responses, health, mutation idempotency, and committed outcomes so integration failures are detected early and communicated consistently.

## ADDED Requirements

### Requirement: Bidirectional DTO validation

Every supported API operation SHALL have explicit request and response DTO schemas. The client SHALL validate outbound input before transport and inbound payloads before exposing data to application code, including enums, nullable fields, identifiers, dates, pagination, and error envelopes.

#### Scenario: Invalid request DTO is submitted

- **WHEN** application code attempts to send a request that violates its operation schema
- **THEN** the client rejects the operation before network transport
- **AND** reports a typed validation error without exposing the invalid payload in telemetry

#### Scenario: Backend response drifts from the contract

- **WHEN** an API response does not satisfy the declared response DTO
- **THEN** the client returns a typed contract error instead of partially trusted data
- **AND** records the operation identifier, incident identifier, and sanitized validation issues

### Requirement: OpenAPI 3.1 contract

The repository SHALL produce a deterministic OpenAPI 3.1 document from the maintained DTO and operation definitions. Continuous integration SHALL validate the document and fail when the generated contract differs from the committed artifact.

#### Scenario: Contract generation is current

- **WHEN** the contract generation and validation commands run without source changes
- **THEN** they produce no repository diff
- **AND** every documented operation references reusable request, response, and error schemas

#### Scenario: DTO changes without contract synchronization

- **WHEN** a DTO or operation changes but the committed OpenAPI artifact is stale
- **THEN** the contract drift gate fails with the affected operation or schema

### Requirement: Health contract

The API contract SHALL define a lightweight health response with overall status, check time, service version when available, and named dependency statuses using bounded enums. Health data MUST NOT reveal infrastructure addresses, credentials, database names, or stack traces.

#### Scenario: A dependency is degraded

- **WHEN** the health operation reports at least one noncritical dependency as degraded
- **THEN** the response remains schema-valid with an overall degraded status
- **AND** the frontend can present limited availability without exposing infrastructure details

#### Scenario: Health payload is invalid or unavailable

- **WHEN** the health operation times out, fails validation, or cannot be reached
- **THEN** the client treats health as unknown rather than healthy
- **AND** preserves normal offline and retry behavior

### Requirement: Idempotent mutation contract

Each mutation that can be retried or duplicated SHALL accept a stable idempotency key scoped to the intended command. The same command retry SHALL reuse the key, while a distinct user intent SHALL receive a new key.

#### Scenario: User retries the same mutation

- **WHEN** a mutation outcome is unknown because the response was interrupted
- **THEN** a user-initiated retry reuses the original idempotency key
- **AND** the client prevents concurrent duplicate submissions for that command

#### Scenario: User starts a new command

- **WHEN** the previous mutation reached a terminal outcome and the user submits a new intent
- **THEN** the client creates a new idempotency key

### Requirement: Committed outcome semantics

The frontend SHALL treat an operation as successful only after the backend contract returns a committed success outcome. ACID transaction guarantees SHALL remain the responsibility of the transactional backend and SHALL be documented as an integration dependency rather than simulated in browser state.

#### Scenario: Backend reports a partial or rolled-back outcome

- **WHEN** a mutation response reports failure, rollback, conflict, or incomplete processing
- **THEN** the frontend does not display the operation as completed
- **AND** provides a typed recovery action appropriate to the reported outcome

#### Scenario: Response is lost after submission

- **WHEN** transport fails before the client knows whether the backend committed the mutation
- **THEN** the frontend presents the outcome as unknown
- **AND** offers a status check or idempotent retry instead of assuming success or failure

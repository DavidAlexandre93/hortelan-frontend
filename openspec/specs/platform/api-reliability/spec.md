## Purpose

Defines how frontend API calls resolve backend targets, normalize HTTP outcomes, apply retry policy, and record reliability telemetry.

## Requirements

### Requirement: Environment-aware API base URL

The frontend SHALL resolve the API base URL from environment configuration first, then fall back to localhost during local development and same-origin behavior otherwise.

#### Scenario: API base URL is configured

- **WHEN** `VITE_API_BASE_URL` or `VITE_BACKEND_URL` is present
- **THEN** API requests use that configured base URL after removing any trailing slash

### Requirement: Normalized HTTP failures

API requests MUST convert transport, timeout, cancellation, contract, authorization, rate-limit, and non-success HTTP outcomes into a canonical error shape with a stable kind, status when available, retryability, and a safe user message.

#### Scenario: Backend returns an error payload

- **WHEN** an API response has a non-2xx status
- **THEN** the caller receives a canonical error with status and sanitized details suitable for recovery behavior and telemetry

#### Scenario: Request is intentionally cancelled

- **WHEN** navigation or a newer request cancels an in-flight request
- **THEN** the caller receives a cancellation outcome that is not presented as a service failure

### Requirement: Bounded request timeout

API requests MUST abort when they exceed the configured timeout window and SHALL distinguish timeout from user-initiated cancellation.

#### Scenario: Backend is unresponsive

- **WHEN** an API request does not complete before the timeout
- **THEN** the request is aborted and the caller receives a retryable timeout error instead of waiting indefinitely

### Requirement: Idempotent retry policy

The API client SHALL retry only idempotent requests for timeout or retryable HTTP status failures, using bounded backoff with jitter.

#### Scenario: GET request receives a retryable status

- **WHEN** an idempotent request fails with 408, 425, 429, 500, 502, 503, or 504 before retry attempts are exhausted
- **THEN** the client retries after a bounded backoff delay

#### Scenario: POST request fails

- **WHEN** a non-idempotent request fails
- **THEN** the client does not automatically retry the request

### Requirement: API telemetry

The frontend SHALL record sanitized request path, duration, status, outcome kind, retry count, and success state for API calls without recording credentials, request bodies, or sensitive query values.

#### Scenario: API request finishes

- **WHEN** an API request succeeds, fails, times out, or exhausts retries
- **THEN** the platform reliability layer receives a sanitized metric for the final request outcome

### Requirement: Runtime response contract validation

Critical authentication, profile, monitoring, alert, report, subscription, and integration responses MUST be validated before their data reaches user-facing views.

#### Scenario: Backend returns a malformed successful response

- **WHEN** a 2xx response does not satisfy the expected response contract
- **THEN** the caller receives a contract error, the invalid payload is not rendered as trusted data, and a sanitized diagnostic is recorded

### Requirement: Request cancellation ownership

Data-backed routes SHALL cancel obsolete in-flight reads when the route, filter set, or component ownership changes.

#### Scenario: User changes filters rapidly

- **WHEN** a newer query supersedes an older in-flight query
- **THEN** the older request is cancelled or ignored and cannot overwrite the newer result

### Requirement: User-visible recovery guidance

Canonical API errors SHALL map to consistent user actions for retry, reauthentication, permission review, rate-limit waiting, offline recovery, or support escalation.

#### Scenario: Session is no longer authorized

- **WHEN** an API response indicates that the active session is invalid or expired
- **THEN** the frontend clears protected session state and routes the user through authentication while preserving a safe return destination

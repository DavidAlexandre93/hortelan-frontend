## Purpose

Defines how frontend API calls resolve backend targets, normalize HTTP outcomes, apply retry policy, and record reliability telemetry.

## Requirements

### Requirement: Environment-aware API base URL

The frontend SHALL resolve the API base URL from environment configuration first, then fall back to localhost during local development and same-origin behavior otherwise.

#### Scenario: API base URL is configured

- **WHEN** `VITE_API_BASE_URL` or `VITE_BACKEND_URL` is present
- **THEN** API requests use that configured base URL after removing any trailing slash

### Requirement: Normalized HTTP failures

API requests MUST convert non-success HTTP responses into errors that include status and parsed payload details when available.

#### Scenario: Backend returns an error payload

- **WHEN** an API response has a non-2xx status
- **THEN** the caller receives an error with the response status and parsed payload for user-facing handling or telemetry

### Requirement: Bounded request timeout

API requests MUST abort when they exceed the configured timeout window.

#### Scenario: Backend is unresponsive

- **WHEN** an API request does not complete before the timeout
- **THEN** the request is aborted and the caller receives a failure instead of waiting indefinitely

### Requirement: Idempotent retry policy

The API client SHALL retry only idempotent requests for timeout or retryable HTTP status failures, using bounded backoff with jitter.

#### Scenario: GET request receives a retryable status

- **WHEN** an idempotent request fails with 408, 425, 429, 500, 502, 503, or 504 before retry attempts are exhausted
- **THEN** the client retries after a bounded backoff delay

#### Scenario: POST request fails

- **WHEN** a non-idempotent request fails
- **THEN** the client does not automatically retry the request

### Requirement: API telemetry

The frontend SHALL record request path, duration, status, and success state for API calls.

#### Scenario: API request finishes

- **WHEN** an API request succeeds or fails
- **THEN** the platform reliability layer receives a sanitized metric for the request outcome

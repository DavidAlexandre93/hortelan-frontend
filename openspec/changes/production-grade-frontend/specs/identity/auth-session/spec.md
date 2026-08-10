## MODIFIED Requirements

### Requirement: Backend-first authentication

The frontend SHALL treat configured backend authentication as authoritative and MUST NOT report a production login, registration, recovery, MFA, or account-security action as successful unless the backend confirms it.

#### Scenario: User submits credentials

- **WHEN** a login request is submitted with demo mode disabled
- **THEN** the frontend sends the request to the backend authentication API and establishes a session only from a validated successful response

#### Scenario: Backend rejects an account action

- **WHEN** the backend rejects registration, recovery, MFA, consent, export, deletion, or session management
- **THEN** the frontend preserves a signed-out or unchanged state and displays the canonical failure without fabricating local success

### Requirement: Bounded demo authentication fallback

Demo authentication MUST be available only when `VITE_ENABLE_DEMO_AUTH=true` is explicitly configured for the deployment and SHALL remain visibly identified as demo behavior.

#### Scenario: Backend login fails outside fallback conditions

- **WHEN** the backend authentication request fails and explicit demo mode is disabled
- **THEN** the frontend returns an authentication service error instead of signing the user in locally

#### Scenario: Local development has not enabled demo mode

- **WHEN** the application runs on localhost without `VITE_ENABLE_DEMO_AUTH=true`
- **THEN** local seeded credentials and browser-only identity flows remain unavailable

#### Scenario: Explicit demo login succeeds

- **WHEN** demo mode is explicitly enabled and valid demo credentials are submitted
- **THEN** the application establishes an isolated demo session and labels the experience as non-production

## ADDED Requirements

### Requirement: No plaintext credential persistence

Authentication flows MUST NOT persist plaintext passwords, password history, reset secrets, or MFA secrets in browser storage outside an isolated development fixture that is excluded from production assets.

#### Scenario: User completes an identity flow

- **WHEN** login, registration, password change, reset, or MFA setup completes
- **THEN** prohibited secrets are absent from localStorage and sessionStorage

### Requirement: Stable authentication initialization

The frontend SHALL expose an authentication initialization state before deciding protected-route redirects.

#### Scenario: Existing session is being restored

- **WHEN** the application has not completed session validation
- **THEN** protected content and public-auth redirects wait on a non-blank pending state instead of briefly rendering the wrong page

### Requirement: Safe post-auth redirect

The frontend MUST accept only same-application route destinations when returning a user to the page requested before authentication.

#### Scenario: Login receives an external redirect target

- **WHEN** the stored or supplied return destination resolves outside the application route space
- **THEN** the application ignores it and uses the default authenticated dashboard route

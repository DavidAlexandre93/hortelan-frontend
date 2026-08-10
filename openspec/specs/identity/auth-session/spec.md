## Purpose

Defines user identity, authentication, session, demo fallback, two-factor authentication, consent, and account lifecycle behavior for the frontend.

## Requirements

### Requirement: Backend-first authentication

The frontend SHALL treat configured backend authentication as authoritative and MUST NOT report a production login, registration, recovery, MFA, or account-security action as successful unless the backend confirms it.

#### Scenario: User submits credentials

- **WHEN** a login request is submitted with demo mode disabled
- **THEN** the frontend sends the request to the backend authentication API and establishes a session only from a validated successful response

#### Scenario: Backend rejects an account action

- **WHEN** the backend rejects registration, recovery, MFA, consent, export, deletion, or session management
- **THEN** the frontend preserves a signed-out or unchanged state and displays the canonical failure without fabricating local success

### Requirement: Bounded demo authentication fallback

Demo authentication MUST be limited to explicitly configured demo deployments or the temporary Vite local-development credential. It SHALL remain visibly identified as demo behavior and MUST NOT place the built-in local credential in production assets.

#### Scenario: Backend login fails outside fallback conditions

- **WHEN** the backend authentication request fails outside Vite development and explicit demo mode is disabled
- **THEN** the frontend returns an authentication service error instead of signing the user in locally

#### Scenario: Temporary local-development login succeeds

- **WHEN** the application runs through the Vite development environment and the fixed temporary local credential is submitted
- **THEN** the application establishes an isolated, visibly identified demo session without requiring local environment configuration

#### Scenario: Production assets are generated

- **WHEN** the production client build completes
- **THEN** the unique local email and credential-bearing development branch are absent from generated HTML, JavaScript, source maps, and static assets, so the fixed credential cannot authenticate a production client

#### Scenario: Explicit demo login succeeds

- **WHEN** demo mode is explicitly enabled and valid demo credentials are submitted
- **THEN** the application establishes an isolated demo session and labels the experience as non-production

### Requirement: Two-factor challenge handling

The auth flow SHALL require a second factor for users with two-factor authentication enabled unless the current device is trusted and unexpired.

#### Scenario: MFA-enabled user signs in on an untrusted device

- **WHEN** valid primary credentials are submitted without a valid trusted device
- **THEN** the auth flow returns a two-factor challenge before establishing a session

### Requirement: Trusted device lifecycle

Trusted devices SHALL have bounded validity and support revocation, compromise marking, and credential rotation.

#### Scenario: User revokes a trusted device

- **WHEN** an authenticated user revokes or marks a trusted device as compromised
- **THEN** that device can no longer bypass two-factor authentication

### Requirement: Session lifecycle controls

Authenticated sessions MUST support current-session logout, all-session logout, other-session logout, and idle expiration.

#### Scenario: Session exceeds idle timeout

- **WHEN** the active session has been idle beyond the configured timeout
- **THEN** the frontend clears the current session and treats the user as unauthenticated

### Requirement: Account privacy controls

Authenticated users SHALL be able to manage consents, export personal data, request deletion, and deactivate their account from frontend-supported flows.

#### Scenario: User requests personal data export

- **WHEN** an authenticated user triggers data export
- **THEN** the frontend returns the user profile, consent, session, device, password-history, deletion, and retention data available to the client

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

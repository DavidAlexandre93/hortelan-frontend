## Purpose

Defines user identity, authentication, session, demo fallback, two-factor authentication, consent, and account lifecycle behavior for the frontend.

## Requirements

### Requirement: Backend-first authentication

The frontend SHALL attempt configured backend authentication before using any local demo authentication behavior.

#### Scenario: User submits credentials

- **WHEN** a login request is submitted
- **THEN** the frontend sends the request to the backend authentication API before considering demo-mode local state

### Requirement: Bounded demo authentication fallback

Demo authentication MUST be limited to explicitly enabled demo mode, local Vite development, or a detected API-base misconfiguration that cannot represent a successful backend login.

#### Scenario: Backend login fails outside fallback conditions

- **WHEN** the backend authentication request fails and no allowed fallback condition is present
- **THEN** the frontend returns an authentication service unavailable error instead of silently signing the user in locally

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

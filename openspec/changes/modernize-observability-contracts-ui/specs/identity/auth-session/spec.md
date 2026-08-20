## MODIFIED Requirements

### Requirement: Bounded demo authentication fallback

Demo authentication MUST be limited to explicitly configured demo deployments or the temporary Vite local-development credential. It SHALL remain visibly identified as demo behavior, MUST NOT place the fixed email or password in plaintext production assets, and MUST NOT be treated as privileged backend identity.

#### Scenario: Backend login fails outside fallback conditions

- **WHEN** the backend authentication request fails outside Vite development and explicit demo mode is disabled
- **THEN** the frontend returns an authentication service error instead of signing the user in locally

#### Scenario: Temporary local-development login succeeds

- **WHEN** the application runs through the Vite development environment and the fixed temporary local credential is submitted
- **THEN** the application establishes an isolated, visibly identified demo session without requiring local environment configuration

#### Scenario: Production assets are generated

- **WHEN** the production client build runs with explicit demo mode disabled
- **THEN** the fixed credential cannot authenticate the client and credential-bearing demo configuration is absent from generated assets

#### Scenario: Explicit demo login succeeds

- **WHEN** an explicitly configured demo deployment receives the approved temporary credential
- **THEN** the application establishes an isolated demo session without waiting for a failing backend request
- **AND** visibly labels the experience as non-production

#### Scenario: Explicit demo assets are generated

- **WHEN** a production-format client build is generated for the explicitly enabled demo deployment
- **THEN** the fixed email and password are absent in plaintext from generated HTML, JavaScript, source maps, and static assets
- **AND** only one-way credential verifiers and nonprivileged demo behavior are available to the client

## ADDED Requirements

### Requirement: Truthful social authentication availability

Google and Apple controls SHALL distinguish isolated demo access from real provider authentication. The frontend MUST NOT present a provider control as functional real OAuth until its public client configuration, registered origins and redirects, content security policy, and backend authorization-code validation are available.

#### Scenario: Social control is used in explicit demo mode

- **WHEN** the user selects Google or Apple in an explicitly enabled demo deployment
- **THEN** the application establishes an isolated demo session without contacting the provider or unavailable backend
- **AND** the control and resulting experience remain visibly identified as demo behavior

#### Scenario: Real social authentication is not configured

- **WHEN** demo mode is disabled and a provider integration lacks any required client or backend configuration
- **THEN** the provider control is visibly unavailable and cannot submit a misleading authentication request

#### Scenario: Real social authentication is configured

- **WHEN** all provider and backend requirements are configured and a user authorizes with Google or Apple
- **THEN** the frontend sends only the short-lived provider credential or authorization code to the backend
- **AND** establishes a session only after the backend validates the provider response and confirms the identity

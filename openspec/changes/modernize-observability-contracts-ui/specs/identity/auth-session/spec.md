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

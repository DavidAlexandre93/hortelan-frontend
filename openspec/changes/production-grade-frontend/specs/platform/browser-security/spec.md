## Purpose

Defines browser-side security and privacy controls for production delivery, third-party telemetry, client configuration, dependencies, and locally persisted data.

## ADDED Requirements

### Requirement: Secure browser response policy

Production delivery MUST apply a documented browser security policy covering content sources, framing, referrers, MIME sniffing, permissions, and HTTPS transport.

#### Scenario: Browser requests a production document

- **WHEN** the application document is served in production
- **THEN** the response includes enforced security headers with an explicit allowlist for required application and telemetry resources

#### Scenario: Unauthorized site attempts to frame the application

- **WHEN** a third-party origin embeds a protected Hortelan page
- **THEN** the browser security policy blocks the framing attempt

### Requirement: Environment-governed telemetry

Telemetry, session recording, and analytics integrations MUST be enabled by environment configuration and SHALL respect applicable user consent before collecting optional replay or behavioral data.

#### Scenario: Telemetry is not configured

- **WHEN** a deployment omits a telemetry provider configuration
- **THEN** the provider does not initialize and the application remains functional

#### Scenario: Optional recording lacks consent

- **WHEN** the user has not granted the required analytics or replay consent
- **THEN** optional recording does not start and no replay payload is emitted

### Requirement: No production client credentials

Production client assets MUST NOT contain seeded account passwords, private access tokens, or vendor configuration that is not explicitly intended to be public.

#### Scenario: Production assets are scanned

- **WHEN** the built HTML, JavaScript, source maps, and static assets are inspected
- **THEN** no demo password, private token, or undeclared embedded vendor credential is present

### Requirement: Bounded browser persistence

Production authentication SHALL persist only the minimum client state required by the backend session model and MUST NOT store plaintext passwords, password history, reset tokens, or MFA secrets in browser storage.

#### Scenario: Authenticated production session is inspected

- **WHEN** localStorage and sessionStorage are reviewed after login and account-security actions
- **THEN** prohibited credential and security-secret values are absent

### Requirement: Patched production dependency baseline

The production dependency graph MUST contain no known high or critical vulnerability with a compatible remediation available.

#### Scenario: Dependency security gate runs

- **WHEN** the production dependency audit identifies a high or critical advisory with an available compatible fix
- **THEN** the delivery gate fails until the dependency is remediated or a time-bounded exception is documented

### Requirement: Controlled external resources

Fonts, scripts, images, and translation resources loaded from external origins SHALL be declared, failure-tolerant, and compatible with the security policy.

#### Scenario: External resource is unavailable

- **WHEN** an allowed external font, translation, analytics, or telemetry resource cannot load
- **THEN** core navigation, authentication, and dashboard functionality continue with a local fallback

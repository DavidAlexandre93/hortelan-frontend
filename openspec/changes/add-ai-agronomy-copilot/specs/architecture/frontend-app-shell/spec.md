## ADDED Requirements

### Requirement: Authenticated assistant composition

The application shell SHALL expose one lazy-loaded assistant surface within the authenticated dashboard, MUST exclude it from public and authentication routes, and SHALL keep AI availability from blocking shell startup, navigation, or selective SSR output.

#### Scenario: Dashboard loads before AI code

- **WHEN** an authenticated route first renders and the user has not invoked an AI feature
- **THEN** the core route remains usable without downloading or initializing the assistant feature bundle

#### Scenario: AI capability is unavailable

- **WHEN** assistant capability discovery, lazy loading, or the AI gateway fails
- **THEN** the shell preserves navigation and current route content and exposes a scoped recovery state for the assistant only

### Requirement: Allowlisted route context

The shell MUST derive assistant context from a versioned allowlist of route metadata and explicit resource identifiers and SHALL never provide component state, form secrets, hidden DOM content, or unrelated page data by default.

#### Scenario: User invokes contextual help

- **WHEN** an authenticated user opens the assistant from a supported resource page
- **THEN** the request includes only the declared route, resource identifiers, locale, and user-approved context required for that assistance

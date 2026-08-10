## Purpose

Defines the externally observable behavior of the Hortelan frontend shell, routing model, protected dashboard, lazy loading, and selective SSR surfaces.

## Requirements

### Requirement: Splash precedes routed content

The frontend SHALL present a bounded Hortelan splash experience before routed content without delaying repeat visits, recovery, or reduced-motion users unnecessarily.

#### Scenario: User enters the application

- **WHEN** the browser loads an application route for a first visit
- **THEN** the splash experience is shown before the router renders the destination page and completes within the configured maximum duration

#### Scenario: Splash cannot finish normally

- **WHEN** the splash experience errors or exceeds its safe fallback window
- **THEN** the application continues to the routed experience instead of leaving the user on a blank screen

#### Scenario: User prefers reduced motion

- **WHEN** the browser reports a reduced-motion preference
- **THEN** the application uses a static, shortened splash and continues to the requested route

### Requirement: Root route directs to authentication

The application SHALL send unauthenticated root visits to the login experience.

#### Scenario: User opens the root path

- **WHEN** the current path is `/`
- **THEN** the user is redirected to `/login`

### Requirement: Dashboard route protection

Dashboard and legacy product routes MUST require an authenticated session before protected content is loaded or shown.

#### Scenario: Unauthenticated user requests a dashboard page

- **WHEN** a user without a valid session opens `/dashboard` or a child route
- **THEN** the user is prevented from viewing the dashboard content and is routed through the authentication flow

#### Scenario: Unauthenticated user requests a legacy protected page

- **WHEN** a user without a valid session opens a supported legacy path for a dashboard capability
- **THEN** the application routes through authentication before resolving the canonical protected destination

### Requirement: Authenticated users avoid auth pages

Authentication pages SHALL redirect already authenticated users away from login and registration flows.

#### Scenario: Signed-in user opens login

- **WHEN** an authenticated user opens `/login` or `/register`
- **THEN** the application redirects them away from the public auth form

### Requirement: Route-level lazy loading

Feature pages SHALL be loaded through route-level code splitting while preserving stable route paths, meaningful pending feedback, and recoverable load failures.

#### Scenario: User navigates to a dashboard feature

- **WHEN** a user opens a dashboard child route
- **THEN** the application loads only the code needed for that route, displays an accessible pending state, and keeps the documented path stable

#### Scenario: Route chunk cannot load

- **WHEN** a lazy route import fails because of a transient network or deployment-version mismatch
- **THEN** the application displays a recoverable error with a bounded retry or refresh action instead of a blank page

### Requirement: Selective SSR output

The project SHALL expose a Node SSR build and production server path for incremental server rendering adoption.

#### Scenario: SSR rendering is requested for a public path

- **WHEN** the SSR renderer receives a public path
- **THEN** the renderer returns route-specific HTML and document metadata for that path

#### Scenario: SSR rendering is requested for a protected path

- **WHEN** the SSR renderer receives a protected dashboard path
- **THEN** the renderer returns the client application shell so browser-side auth can resolve the route

### Requirement: Distinct registration experience

The `/register` route MUST render the registration workflow and SHALL NOT reuse the login form as its primary content.

#### Scenario: Unauthenticated user opens registration

- **WHEN** an unauthenticated user opens `/register`
- **THEN** the application presents registration fields, validation, consent, and a link back to login

### Requirement: Route-aware document metadata

Each public and protected route SHALL expose an accurate document title, description, canonical route identity, and active language suitable for navigation history and sharing.

#### Scenario: User navigates between features

- **WHEN** the active route changes
- **THEN** document metadata updates to identify the current Hortelan feature without stale metadata from the previous route

### Requirement: Recoverable application errors

The application shell MUST distinguish route-not-found, authorization, chunk-loading, and unexpected runtime failures and SHALL offer a safe recovery path for each.

#### Scenario: Unexpected render failure occurs

- **WHEN** a page throws an unhandled render error
- **THEN** the shell shows an accessible error state with recovery navigation and records a sanitized diagnostic without forcing unrelated errors into a not-found route

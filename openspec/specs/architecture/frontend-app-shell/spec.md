## Purpose

Defines the externally observable behavior of the Hortelan frontend shell, routing model, protected dashboard, lazy loading, and selective SSR surfaces.

## Requirements

### Requirement: Splash precedes routed content

The frontend SHALL render an initial Hortelan splash experience before presenting routed application content.

#### Scenario: User enters the application

- **WHEN** the browser loads any application route
- **THEN** the splash experience is shown before the router renders the destination page

#### Scenario: Splash cannot finish normally

- **WHEN** the splash experience errors or exceeds its safe fallback window
- **THEN** the application continues to the routed experience instead of leaving the user on a blank screen

### Requirement: Root route directs to authentication

The application SHALL send unauthenticated root visits to the login experience.

#### Scenario: User opens the root path

- **WHEN** the current path is `/`
- **THEN** the user is redirected to `/login`

### Requirement: Dashboard route protection

Dashboard routes MUST require an authenticated session before protected product pages are shown.

#### Scenario: Unauthenticated user requests a dashboard page

- **WHEN** a user without a valid session opens `/dashboard` or a child route
- **THEN** the user is prevented from viewing the dashboard content and is routed through the authentication flow

### Requirement: Authenticated users avoid auth pages

Authentication pages SHALL redirect already authenticated users away from login and registration flows.

#### Scenario: Signed-in user opens login

- **WHEN** an authenticated user opens `/login` or `/register`
- **THEN** the application redirects them away from the public auth form

### Requirement: Route-level lazy loading

Feature pages SHALL be loaded through route-level code splitting while preserving stable route paths.

#### Scenario: User navigates to a dashboard feature

- **WHEN** a user opens a dashboard child route
- **THEN** the application loads only the code needed for that route and keeps the documented path stable

### Requirement: Selective SSR for public auth routes

The SSR server SHALL support rendering selected public authentication routes without requiring full dashboard SSR.

#### Scenario: SSR server receives an auth route

- **WHEN** the server handles `/login`, `/register`, or `/forgot-password`
- **THEN** it renders the supported public auth route through the Vite SSR path

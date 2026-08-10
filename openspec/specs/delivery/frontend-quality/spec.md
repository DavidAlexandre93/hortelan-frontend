## Purpose

Defines the delivery guardrails for Hortelan frontend quality, validation, build performance, and environment promotion.

## Requirements

### Requirement: Unified quality gate

The project MUST provide a single quality gate that validates OpenSpec, strict linting, formatting, unit and component coverage, critical integration behavior, production build, dependency security, bundle budgets, accessibility checks, and frontend architecture audit.

#### Scenario: Developer runs the quality gate

- **WHEN** `npm run quality:gate` is executed
- **THEN** every required validation runs with deterministic exit behavior and any failed gate prevents successful completion

### Requirement: Repeatable OpenSpec commands

The repository SHALL expose npm scripts for listing specs, validating all OpenSpec artifacts, checking OpenSpec health, and refreshing generated OpenSpec integrations.

#### Scenario: Developer checks SDD health

- **WHEN** a developer runs the documented OpenSpec npm scripts
- **THEN** the scripts use the project-pinned OpenSpec CLI rather than an unpinned global install

### Requirement: Production build validation

The delivery flow MUST validate that the Vite production build completes before promotion.

#### Scenario: CI validates a candidate

- **WHEN** a candidate change reaches the build step
- **THEN** the production build must complete successfully before deployment or promotion continues

### Requirement: Consistent supported delivery runtime

The project MUST declare one supported Node.js major version consistently across package metadata, continuous integration, deployment configuration, and contributor documentation. The selected runtime SHALL be supported by the hosting provider and every direct development dependency.

#### Scenario: Hosting platform installs the project

- **WHEN** the deployment platform resolves the Node.js version from `package.json`
- **THEN** it selects Node.js 24.x without a deprecated-runtime override or incompatible-engine warning

#### Scenario: Continuous integration verifies the release

- **WHEN** CI installs dependencies and executes the unified quality gate
- **THEN** it uses the same Node.js 24.x major declared for production deployment

### Requirement: Bundle boundary preservation

The frontend SHALL maintain intentional route and vendor boundaries, MUST exclude development-only data generators from the production entry graph, and SHALL fail delivery when approved size budgets regress.

#### Scenario: Production bundle is analyzed

- **WHEN** the build completes
- **THEN** entry, route, vendor, and total transfer sizes are compared with committed budgets and development-only mock dependencies are absent from the production entry graph

#### Scenario: Bundling strategy changes

- **WHEN** chunk boundaries or budgets are added, removed, or reorganized
- **THEN** the change is captured in OpenSpec and validated against measured user-impact goals

### Requirement: Performance baseline tracking

The project SHALL maintain reproducible performance baselines for build output and representative public and dashboard routes, including loading, responsiveness, and layout stability metrics.

#### Scenario: Performance hardening is planned

- **WHEN** a performance-affecting change is completed
- **THEN** the committed baseline records before-and-after bundle measurements and representative route results under documented conditions

### Requirement: Controlled environment promotion

Deployments MUST follow the documented branch-to-environment strategy and require explicit production promotion.

#### Scenario: Production deployment is requested

- **WHEN** production promotion is triggered
- **THEN** promotion rules and environment approval gates run before production deployment proceeds

### Requirement: Risk-based automated test layers

The delivery suite MUST cover pure domain logic, shared UI behavior, authentication and routing integration, and critical browser journeys at a depth proportional to user and security risk.

#### Scenario: Identity or route behavior changes

- **WHEN** authentication, registration, recovery, redirect, or protected-route logic is modified
- **THEN** automated tests cover success, validation failure, service failure, unauthorized access, and safe redirect behavior

### Requirement: Accessibility regression gate

Representative public and dashboard routes MUST pass automated accessibility checks and keyboard-oriented smoke tests with no serious or critical violations.

#### Scenario: Candidate build is validated

- **WHEN** accessibility checks run against representative routes at mobile and desktop viewports
- **THEN** serious or critical violations fail the gate and identified exceptions require a documented, time-bounded rationale

### Requirement: Responsive browser journey gate

Critical login, registration, dashboard navigation, monitoring, profile, and error-recovery journeys SHALL be exercised at supported mobile and desktop viewport sizes.

#### Scenario: End-to-end suite runs

- **WHEN** a candidate build is tested in the browser
- **THEN** critical journeys complete without uncaught errors, overlapping primary controls, unintended horizontal page scrolling, or blank lazy-route states

### Requirement: Accurate source reachability audit

The frontend architecture audit MUST resolve static imports, dynamic imports, re-exports, and configured entry points before classifying a source file as potentially orphaned.

#### Scenario: Lazy route is audited

- **WHEN** a source module is reachable only through a dynamic route import
- **THEN** the audit classifies it as reachable instead of reporting it as an orphan

### Requirement: Dependency security gate

The delivery flow MUST audit production dependencies and SHALL fail for high or critical vulnerabilities with compatible fixes unless a documented exception includes owner, impact, mitigation, and expiry.

#### Scenario: Fixable high vulnerability is detected

- **WHEN** the dependency audit reports a high-severity production advisory with an available compatible remediation
- **THEN** the quality gate fails until remediation or an approved time-bounded exception is committed

### Requirement: Maintainability thresholds

The project SHALL track oversized production modules and MUST require decomposition or an explicit rationale when a changed page or service exceeds the agreed maintainability threshold.

#### Scenario: Oversized module is modified

- **WHEN** a production module above the configured line or complexity threshold changes
- **THEN** the quality report identifies it and the change either decomposes it or records a scoped follow-up rationale

### Requirement: Minimal production surface

The project MUST remove confirmed unreachable modules, obsolete configuration, unused direct dependencies, dead helpers, unnecessary public exports, and controls that imply behavior they do not implement. Modules SHALL keep one clear responsibility, reuse established boundaries, and introduce abstractions only for demonstrated complexity or repetition.

#### Scenario: Static analysis reports an unused item

- **WHEN** reachability, lint, dependency, or export analysis reports an item without a consumer
- **THEN** the item is verified against build, test, script, dynamic-import, and configuration entry points before it is removed or retained with a concrete reason

#### Scenario: A control has no implemented action

- **WHEN** an interactive production control only logs, fabricates success, or exposes a planned action without a domain contract
- **THEN** the control is removed, disabled with an honest state, or connected to implemented behavior instead of remaining misleading

#### Scenario: A new abstraction is considered

- **WHEN** code can remain direct and focused without meaningful duplication or dependency inversion
- **THEN** the simpler composition is retained rather than adding a speculative abstraction

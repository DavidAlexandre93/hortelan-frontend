## Purpose

Defines the delivery guardrails for Hortelan frontend quality, validation, build performance, and environment promotion.

## Requirements

### Requirement: Unified quality gate

The project MUST provide a single quality gate that validates OpenSpec, linting, formatting, test coverage, production build, and frontend architecture audit.

#### Scenario: Developer runs the quality gate

- **WHEN** `npm run quality:gate` is executed
- **THEN** OpenSpec validation, lint, format check, test coverage, build, and frontend audit run in sequence

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

### Requirement: Bundle boundary preservation

The frontend SHALL preserve vendor chunk boundaries for React, Material UI, charts, motion, and Sentry dependencies unless an OpenSpec change records a different bundling decision.

#### Scenario: Bundling strategy changes

- **WHEN** manual chunks are added, removed, or reorganized
- **THEN** the change is captured in OpenSpec and validated against performance goals

### Requirement: Performance baseline tracking

The project SHALL maintain a documented performance baseline and hardening plan for frontend bundle and runtime performance work.

#### Scenario: Performance hardening is planned

- **WHEN** a performance change is proposed
- **THEN** the change references the current baseline or updates it as part of verification

### Requirement: Controlled environment promotion

Deployments MUST follow the documented branch-to-environment strategy and require explicit production promotion.

#### Scenario: Production deployment is requested

- **WHEN** production promotion is triggered
- **THEN** promotion rules and environment approval gates run before production deployment proceeds

## Purpose

Defines how Hortelan uses OpenSpec as the durable source of truth for spec-driven development across product, architecture, and delivery changes.

## Requirements

### Requirement: Source-of-truth specs

Project behavior, architectural constraints, and delivery rules that affect future work SHALL be captured under `openspec/specs` as reviewed OpenSpec requirements.

#### Scenario: A new cross-cutting change is requested

- **WHEN** a change affects security, routing, API behavior, build behavior, deployment, or multiple product areas
- **THEN** the team records the intended behavior in OpenSpec before implementation starts

### Requirement: Change artifacts before implementation

Feature and architecture work MUST use an OpenSpec change with proposal, delta specs, design when applicable, and tasks before project code is edited.

#### Scenario: A developer starts implementation

- **WHEN** implementation begins for a behavior-changing request
- **THEN** the active OpenSpec change contains enough artifacts to explain why, what, how, and how completion will be verified

### Requirement: Brownfield incremental adoption

The project SHALL document capabilities incrementally around real changes instead of requiring a complete upfront rewrite of all existing behavior.

#### Scenario: A legacy area has no spec yet

- **WHEN** a change touches an undocumented legacy area
- **THEN** the change adds or updates only the affected capability specs and leaves unrelated areas for later changes

### Requirement: Validation gate

The repository MUST validate OpenSpec artifacts as part of the same quality flow used for lint, tests, build, and frontend audits.

#### Scenario: Quality gate runs

- **WHEN** the local or CI quality gate is executed
- **THEN** OpenSpec validation runs and fails the gate if specs or active changes contain structural errors

### Requirement: Archive completed decisions

Completed OpenSpec changes SHALL be synchronized into the main specs and archived so future agents can reconstruct why a behavior exists.

#### Scenario: A change is complete

- **WHEN** implementation and verification are finished
- **THEN** the change is synced or archived with updated source-of-truth specs and a retained audit trail

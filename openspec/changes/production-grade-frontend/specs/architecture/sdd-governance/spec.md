## MODIFIED Requirements

### Requirement: Source-of-truth specs

Project behavior, architectural constraints, and delivery rules that affect future work SHALL be captured under `openspec/specs` as reviewed OpenSpec requirements.

#### Scenario: A new cross-cutting change is requested

- **WHEN** a change affects security, routing, API behavior, build behavior, deployment, user experience, or multiple product areas
- **THEN** the team records the intended observable behavior in OpenSpec before implementation starts

### Requirement: Change artifacts before implementation

Feature and architecture work MUST use an OpenSpec change with proposal, delta specs, design when applicable, and independently verifiable tasks before project code is edited.

#### Scenario: A developer starts implementation

- **WHEN** implementation begins for a behavior-changing request
- **THEN** the active OpenSpec change explains why the work is needed, what behavior changes, how material decisions are implemented, and how completion will be verified

#### Scenario: A non-behavioral maintenance task is requested

- **WHEN** work changes only documentation, formatting, generated output, or internal structure without changing observable behavior or an architectural contract
- **THEN** the change may omit delta specs only when that decision is explicitly recorded by the selected workflow

### Requirement: Validation gate

The repository MUST validate OpenSpec artifacts as part of the same quality flow used for lint, tests, builds, security checks, bundle budgets, frontend audits, accessibility checks, and browser journeys.

#### Scenario: Quality gate runs

- **WHEN** the local or CI quality gate is executed
- **THEN** the complete SDD check runs first and fails the gate if configuration, canonical specs, or active changes contain structural errors

### Requirement: Archive completed decisions

Completed OpenSpec changes SHALL synchronize their delta requirements into the canonical specs and then be archived so future contributors can reconstruct what behavior exists and why.

#### Scenario: A change is complete

- **WHEN** implementation and verification are finished
- **THEN** modified requirements replace their canonical counterparts by stable requirement name, added requirements are incorporated once, and the archived change retains the decision trail

#### Scenario: Archive readiness is reviewed

- **WHEN** an archive operation is requested
- **THEN** the team confirms task completion, strict validation, delta synchronization, and the absence of unresolved implementation gaps before archiving

## ADDED Requirements

### Requirement: Domain capability taxonomy

Every capability MUST use the stable `<domain>/<capability>` hierarchy and SHALL extend an existing capability when ownership already exists instead of creating a synonymous specification.

#### Scenario: A proposal classifies affected behavior

- **WHEN** a contributor lists new or modified capabilities
- **THEN** each capability uses an established domain, has one clear responsibility, and maps to exactly one delta-spec path

### Requirement: Requirement-to-verification traceability

Every behavior-changing OpenSpec change MUST preserve traceability from affected capabilities and requirements to implementation tasks and objective verification evidence.

#### Scenario: A change is reviewed

- **WHEN** a reviewer inspects a proposed or completed change
- **THEN** the proposal, delta specs, design, tasks, and validation evidence form a coherent chain without contradictory scope or unchecked acceptance criteria

### Requirement: Deterministic local OpenSpec toolchain

The repository MUST pin the OpenSpec CLI and SHALL expose repository-local commands for discovery, health diagnosis, strict validation, integration refresh, and the complete SDD check.

#### Scenario: A contributor validates SDD health

- **WHEN** the documented npm SDD command runs locally or in CI
- **THEN** it uses the project-pinned CLI, diagnoses the OpenSpec root, and validates all canonical specs and active changes in strict non-interactive mode

### Requirement: Explicit readiness and completion criteria

An OpenSpec change SHALL be ready for implementation only after every required planning artifact is complete and SHALL be considered complete only after every task and affected verification gate has passed.

#### Scenario: Apply workflow is requested

- **WHEN** required planning artifacts are missing or blocked
- **THEN** implementation remains blocked until the proposal, required specs, design decisions, and tasks are coherent and available

#### Scenario: Completion is reported

- **WHEN** all planned implementation work is believed to be finished
- **THEN** every task is checked only after its objective evidence exists and the affected quality commands pass

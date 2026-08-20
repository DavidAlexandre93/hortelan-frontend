## ADDED Requirements

### Requirement: Complete static quality gate

The required quality gate SHALL run formatting verification, linting, JavaScript type checking at contract boundaries, architecture dependency checks, OpenAPI validation and drift detection, production build, SSR verification, and semantic commit validation in deterministic noninteractive commands.

#### Scenario: Pull request satisfies static checks

- **WHEN** continuous integration runs on a proposed change
- **THEN** every required static gate exits successfully without modifying tracked files

#### Scenario: Forbidden dependency direction is introduced

- **WHEN** presentation code imports a concrete platform adapter outside the composition boundary
- **THEN** the architecture check fails with the offending import path

### Requirement: Honest coverage denominator and ratchet

Coverage SHALL include the maintained application logic selected by a documented inclusion and exclusion policy. Critical contracts, error normalization, redaction, idempotency, health, and recovery modules SHALL maintain 100 percent statement, branch, function, and line coverage, while the broader project SHALL use thresholds that cannot decrease without an approved specification change.

#### Scenario: Critical branch is untested

- **WHEN** a critical module adds a branch without an executed test
- **THEN** the coverage gate fails even if global percentages remain above their thresholds

#### Scenario: File is excluded from coverage

- **WHEN** a source file is omitted from the denominator
- **THEN** the test plan documents a concrete reason such as generated output, declarative constants, or an environment-only entry point

### Requirement: Layered test plan

The repository SHALL maintain and execute a test matrix covering unit, DTO contract, integration, selective SSR, end-to-end browser, accessibility, responsive visual, security and privacy, resilience, and observability behaviors. Tests SHALL favor deterministic fakes at boundaries and retain a small set of representative real-browser flows.

#### Scenario: Release candidate is verified

- **WHEN** the full release gate runs
- **THEN** it records results for every test-plan layer
- **AND** unresolved failures block release rather than being silently skipped

#### Scenario: External telemetry is unavailable in tests

- **WHEN** observability resilience tests run without a collector
- **THEN** deterministic adapters verify capture and degradation behavior without making public network calls

### Requirement: Dependency and bundle governance

The quality gate SHALL report vulnerable, deprecated, unused, duplicate, and materially outdated dependencies and SHALL enforce agreed bundle budgets for entry, UI, and visualization code. Runtime dependencies SHALL be added only with measured benefit and verified browser compatibility.

#### Scenario: Bundle budget regresses

- **WHEN** a production chunk exceeds its approved compressed budget
- **THEN** the gate fails with the affected chunk and measured size

#### Scenario: Major upgrade requires migration work

- **WHEN** an available major version is incompatible with the current toolchain or source syntax
- **THEN** the audit records it as deferred with a separate migration requirement

### Requirement: Conventional commit enforcement

Repository contributions SHALL use Conventional Commit-compatible subjects for local commits and pull request history evaluated by automation.

#### Scenario: Commit subject is invalid

- **WHEN** a commit subject does not match the configured semantic convention
- **THEN** the commit-message or continuous-integration gate reports the expected format and fails

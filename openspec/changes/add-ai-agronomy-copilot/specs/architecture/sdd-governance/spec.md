## ADDED Requirements

### Requirement: Versioned AI behavior governance

User-visible prompts, safety policies, provider routing, model settings, output schemas, tool contracts, retrieval rules, approved knowledge sources, retention modes, and evaluation thresholds MUST have stable versions and SHALL be changed through an OpenSpec artifact before production behavior is modified.

#### Scenario: AI behavior configuration changes

- **WHEN** a contributor changes a prompt, model route, policy, tool, schema, retrieval source, or critical evaluation threshold
- **THEN** the owning OpenSpec change describes the observable effect, migration, rollback, risk, and verification evidence before implementation or rollout

### Requirement: AI requirement-to-evaluation traceability

Every AI requirement SHALL map to implementation tasks and objective test or evaluation evidence, and critical safety scenarios MUST remain identifiable in the retained change history.

#### Scenario: AI change is reviewed for release

- **WHEN** reviewers inspect a completed AI change
- **THEN** they can trace each assistant, orchestration, privacy, safety, accessibility, and quality requirement to passing deterministic tests or recorded evaluation results

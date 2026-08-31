## ADDED Requirements

### Requirement: Contextual AI entry points

Monitoring, alerts, species, reports, help, and Hortelan 360 SHALL expose AI assistance only where the current resource context can materially improve the answer, and each entry point MUST identify the scope that will be shared before submission.

#### Scenario: User asks about a sensor anomaly

- **WHEN** the user invokes assistance from a sensor or monitoring context
- **THEN** the assistant receives only authorized measurements, crop context, thresholds, and freshness metadata selected for the request

#### Scenario: User asks from the species catalog

- **WHEN** the user requests care guidance for a selected species
- **THEN** the assistant combines approved species evidence with explicitly selected operational context and does not assume an unselected garden or crop

### Requirement: Source-preserving AI summaries

AI explanations and summaries SHALL remain secondary to authoritative source data and MUST provide a direct path back to the alert, measurement, report, species record, or help article used as context.

#### Scenario: Summary conflicts with source data

- **WHEN** a generated summary cannot be reconciled with the displayed authoritative values
- **THEN** the interface preserves the source values, blocks action generation from the conflicting answer, and offers a fresh analysis or incident path

### Requirement: Reviewable AI-derived workflow drafts

An AI-derived task, note, filter, or report narrative MUST remain an editable draft until the user reviews its evidence, target, fields, and consequences and invokes the normal authorized workflow command.

#### Scenario: User accepts a proposed follow-up task

- **WHEN** the user reviews and confirms an AI-generated task draft
- **THEN** the standard task mutation applies authorization, validation, idempotency, audit, pending, success, and failure behavior independently of the model response

### Requirement: Honest provenance in AI-assisted workflows

Operational pages MUST label whether AI context came from live, stale, simulated, user-provided, or curated data and SHALL disable context-dependent assistance when required authoritative data is unavailable.

#### Scenario: Demo monitoring data is active

- **WHEN** AI assistance is used while a workflow displays simulated measurements
- **THEN** the request and answer are visibly marked as demonstration analysis and cannot be mistaken for a live equipment diagnosis

### Requirement: AI-assisted form workflows

Selected onboarding, crop, report, alert, integration, and support forms SHALL support field explanations and reviewable suggestions only when their schemas, permissions, and authoritative context are available.

#### Scenario: User applies selected form suggestions

- **WHEN** the user independently accepts one or more valid suggested fields
- **THEN** the normal form validation and submission lifecycle receives those values and all unaccepted input remains unchanged

### Requirement: Personalized operational recommendations

Operational views SHALL rank or tailor AI recommendations using only disclosed authorized signals and MUST preserve direct access to unpersonalized source data and deterministic controls.

#### Scenario: Recommendation order is personalized

- **WHEN** role, garden, crop stage, preference, or recent event changes the ranking
- **THEN** the view explains the material factor and permits the user to view a neutral ordering

### Requirement: Proactive insight workflow

The dashboard SHALL present deduplicated proactive insights in a scannable queue with evidence, freshness, urgency, uncertainty, feedback, mute, dismiss, and revisit controls.

#### Scenario: User dismisses or mutes an insight

- **WHEN** the user dismisses one insight or mutes its approved trigger category
- **THEN** the preference is applied without hiding authoritative alerts or safety-critical product states

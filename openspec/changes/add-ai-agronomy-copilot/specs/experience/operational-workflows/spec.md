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

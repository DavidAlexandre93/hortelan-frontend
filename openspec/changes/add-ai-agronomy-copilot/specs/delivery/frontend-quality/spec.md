## ADDED Requirements

### Requirement: Deterministic AI contract gate

The quality gate MUST validate AI DTO parsing, stream reconstruction, cancellation, idempotent retry, citation mapping, authorization context, redaction, error mapping, quota handling, and draft-action confirmation against deterministic provider and gateway fakes without requiring public model access in CI.

#### Scenario: AI contract changes

- **WHEN** a request, stream event, response, citation, usage, feedback, history, or error contract is modified
- **THEN** focused contract and integration tests fail until all supported variants and malformed payload paths are covered

### Requirement: AI safety and quality evaluation gate

The release process SHALL run a versioned representative evaluation set for agronomic correctness, groundedness, citation validity, uncertainty, refusal behavior, prompt injection resistance, tenant isolation, harmful advice, Portuguese clarity, latency, token usage, and cost, and MUST block rollout when an approved critical threshold regresses.

#### Scenario: Prompt, model, retrieval, or policy changes

- **WHEN** a release changes an AI prompt, model route, reasoning setting, tool schema, knowledge corpus, retrieval strategy, or safety policy
- **THEN** the same versioned evaluation set compares the candidate with the approved baseline and records the quality, safety, latency, and cost result

#### Scenario: Critical safety case fails

- **WHEN** an evaluation permits cross-tenant disclosure, fabricated chemical dosage, unsupported autonomous action, missing required escalation, or execution of injected instructions
- **THEN** the AI rollout gate fails regardless of aggregate score

### Requirement: AI interface regression gate

Representative assistant and contextual-help journeys MUST pass component, accessibility, responsive, visual, and browser tests for successful streaming, cancellation, citations, action drafts, consent, deletion, offline, quota, refusal, malformed output, and provider outage states.

#### Scenario: Candidate AI interface is validated

- **WHEN** browser tests run at supported 320, 768, and 1440 pixel viewport widths
- **THEN** the assistant remains usable without blank states, overlapping controls, inaccessible focus, unintended page scroll, lost input, or false success messages

### Requirement: AI performance and bundle budgets

The delivery flow SHALL enforce approved budgets for assistant lazy-chunk transfer, startup isolation, first response indication, completed response latency by task class, context size, and token or cost usage, and MUST keep non-AI route startup independent of provider availability.

#### Scenario: AI dependencies affect the production build

- **WHEN** assistant UI, provider contracts, or evaluation dependencies change
- **THEN** bundle analysis verifies that server-only provider SDKs are absent from client assets and that the assistant remains outside the initial dashboard entry budget

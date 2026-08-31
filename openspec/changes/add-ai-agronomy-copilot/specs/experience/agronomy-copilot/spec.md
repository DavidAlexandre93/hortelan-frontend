## Purpose

Defines trustworthy conversational and contextual agronomy assistance that helps authenticated growers understand their operation without presenting model output as verified fact or executing high-impact actions autonomously.

## ADDED Requirements

### Requirement: Authenticated agronomy assistant access

The product SHALL provide the agronomy assistant to authenticated dashboard users and MUST keep conversations and operational context within the active tenant and user authorization boundary.

#### Scenario: User opens the assistant from the dashboard

- **WHEN** an authenticated user invokes the assistant from any supported dashboard route
- **THEN** the conversation opens without leaving the current workflow and identifies the active context that can be used

#### Scenario: Anonymous visitor requests the assistant

- **WHEN** an unauthenticated user reaches a public or authentication route
- **THEN** no private assistant conversation or operational context is exposed

### Requirement: Domain-focused conversational help

The assistant SHALL answer in Brazilian Portuguese by default and MUST focus on Hortelan workflows, agriculture, crops, garden management, sensors, irrigation, climate, and closely related topics.

#### Scenario: User asks an in-scope question

- **WHEN** a user asks about a Hortelan feature or an agriculture topic within the supported knowledge boundary
- **THEN** the assistant gives a direct, actionable answer using language appropriate to a grower or operator

#### Scenario: User asks an unrelated question

- **WHEN** a request is unrelated to the product or supported agriculture domains
- **THEN** the assistant briefly states its scope and offers relevant Hortelan or agriculture help without inventing an answer

### Requirement: Grounded and attributable answers

Material agronomic claims and operational interpretations MUST be grounded in approved sources or authorized Hortelan data, and the assistant SHALL distinguish sourced facts, current operational measurements, model inference, and missing evidence.

#### Scenario: Answer uses agronomy knowledge

- **WHEN** an answer relies on curated agronomy content
- **THEN** the answer includes human-readable citations with source title, origin, publication or revision date when available, and a route or link to inspect the evidence

#### Scenario: Answer uses operational data

- **WHEN** an answer interprets sensors, alerts, crops, reports, weather, or tasks
- **THEN** the answer identifies the data scope and freshness and does not imply that stale, simulated, or unavailable data is live

#### Scenario: Evidence is insufficient

- **WHEN** approved sources and authorized data do not support a reliable answer
- **THEN** the assistant communicates uncertainty, names the missing evidence, and proposes a safe way to obtain it instead of fabricating certainty

### Requirement: Contextual operational assistance

Supported workflows SHALL let users request explanations, summaries, comparisons, and draft next steps from the currently selected resources while preserving the same access controls as the underlying feature.

#### Scenario: User asks why an alert occurred

- **WHEN** the user invokes AI assistance for a selected alert
- **THEN** the response relates available measurements, thresholds, crop context, and evidence to the alert and clearly labels any inference

#### Scenario: User requests a report summary

- **WHEN** the user requests a narrative for an authorized report period
- **THEN** the assistant highlights material trends, anomalies, and follow-up questions without altering the source report

### Requirement: Responsible multimodal crop assistance

The assistant SHALL accept only supported image formats and sizes with explicit upload consent, and MUST present image-based crop analysis as a bounded hypothesis rather than a definitive diagnosis.

#### Scenario: User submits a crop image

- **WHEN** the user consents to submit a supported image with relevant crop context
- **THEN** the assistant returns observable signs, plausible causes, confidence or uncertainty, supporting sources, safe verification steps, and conditions that require qualified agronomic review

#### Scenario: Image cannot support a diagnosis

- **WHEN** an image is unclear, unsupported, unsafe, or lacks necessary context
- **THEN** the assistant does not claim a diagnosis and requests only the additional evidence needed for a safer assessment

### Requirement: Human-controlled action proposals

The assistant MAY propose structured drafts for low-risk follow-up work, but it MUST NOT execute mutations, actuator commands, purchases, chemical applications, or other consequential actions without an explicit review and confirmation flow outside the generated response.

#### Scenario: Assistant proposes a task

- **WHEN** a recommendation can be converted into a platform task
- **THEN** the interface presents an editable draft with source context, affected resource, expected consequence, and a separate confirmation command

#### Scenario: User asks for autonomous irrigation or treatment

- **WHEN** the user asks the assistant to directly change irrigation, apply a chemical, or perform another high-impact action
- **THEN** the assistant refuses autonomous execution and provides a safe review path that requires authorized human confirmation

### Requirement: Agricultural safety boundaries

The assistant MUST apply a documented safety policy to chemical handling, dosage, toxicity, food safety, environmental risk, plant disease, and other high-consequence guidance, and SHALL recommend qualified local support when evidence, jurisdiction, or risk exceeds the approved boundary.

#### Scenario: Question involves pesticide or fertilizer dosage

- **WHEN** a user requests a precise chemical recommendation or dosage
- **THEN** the assistant requires product label, crop, jurisdiction, and qualified review context, cites authoritative evidence when available, and does not invent a dose

#### Scenario: Guidance may affect people, animals, or the environment

- **WHEN** a proposed response presents a material health, food, animal, or environmental risk
- **THEN** the assistant gives a conservative warning, avoids unsupported instructions, and identifies the appropriate professional or emergency path

### Requirement: Transparent response lifecycle

The conversation experience SHALL support progressive response delivery, stop, retry, copy, feedback, and new-conversation controls and MUST expose honest pending, completed, interrupted, offline, rate-limited, policy-refused, and provider-unavailable states.

#### Scenario: Response streams successfully

- **WHEN** the assistant begins returning an answer
- **THEN** the interface progressively renders stable content, permits cancellation, and marks the answer complete only after its citations and safety metadata are available

#### Scenario: Response fails after partial output

- **WHEN** connectivity or provider execution fails during a response
- **THEN** partial content is marked incomplete, no draft action is enabled from it, and the user receives a safe retry path with an incident identifier when available

### Requirement: Conversation ownership and feedback

Users SHALL be able to inspect, start, rename, export, and delete their permitted conversations, and the product MUST explain retention and the effect of feedback before collecting it.

#### Scenario: User deletes a conversation

- **WHEN** an authorized user confirms deletion of a conversation
- **THEN** the conversation becomes unavailable to that user and deletion is propagated according to the disclosed retention policy

#### Scenario: User rates an answer

- **WHEN** the user submits positive or negative feedback
- **THEN** the interface records the rating and optional sanitized comment without changing the operational source data or silently opting the content into model training

### Requirement: Natural-language discovery

The product SHALL let authenticated users search approved Hortelan and agronomy knowledge in natural language and MUST return grounded results that distinguish direct matches, semantic matches, suggested destinations, and unavailable evidence.

#### Scenario: User searches by operational intent

- **WHEN** a user describes a goal, symptom, resource, or workflow without knowing its exact product label
- **THEN** the experience returns relevant authorized pages, records, help content, and agronomy sources with reasons for each match

#### Scenario: Semantic search has weak evidence

- **WHEN** no result meets the approved relevance threshold
- **THEN** the experience reports that no reliable match was found and offers bounded query refinement instead of presenting low-confidence content as fact

### Requirement: Reviewable intelligent form assistance

Supported forms SHALL let users request field explanations and context-based value suggestions, and the assistant MUST present every proposed change as an editable diff without overwriting input or submitting the form automatically.

#### Scenario: User requests help completing a form

- **WHEN** the current form and authorized operational context support a suggestion
- **THEN** the assistant identifies proposed field values, reasons, evidence, unchanged fields, and validation constraints before the user accepts any value

#### Scenario: Suggested value conflicts with validation

- **WHEN** a generated suggestion violates the form schema, business rules, permissions, or freshness requirements
- **THEN** the suggestion is rejected and no form field or mutation is changed

### Requirement: Explainable personalization

Personalized recommendations SHALL use only disclosed and user-controlled profile, role, garden, crop, preference, and behavior signals, and MUST explain the material factors that caused a recommendation to appear.

#### Scenario: Personalized recommendation is displayed

- **WHEN** the system adapts a recommendation or result to the current user
- **THEN** the interface identifies the relevant garden, crop stage, preference, or recent event and provides a path to adjust or disable that signal

#### Scenario: Personalization is disabled

- **WHEN** the user opts out of optional AI personalization
- **THEN** the product stops using optional behavior signals and continues with non-personalized grounded assistance

### Requirement: User-controlled proactive insights

The product SHALL surface bounded, explainable insights for material authorized changes such as sensor anomalies, crop-stage transitions, recurring alerts, and report trends, and MUST let users dismiss, mute, revisit, and give feedback on them.

#### Scenario: A material insight is available

- **WHEN** current evidence meets the configured relevance, freshness, and safety thresholds
- **THEN** the user receives a concise insight with evidence, reason, urgency, uncertainty, and a safe next step

#### Scenario: Insight evidence becomes stale

- **WHEN** the source data expires or changes materially before the user acts
- **THEN** the insight is marked stale or withdrawn and cannot produce a confirmed action without fresh analysis

### Requirement: Natural-language workflow planning

The assistant SHALL translate supported natural-language requests into inspectable navigation, filter, query, form, report, note, or task drafts and MUST require the normal product review and authorization flow before any mutation.

#### Scenario: User describes a supported workflow goal

- **WHEN** the request can be represented by an approved structured plan
- **THEN** the interface shows the interpreted intent, target resources, proposed parameters, evidence, and next confirmation step

#### Scenario: Request is ambiguous or unsupported

- **WHEN** multiple consequential interpretations exist or no approved plan matches
- **THEN** the assistant asks a focused clarification or states the unsupported boundary without executing an action

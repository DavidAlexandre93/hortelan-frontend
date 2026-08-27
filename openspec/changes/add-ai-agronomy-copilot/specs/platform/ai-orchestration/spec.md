## Purpose

Defines the provider-neutral server boundary that securely grounds, validates, observes, and controls AI generation for Hortelan without exposing privileged model access or tenant data to the browser or another tenant.

## ADDED Requirements

### Requirement: Authenticated provider-neutral gateway

All production AI requests MUST pass through an authenticated server-side gateway that enforces tenant authorization and exposes provider-neutral request, stream-event, response, citation, usage, feedback, and error contracts.

#### Scenario: Browser starts an AI request

- **WHEN** an authenticated client submits a valid assistant request
- **THEN** the gateway authorizes the tenant and resource context before invoking a configured provider and returns only the provider-neutral contract

#### Scenario: Client attempts to select privileged provider settings

- **WHEN** a browser request supplies a credential, unrestricted model identifier, hidden instruction, or policy override
- **THEN** the gateway rejects or ignores the privileged field and records a sanitized security event

### Requirement: Server-only provider credentials

OpenAI, Gemini, retrieval, and observability credentials MUST remain in protected server configuration and SHALL never be returned by an API, embedded in a production asset, or persisted in browser storage.

#### Scenario: Production assets and browser state are inspected

- **WHEN** the deployed assets, network payloads, local storage, and session storage are scanned
- **THEN** no privileged AI provider credential or hidden provider instruction is present

### Requirement: Configurable model routing and bounded fallback

The gateway SHALL select an approved provider, model, reasoning level, and output budget from server-side policy based on task type, risk, modality, latency, and cost, and MUST use only explicitly compatible fallback routes.

#### Scenario: Primary provider is healthy

- **WHEN** an approved provider can execute the requested task within policy
- **THEN** the gateway uses the configured route and reports a provider-neutral completion with measured usage

#### Scenario: Primary provider fails before producing output

- **WHEN** the selected provider has a retryable failure and an approved fallback supports the same contract and safety policy
- **THEN** the gateway may attempt the fallback once within the original deadline and marks the route change in protected telemetry

#### Scenario: Failure occurs after partial output or a side effect

- **WHEN** a provider fails after user-visible output begins or after a tool has created a side effect
- **THEN** the gateway does not silently invoke another provider and returns an incomplete response that can be safely reviewed or retried

### Requirement: Schema-validated generation

Machine-consumed AI outputs and tool arguments MUST be generated against versioned schemas and validated before they can affect the interface or any downstream operation.

#### Scenario: Provider returns a valid structured result

- **WHEN** a recommendation, citation set, diagnosis hypothesis, or action draft matches the requested schema and policy
- **THEN** the gateway maps it to the versioned provider-neutral DTO and returns it to the caller

#### Scenario: Provider returns malformed or policy-invalid data

- **WHEN** generated output fails schema, citation, authorization, or safety validation
- **THEN** the gateway discards the unsafe structure, records a sanitized failure, and returns a typed recoverable error without executing a tool

### Requirement: Tenant-isolated grounded retrieval

Retrieval MUST combine only approved public knowledge and resources authorized for the active tenant, and SHALL return provenance, revision or freshness metadata, and stable source identifiers for every item used as evidence.

#### Scenario: Retrieval uses tenant operational data

- **WHEN** a prompt requires sensor, crop, alert, report, task, or profile context
- **THEN** retrieval applies the same tenant and resource authorization as the source API and excludes data outside the user's permitted scope

#### Scenario: Retrieved content contains instructions

- **WHEN** a document, user note, community post, image text, or external payload attempts to override system policy or request secrets
- **THEN** the content is treated as untrusted evidence, its instructions are not executed, and suspicious retrieval is included in protected diagnostics

### Requirement: Allowlisted tool execution

AI tools MUST be server-defined, narrowly scoped, schema-validated, authorized per call, and read-only by default; any mutating tool SHALL require a user-confirmed intent token that is bound to the user, tenant, resource, proposed payload, and expiry.

#### Scenario: Model requests an allowed read tool

- **WHEN** the model supplies valid arguments for an approved read-only tool
- **THEN** the gateway authorizes and executes the call within its timeout and returns a minimized result to the model

#### Scenario: Model requests an unapproved or unconfirmed mutation

- **WHEN** the model requests a tool outside the allowlist or a mutation without a valid confirmation token
- **THEN** the gateway refuses execution regardless of model confidence or prompt content

### Requirement: Safety and moderation pipeline

The gateway MUST apply input, retrieval, tool, and output policy checks appropriate to agricultural risk and abuse, and SHALL return typed refusals or escalation guidance without exposing hidden policy text.

#### Scenario: Request violates an AI safety boundary

- **WHEN** content is disallowed, attempts policy bypass, or would produce unsupported high-consequence guidance
- **THEN** the gateway prevents unsafe completion or tool execution and returns a safe user-facing refusal category

### Requirement: Idempotent conversation processing

Message submission, feedback, deletion, and confirmed action creation MUST accept stable client operation identifiers and SHALL deduplicate retried requests within a documented window.

#### Scenario: Client retries a message after losing the response

- **WHEN** the same authorized message operation is received again with the same identifier and payload
- **THEN** the gateway returns the existing operation state or result without generating and billing a duplicate completion

#### Scenario: Identifier is reused with a different payload

- **WHEN** an operation identifier is replayed with materially different content or context
- **THEN** the gateway rejects the conflict and performs no provider call or side effect

### Requirement: Quotas and cost controls

The gateway SHALL enforce per-user and per-tenant request, token, image, concurrency, and budget limits and MUST expose safe usage and reset information without revealing provider credentials or internal pricing contracts.

#### Scenario: User approaches an AI quota

- **WHEN** remaining quota crosses a configured warning threshold
- **THEN** the client receives a typed warning with the applicable reset or plan path before a new request is submitted

#### Scenario: Budget is exhausted

- **WHEN** an account or deployment reaches an enforced AI budget
- **THEN** the gateway rejects new generation with a typed limit response while non-AI product workflows remain available

### Requirement: Privacy-safe AI observability

The platform SHALL correlate each AI operation with request, trace, conversation, prompt-version, policy-version, provider-route, retrieval-source, latency, token, cost-estimate, cache, result, and failure metadata, and MUST exclude raw prompts, raw responses, images, credentials, and direct personal identifiers from routine logs and traces.

#### Scenario: AI operation completes

- **WHEN** a provider request succeeds, fails, is cancelled, or is refused
- **THEN** protected telemetry contains enough allowlisted metadata to diagnose quality, reliability, and cost without reproducing user content

### Requirement: Governed content retention and deletion

Conversation text, attachments, provider identifiers, retrieved context, feedback, and audit records MUST follow documented purpose, encryption, region, access, retention, export, and deletion policies, and provider storage SHALL be disabled or bounded when the approved operating mode requires it.

#### Scenario: Retention is disabled for conversation content

- **WHEN** an environment or tenant policy selects non-retained conversations
- **THEN** content is not made available as history and only the minimum privacy-safe operational metadata is retained

#### Scenario: User deletion reaches an external processor

- **WHEN** deletable content was retained by an approved external processor
- **THEN** deletion is propagated or the disclosed immutable retention exception is applied and auditable

### Requirement: Honest service readiness

AI features MUST remain disabled until gateway health, at least one approved provider route, policy versions, quotas, and the required knowledge sources are ready, and a provider outage SHALL NOT block non-AI product workflows.

#### Scenario: Deployment lacks AI configuration

- **WHEN** no production-ready provider route or policy is configured
- **THEN** capability discovery reports AI as unavailable and the frontend renders an honest disabled state instead of sample answers

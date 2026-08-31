## Context

See `proposal.md` for motivation and scope. The current frontend is a React 19/Vite 7 application with a route manifest, authenticated dashboard shell, route-level lazy loading, selective SSR, feature services, Zod response validation, and local rule-based recommendations. `Hortelan360Page` is a static product blueprint rather than an AI experience, and no model provider SDK or AI gateway contract exists.

Production model access cannot be implemented safely in the browser. The sibling `hortelan-backend` repository is the selected server boundary: it already uses FastAPI, Pydantic contracts, OpenAPI 3.1, hexagonal ports and adapters, persistent idempotency, JSON diagnostics, and OpenTelemetry. A companion backend OpenSpec change will own the AI gateway implementation while this frontend change owns the user experience, provider-neutral browser DTOs, context selection, accessibility, and browser tests. The active `modernize-observability-contracts-ui` change owns the general frontend diagnostics and OpenTelemetry foundation; this change extends that contract with AI-specific attributes instead of adding another logger.

The design follows the official guidance available on 2026-08-27: OpenAI recommends the Responses API for new agentic and multi-turn integrations, and both OpenAI and Gemini support streaming, structured outputs, image inputs, and function calling. Provider features remain implementation capabilities, not permission to execute unreviewed agricultural actions.

## Goals / Non-Goals

**Goals:**

- Deliver one coherent agronomy copilot across the authenticated product, with route-aware entry points and a dedicated Hortelan 360 conversation workspace.
- Provide semantic discovery, natural-language workflow planning, intelligent form drafts, explainable personalization, and bounded proactive insights through the same governed AI platform.
- Make answers useful and inspectable through approved retrieval, citations, freshness, uncertainty, and draft next actions.
- Keep provider selection, credentials, prompts, policies, tools, retention, and budgets on the server behind replaceable adapters.
- Support text, operational context, and crop images while treating high-consequence advice conservatively.
- Make quality, safety, latency, and cost measurable through deterministic tests and versioned evaluations.

**Non-Goals:**

- Linking the web product to a user's consumer ChatGPT session or Gemini web account.
- Training or fine-tuning a provider model on customer conversations in the first release.
- Giving a model direct database access, unrestricted web access, arbitrary code execution, or actuator control.
- Building an autonomous agronomist, guaranteeing diagnoses, or replacing product labels, local regulation, or qualified professional review.
- Adding voice, autonomous background agents that execute actions, multi-agent orchestration, community-content ingestion, or encrypted offline chat in the first release. Bounded read-only insight refresh is included; autonomous execution is not.

## Decisions

### 1. Use a backend AI gateway with ports and provider adapters

**Satisfies:** `platform/ai-orchestration`, `platform/browser-security`, `architecture/frontend-app-shell`.

The browser calls the FastAPI Hortelan AI gateway under the existing authenticated API origin. The gateway owns authorization, tenant context, policy, retrieval, model routing, provider credentials, structured validation, tools, quotas, idempotency, and telemetry. A small Python provider port normalizes streaming and non-streaming execution:

```text
React feature service
  -> authenticated Hortelan AI API
    -> policy + context + retrieval + quota pipeline
      -> AiProvider port
        -> OpenAI Responses adapter
        -> Google Gemini adapter
```

The OpenAI adapter uses the official Python SDK and Responses API. The Gemini adapter uses the official Google Gen AI Python SDK and an API surface that supports the required structured and streaming contract. Provider packages are backend-only and must not enter the Vite dependency graph. The backend change follows its existing domain port, application use-case, infrastructure adapter, API contract, and composition boundaries.

**Alternatives considered:** Direct browser provider calls expose keys and bypass tenant policy. Calling a single provider directly from feature services creates lock-in and duplicated error behavior. A general agent framework is deferred because two narrow adapters and an explicit pipeline are easier to audit and test.

### 2. Keep model names and routing policy server-configured and evaluation-gated

**Satisfies:** `platform/ai-orchestration`, `architecture/sdd-governance`, `delivery/frontend-quality`.

Tasks map to policy profiles such as `fast-text`, `grounded-analysis`, `vision-diagnosis`, and `high-risk-review`. Each profile selects an allowlisted provider model, reasoning level, output budget, timeout, and compatible fallback. Production may evaluate the current GPT-5.6 family and current Gemini models, but no browser contract or prompt hardcodes a model identifier. A stable snapshot is preferred after evaluation when reproducibility matters; aliases may be used only with continuous regression monitoring.

Fallback is allowed once only when no user-visible output or side effect exists and the fallback passes the same schema and safety contract. Mid-stream failures are returned as incomplete. Provider diversity improves resilience but is not treated as automatic quality improvement.

**Alternatives considered:** Always use the most capable model maximizes cost and latency without evidence. Cheapest-model-only routing weakens complex diagnosis. Simultaneously querying both providers doubles cost and data disclosure, so it is reserved for offline evaluations rather than user requests.

### 3. Define a provider-neutral, versioned streaming API

**Satisfies:** `experience/agronomy-copilot`, `platform/ai-orchestration`, `delivery/frontend-quality`.

The initial backend surface is:

- `GET /ai/capabilities`: readiness, supported modalities, limits, consent and retention summary.
- `POST /ai/conversations` and `GET /ai/conversations`: create and list authorized conversation summaries.
- `GET /ai/conversations/{id}` and `DELETE /ai/conversations/{id}`: load or delete authorized history.
- `POST /ai/conversations/{id}/messages`: submit text, selected context, attachment references, and `clientMessageId`; return a `text/event-stream` response consumed with `fetch`.
- `POST /ai/messages/{id}/feedback`: submit idempotent rating and optional sanitized comment.
- Existing domain mutation APIs remain authoritative for confirmed task or note creation; the AI API returns drafts and short-lived confirmation intents, not completed mutations.

Versioned stream events include `ack`, `status`, `text_delta`, `citation`, `action_draft`, `usage`, `completed`, `refused`, and `error`. Every event has an operation ID and sequence number. Zod validates requests, every parsed event, final assembled messages, citations, usage, drafts, and errors. Unknown optional fields are forward-compatible; unknown event kinds or invalid required fields fail closed.

**Alternatives considered:** WebSocket adds connection lifecycle complexity not required for turn-based chat. `EventSource` cannot naturally submit the authenticated POST body. A streamed `fetch` response preserves POST semantics and supports cancellation with `AbortController`.

### 4. Ground answers before generation and preserve provenance

**Satisfies:** `experience/agronomy-copilot`, `experience/operational-workflows`, `platform/ai-orchestration`.

The orchestration pipeline retrieves from two explicit classes:

1. Curated knowledge: approved Hortelan help, product documentation, species guidance, and reviewed agronomy sources, chunked with stable source ID, title, authority, locale, revision, validity region, and URL or internal route.
2. Operational context: read-only, authorization-filtered DTOs from existing sensor, alert, crop, report, weather, and task services with timestamps and demo/live provenance.

Retrieval results are filtered by tenant and resource authorization before the model sees them. The model receives compact evidence identifiers and must return citations against those identifiers. The gateway rejects nonexistent citations and keeps uncited inference visibly separate. User text, community posts, OCR, retrieved pages, and attachment metadata are delimited as untrusted content and cannot redefine policy or tools.

Version one does not enable arbitrary model web search. New public sources enter through an ingestion review with ownership, license, revision, jurisdiction, and expiry metadata.

**Alternatives considered:** Free-form web search is current but difficult to govern for agricultural safety and provenance. Sending full database records increases leakage and token cost. Client-side retrieval cannot enforce tenant boundaries reliably.

### 5. Build one assistant experience with contextual launch points

**Satisfies:** `architecture/frontend-app-shell`, `experience/agronomy-copilot`, `experience/accessible-responsive-ui`, `experience/operational-workflows`.

The dashboard shell owns a lazy assistant launcher and conversation surface. Desktop uses a bounded right-side panel that leaves the active workflow inspectable; compact viewports use a full-height dialog or drawer that respects safe areas and the virtual keyboard. Hortelan 360 evolves into the full conversation and intelligence workspace rather than duplicating a separate chatbot implementation.

A route-context registry maps the shared route manifest to allowlisted context builders. Monitoring, alerts, species, reports, help, and Hortelan 360 can contribute explicit resource IDs and display a preview such as "Usar Alerta 123 e as ultimas 24 h de sensores" before submission. Raw component state and DOM scraping are prohibited.

Messages display source chips or links, data freshness, inference and uncertainty labels, and any action draft. The composer supports attachment preview, stop, retry, and preserved unsent text. Assistant failure never replaces the route's normal operational state.

**Alternatives considered:** A separate chatbot page hides help from the workflow where it is needed. Independent chat widgets per page duplicate state and accessibility behavior. An always-open panel consumes workspace and increases startup cost.

### 6. Separate model suggestions from authorized actions

**Satisfies:** `experience/agronomy-copilot`, `experience/operational-workflows`, `platform/ai-orchestration`.

Tools are registered server-side with JSON schemas, least-privilege authorization, timeouts, result minimization, and read-only defaults. Generated writes are drafts. To continue, the frontend presents editable fields, evidence, target, consequence, and a standard confirmation command. The server issues a short-lived intent bound to the exact user, tenant, resource, payload hash, and operation ID. The existing domain service then revalidates authorization and business rules and owns the idempotent mutation.

Actuator operations, purchases, chemical application, dosage, account changes, and destructive operations are not AI tools in the first release.

**Alternatives considered:** Model-triggered writes feel faster but make prompt injection, hallucination, and retry failures consequential. A blanket ban on drafts would discard useful low-risk assistance such as task preparation.

### 7. Apply layered safety, privacy, and retention controls

**Satisfies:** `experience/agronomy-copilot`, `platform/ai-orchestration`, `platform/browser-security`.

The request pipeline performs input size and type checks, PII and secret minimization, moderation, injection classification, authorization-filtered context assembly, task risk classification, provider execution, schema validation, citation validation, output policy checks, and final rendering labels. System policy and tool descriptions are versioned separately from untrusted content. Provider safety identifiers are privacy-preserving and never use email or a direct user ID.

The first-use consent explains processor categories, purpose, context, retention, feedback, and deletion. Image upload requires per-submission confirmation. Raw prompt, response, image, and retrieved content are absent from routine logs. Conversation content is encrypted at rest when retained; access is tenant-scoped and audited. Provider-side storage is disabled where the selected approved mode supports it, or documented with a bounded retention exception.

Agricultural safety policy distinguishes informational, operational, and high-consequence requests. Chemical dosage, toxicity, food safety, disease treatment, and environmental risk require authoritative evidence and escalation rules. The assistant never presents an image hypothesis as a laboratory diagnosis.

**Alternatives considered:** Prompt-only safety is insufficient because provider output and tool arguments remain untrusted. Logging full conversations aids debugging but creates unnecessary privacy and breach impact. A single global consent cannot adequately explain optional image sharing.

### 8. Correlate quality, reliability, and cost without logging content

**Satisfies:** `platform/ai-orchestration`, `delivery/frontend-quality` and the active observability change.

Every operation receives a logical request ID and trace. Allowlisted AI spans and JSON events include task profile, prompt/policy/schema versions, provider route, model class or protected identifier, fallback reason, retrieval source IDs, source count, context tokens, cached tokens, output tokens, estimated cost, time to first event, total latency, status, refusal category, tool names, and incident ID. User text, generated text, images, full URLs with query values, and direct identifiers are excluded.

Dashboards track availability, p50/p95 latency, incomplete streams, refusals, fallback, citation failures, retrieval misses, quota rejections, token and cost budgets, feedback, and evaluation scores. Sampling never drops security, cross-tenant, unsafe-action, deletion, or billing-conflict events.

**Alternatives considered:** Provider dashboards alone cannot correlate application context or fallback. Full-content observability conflicts with privacy and is unnecessary when deterministic replay fixtures and opt-in protected support capture exist.

### 9. Use deterministic tests plus versioned offline and controlled online evaluations

**Satisfies:** `delivery/frontend-quality`, `architecture/sdd-governance`.

CI uses fake provider adapters and MSW fixtures; it never requires a public model key. Pure modules target complete branch coverage for redaction, policy classification, context allowlists, routing, idempotency, stream parsing, schema validation, citation mapping, and quota decisions. Component and Playwright tests cover the complete user-state matrix and viewports.

An AI evaluation dataset contains reviewed pt-BR examples for product help, species care, sensor anomalies, stale and demo data, ambiguous images, citation requirements, prompt injection, cross-tenant requests, unsupported dosage, dangerous actions, refusals, and escalation. Automated graders are supplemented by deterministic assertions and periodic review by a qualified agronomy owner. Critical safety cases are pass/fail regardless of average score.

Candidate prompts, policies, retrieval changes, and model routes are compared with the approved baseline for task success, groundedness, citation correctness, harmful advice, refusal precision, latency, tokens, and cost. Controlled online canaries use non-sensitive synthetic or approved data and explicit budgets before production rollout.

**Alternatives considered:** Snapshotting generated prose is brittle. Model-only grading can share the same blind spots as generation. Live provider calls in every CI run are nondeterministic, slow, costly, and leak credentials into a wider execution surface.

### 10. Unify semantic search and natural-language workflow planning

**Satisfies:** `experience/agronomy-copilot`, `platform/ai-orchestration`, `architecture/frontend-app-shell`.

One lazy command surface accepts deterministic navigation queries, semantic discovery, and supported workflow requests. The gateway first performs low-cost intent classification, then routes to direct navigation, hybrid retrieval, or structured workflow planning. Hybrid retrieval combines lexical, vector, authority, tenant, metadata, and freshness signals; generated summaries cannot replace the result list or its sources.

Plans are limited to versioned intents such as navigation, filtering, report configuration, form suggestion, task draft, and note draft. The frontend always shows the interpreted intent and parameters before a consequential step.

**Alternatives considered:** Replacing all navigation with a chatbot harms predictability and accessibility. Vector-only search weakens exact identifiers and uncommon agricultural terms. Free-form agents cannot provide reliable permission and action boundaries.

### 11. Treat form assistance as a schema-validated diff

**Satisfies:** `experience/agronomy-copilot`, `experience/operational-workflows`, `experience/accessible-responsive-ui`.

Eligible forms publish a minimized assistance descriptor containing field purpose, type, allowed values, validation rules, current non-secret values, and accepted context categories. The gateway returns a field-keyed suggestion diff with reason and evidence. The frontend validates the diff with the same form schema, lets users accept fields independently, and never submits automatically.

Passwords, MFA, payment credentials, private integration secrets, destructive confirmations, and hidden anti-abuse fields are never eligible for AI completion.

**Alternatives considered:** Generating an entire form payload can overwrite user work and hide errors. DOM inspection leaks unrelated state. Field-by-field diffs preserve user control and fit existing React Hook Form boundaries.

### 12. Personalize with minimized, explainable features

**Satisfies:** `experience/agronomy-copilot`, `platform/ai-orchestration`, `platform/browser-security`.

Personalization uses a small server-governed feature set such as role, selected garden, crop species and stage, region, explicit preferences, active risk state, and recent authorized events. Every feature has purpose, sensitivity, freshness, consent category, and neutral fallback. Raw clickstreams and full browsing history are excluded. Recommendations carry explanation reason codes that the frontend translates into concise pt-BR copy and links to settings.

**Alternatives considered:** Opaque behavioral profiling is difficult to govern and explain. Client-only personalization fragments ranking logic. No personalization misses obvious value from crop stage and selected garden.

### 13. Generate proactive insights from bounded triggers

**Satisfies:** `experience/agronomy-copilot`, `experience/operational-workflows`, `platform/ai-orchestration`.

Approved trigger evaluators identify a material event before generation: anomaly, repeated alert, crop-stage transition, report trend, or knowledge update relevant to the active operation. The gateway deduplicates by evidence and recommendation, applies freshness, quota, urgency, quiet hours, and user mute preferences, then generates a concise evidence-backed insight. Insights never replace authoritative alerts and expire when evidence changes.

**Alternatives considered:** Continuous agent polling creates unbounded cost and noisy suggestions. Generating every dashboard card on demand weakens consistency. Trigger-first generation keeps volume and purpose measurable.

### 14. Keep visual transformation in a dependent change

**Satisfies:** `architecture/sdd-governance`, `delivery/frontend-quality`.

The companion `redesign-ai-native-product-experience` change owns the shared visual system and complete page redesign. This AI change owns behavior, contracts, and AI-specific surfaces. The redesign depends on the stable AI state model and reuses it; neither change duplicates assistant, semantic search, insight, or form-assistance logic.

**Alternatives considered:** Combining the full visual rewrite and AI platform into one task graph makes rollback, review, and requirement ownership ambiguous. Independent visual work without AI states would create a bolted-on chatbot experience.

## Risks / Trade-offs

- **Agronomic hallucination or overconfidence** -> Require approved evidence, citation validation, uncertainty labels, conservative high-risk policy, critical evals, and professional escalation.
- **Prompt injection through user or retrieved content** -> Treat all external content as data, isolate system policy, allowlist tools, validate arguments, minimize results, and require bound confirmation for mutations.
- **Cross-tenant disclosure** -> Authorize before retrieval and each tool call, use opaque IDs, add isolation tests, and block rollout on any critical failure.
- **Provider outage or incompatible output** -> Use typed errors, bounded pre-output fallback, schema validation, partial-response labeling, and keep non-AI workflows independent.
- **Cost growth** -> Apply per-profile model routing, token and image limits, prompt compaction, caching where evaluated, quotas, concurrency bounds, budget alarms, and kill switches.
- **Latency from retrieval and safety layers** -> Run independent safe reads concurrently, stream status early, cap evidence, set task-specific deadlines, and measure time to first meaningful event.
- **Privacy or retention mismatch across providers** -> Approve provider modes contractually, minimize submitted content, expose consent and deletion, and disable unsupported routes for restricted tenants.
- **Vendor behavior drift** -> Pin SDK versions and evaluated model snapshots where possible, version every behavior input, run canaries, and preserve provider-neutral contracts.
- **UI complexity and bundle growth** -> Lazy-load one shared assistant feature, keep provider SDKs server-only, reuse shared states, and enforce assistant chunk and responsive layout budgets.
- **Active OpenSpec change overlap** -> Implement the observability and DTO foundation once, reconcile requirement ownership before apply, and update artifacts if the other change lands first.

## Migration Plan

1. Create and approve the companion `hortelan-backend` OpenSpec change, then publish provider-neutral OpenAPI contracts plus versioned AI DTO schemas before frontend integration.
2. Implement the gateway with fake providers, authorization, policy, retrieval, idempotency, quotas, redaction, telemetry, and disabled-by-default feature flags.
3. Approve provider accounts and server-only configuration, then evaluate model routes and snapshots against the committed dataset using synthetic and reviewed content.
4. Build and review the first curated knowledge corpus with source owners, revision metadata, jurisdiction, and expiry rules.
5. Ship frontend capability discovery, consent, conversation service, stream parser, lazy shell surface, and Hortelan 360 workspace behind `VITE_ENABLE_AI_COPILOT=false` by default.
6. Add contextual entry points one workflow at a time: help and species, then reports, monitoring and alerts, and finally image assistance. Keep action output as drafts.
7. Add semantic discovery and deterministic navigation, then structured workflow plans, field-level form assistance, explainable personalization, and trigger-based insights in that order.
8. Apply the dependent visual redesign after the shared AI state, context, and result contracts are stable, and verify that it does not fork behavior.
9. Run the full quality gate, privacy and threat review, agronomy evaluation, browser matrix, load test, provider-failure drills, and cost forecast.
10. Enable internal users, then a small tenant allowlist with quotas and dashboards; expand only when safety, quality, latency, error, and budget thresholds hold.

Rollback uses the frontend and server feature flags to remove launch points and reject new AI generation while preserving normal product workflows. Conversation export and deletion remain available during rollback. Provider credentials can be revoked independently, and the prior prompt, policy, model route, and knowledge index versions remain addressable for operational rollback.

## Open Questions

- Which curated Brazilian agronomy institutions and product-help sources receive first-release approval, ownership, and review cadence?
- What retained and non-retained conversation modes, regions, and deletion periods are required for each customer tier?
- Which quotas and model profiles belong to each subscription tier after the first cost and latency evaluation?
- Which qualified agronomy owner signs off critical safety cases before external rollout?

## References

- OpenAI Responses API guidance: https://developers.openai.com/api/docs/guides/migrate-to-responses
- OpenAI structured outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI agent safety guidance: https://developers.openai.com/api/docs/guides/agent-builder-safety
- OpenAI current model guidance: https://developers.openai.com/api/docs/guides/latest-model
- Google Gemini structured outputs: https://ai.google.dev/gemini-api/docs/structured-output
- Google Gemini function calling: https://ai.google.dev/gemini-api/docs/function-calling

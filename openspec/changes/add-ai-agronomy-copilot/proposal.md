## Why

Hortelan currently presents local recommendations and a static Hortelan 360 blueprint, but growers cannot ask contextual questions, understand operational anomalies, or turn platform data into grounded next steps. A governed agronomy copilot can reduce decision time and support learning while protecting tenant data, controlling model cost, and keeping high-impact agricultural actions under human review.

## What Changes

- Add an authenticated, pt-BR agronomy chatbot available throughout the dashboard with streaming answers, conversation controls, citations, uncertainty disclosure, feedback, and complete loading, empty, offline, rate-limit, and provider-failure states.
- Add contextual AI assistance to monitoring, alerts, species, reports, help, and Hortelan 360 so users can explain sensor anomalies, summarize trends, compare care guidance, analyze supported images, and draft follow-up tasks from the data they are authorized to view.
- Add one natural-language discovery and command surface for semantic search across approved product and agronomy knowledge, navigation to relevant resources, and reviewable workflow drafts.
- Add intelligent form assistance that can explain fields, suggest values from authorized context, and produce an inspectable field-by-field diff without silently submitting or overwriting user input.
- Add explainable personalization and proactive insights based on user-controlled preferences, role, selected garden, crop stage, recent events, and authorized behavior signals, with clear reasons and opt-out controls.
- Add a backend-owned AI gateway with provider adapters for the OpenAI Responses API and Google Gemini API, environment-selected routing, bounded fallback, schema-validated outputs, idempotent requests, quotas, timeouts, and provider-neutral DTOs.
- Add grounded retrieval over curated Hortelan and agronomy knowledge plus authorized operational data, with source provenance, tenant isolation, freshness metadata, and an explicit distinction between sourced facts, model inference, and unavailable evidence.
- Add AI safety and privacy controls for prompt injection, unsafe agricultural guidance, PII and secret minimization, image and conversation consent, retention and deletion, content moderation, human confirmation, and escalation to a qualified agronomist when risk or uncertainty is high.
- Add AI-specific observability and evaluation gates for prompt and policy versions, provider/model selection, latency, token and cost usage, retrieval quality, groundedness, citation correctness, refusals, unsafe advice, accessibility, and responsive browser behavior without recording raw prompts or model responses in routine telemetry.
- Add feature flags and an honest unavailable state so deployments without a configured AI gateway remain functional and do not simulate successful AI behavior.
- Coordinate with the dependent `redesign-ai-native-product-experience` change so AI search, insights, forms, and conversations share the same navigation, visual system, responsive behavior, and interaction language as the rest of the product.
- **Deployment migration required:** production AI features require server-side provider credentials, an authenticated AI gateway, an approved knowledge corpus, retention policy, quotas, and monitoring before the feature flag can be enabled.
- Non-goals: autonomous irrigation or actuator control, unconfirmed chemical or treatment execution, replacement of professional agronomic advice, arbitrary open-web answers without provenance, fine-tuning on customer content, and direct model-provider calls or privileged credentials in the browser.

## Capabilities

### New Capabilities

- `experience/agronomy-copilot`: User-facing conversational, discovery, personalization, form-assistance, and contextual agronomy experiences with grounded answers, multimodal diagnosis support, safe action proposals, history controls, and trustworthy degraded states.
- `platform/ai-orchestration`: Provider-neutral AI gateway behavior for OpenAI and Gemini routing, semantic retrieval, intent planning, personalization, structured generation, tool execution, safety policy, privacy, idempotency, quotas, observability, and resilience.

### Modified Capabilities

- `architecture/frontend-app-shell`: Add lazy, authenticated AI conversation and command surfaces that receive only allowlisted route context and remain isolated from public and SSR-critical paths.
- `experience/accessible-responsive-ui`: Extend responsive and accessibility guarantees to streaming conversations, citations, composer controls, drawers, and reduced-motion behavior.
- `experience/operational-workflows`: Add explain, search, summarize, diagnose, form-draft, personalized-recommendation, proactive-insight, and draft-action assistance while preserving user confirmation and honest data provenance.
- `platform/browser-security`: Extend credential, persistence, consent, personalization, behavior-signal, and external-resource controls to AI provider access and conversation or image data.
- `delivery/frontend-quality`: Add deterministic AI contract tests, semantic relevance, personalization, safety and groundedness evaluations, visual and accessibility checks, and latency, cost, and bundle gates.
- `architecture/sdd-governance`: Treat prompts, policies, tool schemas, retrieval contracts, model routing, and evaluation thresholds as versioned behavior governed by OpenSpec.

## Impact

- Frontend: dashboard shell, command and semantic search, route context, Hortelan 360, monitoring, alerts, species, reports, forms, help, insights, personalization settings, shared asynchronous states, feature services, Zod DTOs, consent and conversation settings, and responsive end-to-end journeys.
- Backend/API dependency: the sibling `hortelan-backend` FastAPI service requires a companion OpenSpec change for authenticated conversation, streaming, feedback, history, deletion, image-analysis, and action-proposal endpoints plus provider adapters, retrieval, policy enforcement, quotas, and audit records. The frontend repository cannot safely provide production model access without this server-side contract.
- Provider dependencies: official server-side OpenAI and Google Gen AI SDKs are evaluated behind adapters; no provider SDK or secret is added to the browser bundle.
- Operations: provider keys, model aliases or snapshots, feature flags, budgets, retention, knowledge ingestion, incident runbooks, OpenTelemetry-compatible metrics and traces, and rollout dashboards.
- Delivery: new deterministic fakes and contract fixtures, adversarial and agronomy evaluation datasets, browser tests at 320/768/1440 widths, security scans, bundle budgets, and staged rollout criteria.
- Coordination: implementation must reconcile with `modernize-observability-contracts-ui` so AI telemetry uses its privacy-safe diagnostics and correlation contracts rather than introducing a second logging path.

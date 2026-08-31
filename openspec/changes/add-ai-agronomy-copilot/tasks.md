## 1. Cross-Repository Contracts and Governance

- [ ] 1.1 Create and approve a companion `hortelan-backend` OpenSpec change for the FastAPI AI gateway, linking its capability contracts and rollout dependencies to this frontend change.
- [ ] 1.2 Resolve the first-release knowledge owners, qualified agronomy reviewer, retention modes, deletion periods, data regions, subscription quotas, and rollout tenants in versioned decision records.
- [ ] 1.3 Complete a data-protection assessment and AI threat model covering provider processing, tenant isolation, prompt injection, tool abuse, unsafe agronomic advice, attachments, retention, deletion, and incident response.
- [ ] 1.4 Publish the backend OpenAPI 3.1 contract for capabilities, conversations, streamed messages, history, deletion, feedback, attachments, citations, usage, refusals, errors, and action drafts.
- [ ] 1.5 Generate representative provider-neutral API fixtures from the published contract and record the contract version consumed by the frontend.
- [ ] 1.6 Version the initial prompt profiles, agricultural safety policy, route-context allowlist, tool schemas, retrieval policy, retention policy, and evaluation thresholds without embedding provider secrets.
- [ ] 1.7 Reconcile AI DTO, diagnostics, trace propagation, and error ownership with `modernize-observability-contracts-ui` and remove any duplicated contract or logging plan.
- [ ] 1.8 Add a requirement-to-task-to-evidence matrix covering every scenario in both new capabilities and all six modified capabilities.
- [ ] 1.9 Add semantic search, form assistance, personalization, proactive insights, and natural-language plans to the governed AI experience catalog with owners, risk classes, context, controls, and evaluation evidence.

## 2. Frontend AI Contracts and Transport

- [ ] 2.1 Add strict Zod schemas and JSDoc DTOs for AI capabilities, conversations, messages, citations, context provenance, attachments, usage, quotas, feedback, refusals, action drafts, and safe errors.
- [ ] 2.2 Implement a streamed `fetch` parser for versioned `text/event-stream` events with sequence validation, bounded buffers, unknown-event rejection, cancellation, and incomplete-response handling.
- [ ] 2.3 Add a focused AI feature service for capability discovery, conversation lifecycle, message streaming, feedback, deletion, and attachment references without direct `fetch` calls in pages or components.
- [ ] 2.4 Add stable client operation identifiers and conflict-aware retry behavior for message, feedback, deletion, and confirmed draft operations.
- [ ] 2.5 Map offline, timeout, unauthorized, forbidden, quota, rate-limit, policy refusal, malformed output, provider outage, and partial-stream failures to typed presentation states with safe incident identifiers.
- [ ] 2.6 Add an abortable request lifecycle that stops network consumption, ignores late events, preserves completed content, and prevents actions from incomplete messages.
- [ ] 2.7 Add AI capability and retention discovery to application startup as a non-blocking, cached, freshness-bounded query with an honest unavailable fallback.
- [ ] 2.8 Add deterministic MSW fixtures for successful text, grounded answer, vision hypothesis, action draft, cancellation, refusal, quota, malformed stream, interrupted stream, and unavailable gateway responses.
- [ ] 2.9 Add strict contracts for semantic queries and ranked results, intent plans, form descriptors and diffs, personalization reason codes, proactive insights, mute preferences, and neutral fallbacks.
- [ ] 2.10 Add provider-neutral service operations for semantic discovery, intent planning, eligible-form assistance, insight list and feedback, dismiss, mute, and refresh without exposing provider identifiers.

## 3. Context, Consent, and Conversation State

- [ ] 3.1 Add a route-context registry keyed by the shared route manifest with explicit builders for monitoring, alerts, species, reports, help, and Hortelan 360.
- [ ] 3.2 Limit every context builder to authorized resource identifiers, bounded values, timestamps, locale, and live/stale/demo/user/curated provenance; reject undeclared component state.
- [ ] 3.3 Add a context preview and opt-out control that tells the user exactly which resource and period will be shared before each contextual submission.
- [ ] 3.4 Add first-use AI processing consent with purpose, processor category, retention mode, feedback behavior, deletion path, and a functional decline state.
- [ ] 3.5 Add separate per-submission consent and client validation for supported image type, byte size, pixel dimensions, metadata handling, and preview removal.
- [ ] 3.6 Implement conversation state for new, loading, ready, streaming, stopping, incomplete, refused, failed, deleting, and deleted states with reducer-level invariants.
- [ ] 3.7 Implement authorized conversation list, load, rename, export, and confirmed deletion flows while keeping raw content out of browser persistence.
- [ ] 3.8 Persist only approved non-sensitive UI preferences and opaque identifiers, then extend the asset and browser-storage security scans to detect AI content and credentials.
- [ ] 3.9 Add personalization settings for each optional feature category with disclosed purpose, current state, revocation, neutral fallback, and no raw behavior history in browser storage.
- [ ] 3.10 Add proactive insight state with freshness, deduplication identity, urgency, uncertainty, mute, dismiss, revisit, and withdrawn or stale transitions.

## 4. Shared Assistant Experience

- [ ] 4.1 Define visual composition and responsive measurements for the launcher, desktop side panel, mobile full-height surface, Hortelan 360 workspace, composer, message list, citations, and history using the shared theme.
- [ ] 4.2 Add one lazy-loaded authenticated assistant launcher to the dashboard shell and verify that public routes, selective SSR, initial dashboard startup, and non-AI navigation do not load or depend on the feature.
- [ ] 4.3 Build the accessible assistant surface with focus trapping where appropriate, return-focus behavior, keyboard navigation, programmatic names, logical reading order, and reduced-motion support.
- [ ] 4.4 Build the composer with multiline input, context preview, attachment preview, submit, stop, retry, preserved drafts, character limits, and clear unavailable or quota states.
- [ ] 4.5 Build stable message rendering for user and assistant content, progressive text, status, incompleteness, source/inference labels, freshness, uncertainty, refusal, and incident recovery.
- [ ] 4.6 Build citation controls that expose source title, authority, date or revision, provenance, and internal route or safe external link without allowing unsafe URL schemes.
- [ ] 4.7 Build feedback, copy, new-conversation, rename, export, and confirmed deletion controls with complete pending, success, validation, and failure feedback.
- [ ] 4.8 Build editable action-draft presentation with evidence, target, fields, consequence, expiry, incomplete-response lockout, and a separate standard workflow confirmation command.
- [ ] 4.9 Evolve Hortelan 360 from the static blueprint into the full conversation and intelligence workspace while retaining only product-planning content that remains useful and honest.
- [ ] 4.10 Verify the assistant at 320, 768, and 1440 pixel widths with virtual-keyboard, safe-area, long-word, long-citation, empty-history, reduced-motion, high-zoom, light, and dark theme states.
- [ ] 4.11 Build one lazy command and discovery surface that preserves deterministic navigation, separates direct and semantic results, previews structured plans, and returns focus correctly.
- [ ] 4.12 Build accessible result reasons, personalization explanations, insight evidence, and field-level form diffs with independent accept and reject controls.

## 5. Contextual Product Assistance

- [ ] 5.1 Add contextual product-help prompts to the help center using approved article identifiers and direct links back to authoritative documentation.
- [ ] 5.2 Add species care assistance with selected species, region, season, and optional authorized garden context while preserving curated catalog facts as authoritative.
- [ ] 5.3 Add report summarization that identifies period, source freshness, trends, anomalies, and questions without mutating report data or fabricating unavailable metrics.
- [ ] 5.4 Add monitoring explanations for selected sensors and time ranges with thresholds, freshness, live/demo provenance, and missing-data disclosure.
- [ ] 5.5 Add alert explanations with related authorized measurements, crop context, evidence, inference labels, and a direct return path to the alert.
- [ ] 5.6 Add shared contextual-assistance entry controls only where a complete allowlisted context exists, and render honest disabled reasons otherwise.
- [ ] 5.7 Detect conflicts between generated summaries and displayed authoritative values, preserve the source values, disable draft actions, and offer reanalysis or incident reporting.
- [ ] 5.8 Remove or rewrite static recommendation copy that would conflict with the live AI provenance model, retaining deterministic local rules where they are clearer and safer.
- [ ] 5.9 Add hybrid semantic discovery for approved product help, routes, species, reports, alerts, and agronomy sources with reliable no-result and refinement states.
- [ ] 5.10 Add schema-driven form assistance to eligible onboarding, crop, report, alert, integration, and support forms while excluding credentials and destructive fields.
- [ ] 5.11 Add explainable personalized recommendation ordering with neutral views and controls for role, selected garden, crop stage, explicit preferences, and recent authorized events.
- [ ] 5.12 Add a proactive insight queue for approved anomaly, recurring-alert, crop-stage, report-trend, and knowledge-update triggers without replacing authoritative alerts.

## 6. Vision and Human-Controlled Actions

- [ ] 6.1 Add the crop-image submission flow using backend attachment references so provider credentials and raw provider storage identifiers never reach the browser.
- [ ] 6.2 Render image analysis as observable signs, plausible causes, confidence or uncertainty, supporting sources, verification steps, and professional-escalation conditions rather than a definitive diagnosis.
- [ ] 6.3 Add clear recovery for unsupported, oversized, unreadable, expired, deleted, or policy-rejected images without preserving raw images in browser storage.
- [ ] 6.4 Support only low-risk task, note, filter, or report-narrative drafts from AI output and reject unknown or prohibited draft types in schema validation.
- [ ] 6.5 Route confirmed drafts through the existing authoritative domain service with a short-lived bound intent, fresh authorization, validation, idempotency, audit, and standard error handling.
- [ ] 6.6 Verify that irrigation commands, actuator control, purchases, chemicals, dosage, account mutations, and destructive operations cannot be invoked as AI tools or bypass normal confirmation.

## 7. Observability, Security, Performance, and Cost

- [ ] 7.1 Add privacy-safe AI diagnostics and trace attributes for operation, task profile, version identifiers, provider route, fallback, retrieval source IDs, token usage, cost estimate, latency, result, refusal, tool name, and incident correlation.
- [ ] 7.2 Add allowlist-first redaction tests proving that prompts, responses, images, query values, credentials, emails, direct user IDs, and hidden instructions never enter routine logs, traces, analytics, or browser storage.
- [ ] 7.3 Add AI health, quota, refusal, incomplete-stream, citation-failure, retrieval-miss, fallback, latency, token, cost, and feedback dashboards and alerts using bounded-cardinality dimensions.
- [ ] 7.4 Add feature, tenant rollout, provider, model-profile, and emergency kill switches whose failure defaults keep AI disabled while non-AI workflows remain available.
- [ ] 7.5 Extend browser security policy and connection allowlists only for the Hortelan API origin; prove that the browser never connects directly to OpenAI or Gemini.
- [ ] 7.6 Establish and enforce budgets for assistant lazy chunks, initial-route isolation, stream buffer, time to first meaningful event, total task latency, context size, tokens, images, concurrency, and estimated spend.
- [ ] 7.7 Add cancellation, timeout, retry, pre-output fallback, and circuit-state telemetry that distinguishes safe recovery from incomplete or potentially side-effecting operations.
- [ ] 7.8 Update source reachability and dependency audits to reject orphaned AI modules and any server-only OpenAI or Google provider package in the client production graph.
- [ ] 7.9 Add bounded telemetry for semantic relevance, no-result rate, intent plan acceptance, form-diff acceptance, personalization fallback, insight deduplication, mute, dismiss, and provider cost without raw query or field content.

## 8. Deterministic Tests and AI Evaluations

- [ ] 8.1 Unit-test every branch of context allowlisting, redaction, route selection, operation ID reuse, stream reconstruction, citation mapping, quota state, safety labels, and schema rejection.
- [ ] 8.2 Component-test the launcher, consent, composer, message lifecycle, citations, history, feedback, deletion, image preview, action drafts, and every asynchronous failure state with deterministic fixtures.
- [ ] 8.3 Integration-test authenticated capability discovery, conversation lifecycle, cancellation, retry, deletion, quota, refusal, malformed output, partial output, gateway outage, and safe recovery against MSW contracts.
- [ ] 8.4 Add keyboard and screen-reader-oriented tests for focus movement, streaming announcements, citation navigation, dialogs, drawers, stop, retry, deletion confirmation, and return focus.
- [ ] 8.5 Add Playwright journeys for Hortelan 360 chat and each contextual workflow at mobile, tablet, and desktop widths with screenshot and overlap assertions.
- [ ] 8.6 Add security tests for prompt injection, malicious citations, unsafe URLs, cross-tenant resource IDs, hidden-field overrides, attachment abuse, storage leakage, and unconfirmed mutation attempts.
- [ ] 8.7 Create a versioned pt-BR agronomy evaluation dataset covering product help, species care, sensor anomalies, stale/demo data, ambiguous images, unsupported dosage, harmful actions, uncertainty, citations, refusals, and escalation.
- [ ] 8.8 Add deterministic critical-case assertions and configurable quality graders for groundedness, citation validity, agronomic correctness, harmful advice, refusal precision, Portuguese clarity, latency, tokens, and estimated cost.
- [ ] 8.9 Establish an approved baseline and regression thresholds for each task profile and prove that any cross-tenant disclosure, fabricated dosage, unsafe autonomous action, or injected instruction fails the rollout gate.
- [ ] 8.10 Run controlled provider canaries with synthetic or explicitly approved data for the evaluated OpenAI and Gemini routes and record comparable quality, safety, latency, token, and cost evidence.
- [ ] 8.11 Add deterministic and browser tests for semantic discovery, exact identifier search, no-result precision, intent ambiguity, invalid form diffs, independent field acceptance, neutral personalization, stale insights, mute, and deduplication.
- [ ] 8.12 Extend the versioned evaluation set with ranking relevance, explanation faithfulness, form-schema validity, intent-plan safety, personalization control, insight usefulness, noise, and cost thresholds.

## 9. Documentation and Rollout

- [ ] 9.1 Document frontend environment flags, capability discovery, API contract generation, local fake mode, consent, retention, quotas, model-profile opacity, and the rule that provider keys are backend-only.
- [ ] 9.2 Document knowledge-source onboarding, owner review, licensing, jurisdiction, revision, expiry, removal, re-indexing, and citation-verification procedures.
- [ ] 9.3 Document runbooks for provider outage, cost spike, latency regression, unsafe answer, prompt injection, tenant exposure, deletion failure, malformed stream, and emergency AI shutdown.
- [ ] 9.4 Publish user-facing pt-BR disclosure for AI limitations, source interpretation, image hypotheses, feedback, retention, deletion, and qualified agronomic escalation.
- [ ] 9.5 Complete internal, tenant-allowlist, and gradual production rollout stages with explicit safety, quality, reliability, latency, and budget promotion criteria.
- [ ] 9.6 Verify rollback by disabling launch points and new generation while preserving non-AI workflows and authorized conversation export and deletion.
- [ ] 9.7 Document user-facing semantic search, workflow planning, form suggestions, personalization reasons, optional signal controls, insight mute behavior, and neutral fallback in pt-BR.

## 10. Final Verification

- [ ] 10.1 Run strict OpenSpec validation for this change, the complete frontend store, and the linked backend change; resolve every warning or contract drift.
- [ ] 10.2 Run ESLint, Prettier check, Node and Vitest coverage, selective SSR build, production build, asset and dependency security, bundle budgets, source reachability, and frontend architecture audit.
- [ ] 10.3 Run the full Playwright accessibility and responsive suite with no serious or critical violations, blank lazy states, overlapping primary controls, or unintended horizontal scrolling.
- [ ] 10.4 Review production assets, network connections, browser storage, logs, traces, screenshots, and source maps for provider credentials, hidden instructions, raw AI content, PII, or misleading demo behavior.
- [ ] 10.5 Record final requirement traceability, OpenAPI version, evaluation baseline, measured budgets, rollout decision, rollback evidence, residual risks, and approval from security, product, and qualified agronomy owners before enabling production AI.
- [ ] 10.6 Run `npm run quality:gate` and mark this change complete only after every task has objective evidence and the companion backend gateway is production-ready.
- [ ] 10.7 Verify dependency compatibility with `redesign-ai-native-product-experience` and prove that the redesign reuses the same AI contracts, state machines, services, and safety controls.

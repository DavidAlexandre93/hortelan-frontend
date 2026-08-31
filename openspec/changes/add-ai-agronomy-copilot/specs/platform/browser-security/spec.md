## ADDED Requirements

### Requirement: Protected AI browser boundary

The production browser MUST call only the declared Hortelan AI gateway and SHALL NOT receive provider credentials, hidden system instructions, unrestricted provider configuration, or direct provider storage identifiers.

#### Scenario: Browser sends an assistant message

- **WHEN** a production user submits text, context, feedback, or an image
- **THEN** the request targets the authenticated Hortelan API origin under the enforced security policy and contains no privileged model credential

### Requirement: Explicit AI content consent

The frontend SHALL explain the purpose, shared context, processor category, retention mode, and deletion path before first use of AI content processing, and MUST obtain separate explicit confirmation before uploading an image or including optional personal context.

#### Scenario: User has not accepted AI processing

- **WHEN** the user invokes an AI feature for the first time
- **THEN** the product presents concise processing and retention information and sends no conversation content until consent is recorded

#### Scenario: User attaches an image

- **WHEN** an image is selected for analysis
- **THEN** the interface previews the file, validates type and size, identifies what will be shared, and waits for explicit submission

### Requirement: Minimal AI browser persistence

The browser MUST persist only non-sensitive conversation preferences and opaque authorized identifiers required by the approved session model and SHALL NOT store raw prompts, generated responses, images, retrieved documents, tool payloads, or provider identifiers in local storage.

#### Scenario: Browser storage is inspected after AI use

- **WHEN** local storage, session storage, caches, and service-worker storage are reviewed
- **THEN** conversation content, attachments, privileged instructions, and provider secrets are absent unless a separately specified encrypted offline mode exists

### Requirement: Personalization and behavior-signal controls

The browser MUST disclose optional personalization categories and SHALL transmit only the allowlisted opaque features approved for the active user and request, never raw browsing history, hidden DOM content, or unrelated interaction events.

#### Scenario: User disables behavior-based personalization

- **WHEN** the user revokes the optional behavior-signal category
- **THEN** subsequent AI requests omit those features and local preference state records only the revocation choice

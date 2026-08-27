## ADDED Requirements

### Requirement: Accessible conversational interaction

The assistant composer, messages, citations, status updates, action drafts, history controls, and dialogs MUST be operable by keyboard and assistive technology with visible focus, programmatic names, logical reading order, and non-disruptive announcements for streaming updates.

#### Scenario: Keyboard user completes a conversation turn

- **WHEN** a keyboard-only user opens the assistant, enters a message, stops or retries a response, inspects citations, and closes the surface
- **THEN** every command is reachable in a predictable order and focus returns to the invoking control

#### Scenario: Screen reader receives streaming content

- **WHEN** response tokens arrive progressively
- **THEN** the interface avoids announcing every token, communicates meaningful status changes, and exposes the completed answer and citations in a coherent reading order

### Requirement: Responsive assistant layout

The assistant SHALL use a bounded side panel on suitable desktop viewports and a full-height dialog or drawer on compact viewports, and MUST keep the composer, stop control, errors, citations, and current message visible without overlapping primary navigation or causing unintended horizontal page scrolling from 320 pixels upward.

#### Scenario: Assistant opens on a compact viewport

- **WHEN** the conversation is opened at a supported mobile width
- **THEN** the assistant uses the available viewport, respects safe areas and the virtual keyboard, and preserves a clear path back to the underlying workflow

#### Scenario: User prefers reduced motion

- **WHEN** reduced motion is enabled
- **THEN** assistant transitions and streaming indicators avoid nonessential movement while preserving understandable state changes

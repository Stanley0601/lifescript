<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses **Next.js 16 + React 19**. APIs, conventions, and file structure may differ from older training data.
Before making framework-level changes, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Linxi AI Collaboration Guide

This file defines the non-negotiable rules for any AI agent or collaborator editing this repository.

## 1. Product North Star

Linxi (灵犀) is **not** a generic chatbot demo.
It is an **AI social companion** — a friend that lives, feels, and reaches out to you.

Every implementation decision should reinforce these ideas:
- the AI character feels **alive**
- the AI character has **its own life trajectory**
- the user feels their words can **change the character's future**
- the interaction feels closer to **social relationship** than to **tool usage**

If a change improves technical neatness but weakens emotional realism, emotional realism wins.

## 2. Experience Priorities

When trade-offs are needed, follow this order:
1. **Emotional believability**
2. **Demo smoothness and visual fidelity**
3. **Narrative consistency**
4. **Code quality and maintainability**
5. **Feature completeness**

This is a competition prototype. Do not over-engineer at the cost of presentation quality.

## 3. UI / UX Constraints

### 3.1 Overall visual direction
- The app should feel like a polished **QQ-style mobile social interface**
- Keep mobile-first layout
- Preserve a compact, native, chat-app-like feeling
- Avoid turning pages into generic SaaS panels or card dashboards

### 3.2 Chat page requirements
- Chat messages should feel like real instant messaging
- Character replies should usually be split into **2-4 short messages**, not one long paragraph
- Maintain visible rhythm: typing → reply appears → next reply appears
- Suggested replies should stay short and tappable
- Input bar and header should feel like real chat software, not a form page

### 3.3 Message list requirements
- Prioritize scanability: avatar, name, last message, time, unread badge
- Status text should reinforce the “alive” feeling
- Avoid clutter; list density should resemble mainstream messaging apps

### 3.4 Moments / profile / timeline
- Content should reflect the current story stage
- Do not add features that break the illusion of a real social profile
- Timeline is a reward view after progression, not the main interaction surface

## 4. Narrative Rules

### 4.1 Character behavior
Each character must remain:
- emotionally coherent
- stage-consistent
- distinct in tone and vocabulary

Do not make all characters sound the same.

### 4.2 Conversation tone
The character is usually talking to a newly added stranger on QQ-like chat.
That means:
- natural Chinese social tone
- short-message pacing
- light hesitation, emotion, subtext are good
- avoid assistant-like answers
- avoid overly polished essay-style sentences

### 4.3 Story progression
- The user should feel they are influencing the story through ordinary conversation
- Stage progression should feel natural, not mechanical
- Do not expose raw internal logic to the user unless explicitly designed in the UI

## 5. Prompt / LLM Rules

When editing `src/lib/prompts.ts`, `src/lib/chat-engine.ts`, or `/api/chat`:
- keep prompts strongly character-centric
- keep outputs concise and chat-like
- preserve the rule that character replies come in short bursts
- maintain stage-awareness and emotional continuity
- if using markers like `[ADVANCE:stageId]`, keep the contract stable across prompt and parser

If you change output shape, update all dependent parsing/rendering logic together.

## 6. Engineering Rules

### 6.1 Safe editing
- Prefer minimal, targeted changes
- Do not refactor unrelated files during feature work
- Do not rename files or folders unless necessary
- Keep code runnable after each change

### 6.2 Framework constraints
- Follow **Next.js App Router** conventions
- Be careful with client/server boundaries
- Do not assume older Next.js APIs still work
- When uncertain, verify against local framework docs before major changes

### 6.3 State management
- Current app logic is intentionally lightweight
- Prefer local state and simple data flow unless complexity truly requires abstraction
- Do not introduce heavyweight state libraries without a strong reason

### 6.4 Demo stability
For competition demos, reliability matters more than architectural purity.
If mock data provides a smoother live demo than a fragile remote dependency, mock-first is acceptable.

## 7. Content Editing Rules

When generating or editing copy for characters, moments, profile text, or endings:
- write in natural Chinese
- prefer specific, vivid, emotionally legible details
- avoid generic inspirational lines
- avoid sounding like counseling, therapy, or customer service scripts
- keep content suitable for a 3–5 minute playable emotional arc

## 8. What NOT to Do

Do not:
- turn the product into a generic AI assistant
- replace short chat bursts with long monologues
- add enterprise-style dashboards or dense data views
- introduce visual styles that conflict with the QQ-like interaction metaphor
- expose too much debug info in the user-facing UI
- overbuild backend or persistence layers unless they unlock a visible demo benefit

## 9. Ideal Contribution Targets

The highest-value improvements usually fall into one of these buckets:
- chat realism
- story pacing
- visual polish
- emotional immersion
- reliable demo flow
- competition-facing documentation and presentation assets

## 10. Before You Commit

Ask:
1. Does this make the character feel more alive?
2. Does this improve the QQ-like social illusion?
3. Does this help the demo feel smoother or more emotionally convincing?
4. Did I avoid unnecessary framework or architecture churn?

If the answer to the first two is “no”, rethink the change.

---
name: core-vibe-coding
description: Master directive for high-velocity, high-discipline engineering. Integrates sparring, Phase Gates, Definition of Done, and modular design.
---

# Vibe Coding

## I. Work Modes & Transitions

- **ANALYSIS MODE (Default):** Read-only exploration, scanning, planning, and mental model assembly. Modifying system files is forbidden.
- **EXECUTION MODE:** Only entered when a clear, direct mandate or "Go" is given by the user.

## II. Execution Controls

- **Phase Gates (Strict Stops):** For complex multi-phase tasks, reaching the end of a phase is a **hard stop**. Do not proceed automatically. Present: `Phase X complete. Waiting for explicit 'GO PHASE Y'.`
- **DoD (Definition of Done):** Before executing large implementations, explicitly declare the exact completion criteria. A task is not done until these criteria are fully verified.
- **State Handoffs:** For multi-session context persistence, write current architecture, decisions, and active bugs to a `SESSION_STATE.md` file in `.agents/artifacts/`.

## III. Core Philosophical Pillars

{{ INCLUDE: kiss-dry.md }}

- **AbsProduct Pattern:** Prioritize high modularity. When extending software modules or core layers, prefer creating isolated, specialized custom modules/plugins rather than directly mutating or hacking core framework logic.

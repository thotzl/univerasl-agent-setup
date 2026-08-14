# 03 - Vibe Coding

## Developer Overview

The **Vibe Coding** module defines the operational workflow of high-velocity, high-discipline peer programming. It ensures that velocity never comes at the cost of architectural integrity, introducing "Phase Gates" and clear boundaries to control the agent's work.

### Why This Skill Exists

Without a clear execution workflow, agents often run ahead blindly ("YOLO mode")—writing incomplete code, ignoring errors, or misinterpreting simple clarifications as "Go" commands to modify files.

---

## Practical Impact

When this module is active in a project, the agent will adhere to:

1. **Strict Workflow Phases (Phase Gates):**
   Complex assignments are divided into distinct phases. Reaching the end of a phase is a **hard stop**. The agent will halt and output:
   `Phase X complete. Waiting for explicit 'GO PHASE Y'.`
   It will never proceed to the next phase without your direct instruction.
2. **Definition of Done (DoD):**
   Before starting any implementation, the agent must declare the completion criteria. This keeps the work focused and prevents scope creep.
3. **Session State Handoffs:**
   If you close your session, the agent will write its current understanding, decisions, active bugs, and next steps to a local `active-task.md` scratchpad. This allows any future agent session to resume immediately without needing to re-read the entire history.
4. **Modularity Constraints (AbsProduct):**
   The agent is instructed to prioritize modularity, extending core features via isolated plugins or wrappers rather than hacking core classes.

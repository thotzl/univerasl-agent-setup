# STATE SCRATCHPAD (Task Persistence)

## Purpose

Maintain task continuity across independent chat sessions. Minimize token cost of long histories by allowing "fresh starts".

## Process

1. **Initial Task State:**
   - At the start of a complex task, create `.agents/state/active-task.md`.
   - Record: Objective, Current Plan, Known Obstacles.
2. **Iterative Update:**
   - After each major step or discovery, update the file.
   - Record: Progress, Changes to Plan, Next Steps.
3. **Session Handoff:**
   - Before ending a chat or when history becomes too large:
     - Provide a final summary in `.agents/state/active-task.md`.
     - Direct the user to start a new chat and point to this file.
4. **Cleanup:**
   - Delete `.agents/state/active-task.md` only after task validation and completion.

## File Format

Keep it ultra-condensed. Bullet points only. No conversational filler.

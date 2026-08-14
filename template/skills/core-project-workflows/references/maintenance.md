# CODE MAINTENANCE (CLEAN)

## 1. Comment Clean

### Purpose

Improve code clarity by refining comments without changing logic.

### Process

1. **Translate:** Convert all comments to proper English (neutral-technical tone).
2. **Consolidate:**
   - Remove "noise" (obvious/redundant explanations, e.g., `// increment i` before `i++`).
   - Eliminate self-explanatory comments.
   - Remove context-dependent comments (e.g., "discussed this in chat #42").
3. **Improve:** Focus on the "Why" (architectural intent, non-obvious behavior, complex logic). Reference external docs if necessary.

## 2. Kill Todo

### Purpose

Clear the agent's todo list and state.

### Process

- Remove all pending todos from the codebase or state.
- Clear completed tasks.
- Reset the todo state for a fresh session start.

## 3. Legacy Sync (AGENTS.md alignment)

### Purpose

Ensure that the modern `.agents/skills/` architecture remains aligned with the team's legacy `AGENTS.md` files.

### Process

- Scan for all `AGENTS.md` files.
- Compare their content with the mandates in the corresponding `SKILL.md` files.
- If the human team has added new rules to an `AGENTS.md`, propagate them to the Skill's YAML-triggerable rules.
- Maintain the "Local Augmentation" references in the Skills.

## 4. Recommit

### Purpose

Restructure Git commits for a clean, logical history.

### Process

1. **State Verification:** ALWAYS `git fetch` and verify the local branch state against the remote before restructuring. Never blindly reset to `origin/develop` if the current branch contains external/peer commits that must be preserved. Use targeted `git reset --soft HEAD~N` or interactive rebasing when appropriate.
2. **Soft Reset:** Reset to the appropriate base commit to unstage changes for restructuring.
3. **Structured Commits:**
   - Group changes by logical feature/increment.
   - Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`).
   - Describe problem and solution neutrally (no process fluff).
4. **Focused Units:** Keep commits focused. Avoid mixed features in a single commit.
5. **Atomic Increments:** Commit in self-contained, logical increments (features/fixes).
6. **Granular Staging:** Stage and commit specific lines or hunks to separate unrelated changes within one file.
7. **Clean Attribution:** Never mention the agent. Avoid redundant author mentions in the commit message (e.g., "Committed by..."), as Git metadata handles attribution automatically. Keep the message focused on the technical change.

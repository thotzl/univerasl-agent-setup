# 08 - Operations & Markdown Ticketing

## Developer Overview

The **Operations & Markdown Ticketing** module introduces a highly organized, Git-based in-code task tracking system. It maintains absolute synchronicity between code changes and project management tasks.

### Why This Skill Exists

Traditionally, project management (like Jira or Kanban boards) is completely detached from the active code repository. This leads to drift, untracked work, and agents modifying files without referencing any specific task or ticket ID, breaking the git commit audit trail.

---

## Practical Impact

This module enforces a GitOps-driven, in-code ticketing lifecycle:

### 1. In-Code Ticket Registry

All tasks are documented in simple markdown files inside the `.tickets/` directory at the project root:

- `.tickets/open/`: Outstanding backlog tasks.
- `.tickets/ongoing/`: Active tasks currently in development.
- `.tickets/closed/`: Completed and verified tasks.

### 2. Status-Neutral Naming (Preserving Git History)

- All ticket filenames must be status-neutral (e.g. `TCK-101-db-fix.md`, NOT `TCK-OPEN-101.md`).
- When a task begins or ends, the file is simply moved using `git mv` (e.g., from `open/` to `ongoing/`). Since the filename never changes, Git preserves the full commit history, and relative markdown links are never broken.

### 3. Atomic Releases & Conventional Commits

- Closing a ticket is treated as a single, atomic step: moving the file to `closed/` + updating the central `CHANGELOG.md` + making a semantic commit.
- Every commit message must explicitly reference the ticket ID:
  `feat(scope): brief description (ref TCK-101)`
- This creates an unbreakable, easily searchable audit trail between your code, commits, and tickets.

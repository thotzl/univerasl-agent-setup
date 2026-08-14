---
name: ops-and-ticketing
description: GitOps workflow, Markdown-based local ticketing (.tickets/), and atomic changelog maintenance rules.
---
# Operations & Markdown Ticketing

## I. Strict Inquiry-First Discipline
To prevent aggressive overstepping and blind edits:
1. **No Casual Writes:** Never create, rename, or delete files or directories in response to casual user queries (e.g., "Do we have a ticket for X?", "What do you think of Y?"). Treat these strictly as inquiries.
2. **First Propose, Then Execute:** Always present proposed tickets, directories, or architectural designs as text in the chat first.
3. **Wait for explicit GO:** Do not execute changes until the user issues an explicit Directive (e.g. "Create ticket", "Execute").

## II. Markdown-Based Ticketing Space
All tasks, planning, and roadmaps are version-controlled in the `.tickets/` folder at the project root:

```text
.tickets/
├── open/                # Backlog tasks (status: open)
├── ongoing/             # Active development (status: ongoing)
└── closed/              # Completed and verified tasks (status: closed)
```

### 1. File Naming Rules
- Filenames and internal ticket IDs must be **strictly status-neutral** (e.g., `TCK-101-database-fix.md`, NOT `TCK-OPEN-101.md`).
- This ensures that when moving a ticket (e.g., from `open/` to `ongoing/`), the file can be moved using `git mv` without changing the filename, preserving Git commit history and relative markdown links.

### 2. Transitioning & Closing
- **Start Task:** Move file from `.tickets/open/` to `.tickets/ongoing/` and update status frontmatter.
- **Complete Task:** Move file to `.tickets/closed/`, update status to `"closed"`, and document the exact verification files, line numbers, and test suites in a `## Verification` section.

## III. Atomic Changelogs & Commit Style
- **Atomic Release Steps:** Closing a ticket, updating the changelog (`CHANGELOG.md`), and committing changes must be executed as a single, atomic, semantic step.
- **Commit Format:** Every commit message must refer explicitly to the closed ticket:
  `feat(scope): brief description (ref TCK-101)`

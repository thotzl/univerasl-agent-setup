# Universal Scaffolding Architecture

This document describes the compilation mechanics, file routing, and indexing logic of the Universal Agent Scaffolding setup.

---

## 1. Context Boundaries & Indexing (`.aiignore`)

For an AI agent to function successfully in a codebase, it must have unhindered access to its operating guidelines, while keeping the context window protected from heavy production and build artifacts.

This repository leverages the `.aiignore` file to enforce this division.

### How .aiignore Works:

1. **Blacklisting Heavy Paths:** Folders containing massive datasets, intermediate dependencies, or binary artifacts (e.g., `node_modules/`, `build/`, `dist/`, `.git/`, `*.log`, `*.lock`) are ignored.
2. **Whitelisting Scaffolding:** AI agents are configured to ignore hidden files by default. The `.aiignore` file includes explicit un-ignore commands (`!.agents/`, `!.agents/**/*`, `!AGENTS.md`) to force agents to index these critical instructions.
3. **Repository Map Integration:** By un-ignoring `.agents/`, the agent's internal indexing and search engines (like rip-grep or glob tools) can rapidly parse `AGENTS.md` and standard skill files first, placing them at the highest priority in the agent's context model.

---

## 2. Compilation Engine (Includes resolution)

To avoid maintaining duplicate blocks of core software engineering rules (e.g., the KISS/DRY philosophy is shared between `03-vibe-coding.md` and `04-code-craft.md`), the repository uses a custom compile-on-install workflow.

### The Template System:

- Shared atomic rules are stored in `template/shared/` as independent `.md` snippets.
- Master skill templates in `template/skills/` embed these blocks using the `{{ INCLUDE: shared/<filename>.md }}` syntax.
- The interactive installer `bin/cli.js` processes these files recursively on execution, outputting a fully compiled, self-contained, and flattened `.md` file to the target `.agents/skills/` folder.

This guarantees that the end-user agent is never forced to cross-reference multiple configuration files in real-time, reducing context consumption and reasoning overhead.

# Universal Agent Scripts

This repository bundles project-neutral utility scripts inside `template/scripts/` to optimize agent capabilities while keeping the context window and system state secure.

---

## 1. Codebase Structure Scanner (`gather-context.py`)

- **Objective:** Generates a rapid, token-efficient architectural map of the project (footprints of controllers, decorators, modules, or classes) without reading files or executing heavy grep-search commands.
- **How to Use:**
  Run the script from the project root:
  ```bash
  python3 .agents/scripts/gather-context.py
  ```
- **Configuration:**
  Customize the target folders or search patterns directly in the script's `TARGET_DIRS` or `PATTERNS` headers to fit non-standard languages or projects.

---

## 2. Ticket JSON Parser (`extract-ticket.py`)

- **Objective:** Extracts only relevant fields (e.g., ticket ID, summary, descriptions, comments) from heavy Jira/JSON/XML exports.
- **Why It Matters:** Prevents the AI from reading large datasets directly into the chat log, saving thousands of context tokens.
- **How to Use:**
  ```bash
  python3 .agents/scripts/extract-ticket.py path/to/ticket.json
  ```

---

## 3. Safe API Curl Wrapper (`safe_curl.sh`)

- **Objective:** Wraps API curl requests, loading sensitive credentials directly from local `.env` variables.
- **Why It Matters:** Prevents private API tokens, bearer keys, or passwords from leaking into shell command histories, terminal outputs, or agent chat logs.
- **How to Use:**
  ```bash
  bash .agents/scripts/safe_curl.sh --url "https://api.example.com/v1/resource" --method "POST" --payload '{"active": true}'
  ```

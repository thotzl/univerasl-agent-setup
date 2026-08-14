# 10 - Context Management

## Developer Overview

The **Context Management** skill focuses on keeping the agent's context window extremely lean and token-efficient. It introduces the sandbox environment (`.agents/artifacts/`) and local log parsing.

### Why This Skill Exists
As AI chat histories grow longer, context window consumption increases rapidly. This causes sessions to become extremely slow, expensive, and error-prone as the agent becomes overwhelmed by irrelevant history logs.

---

## Practical Impact

When active, the agent uses several token-saving workflows:

1. **The Sandbox (.agents/artifacts/):**
   All temporary scripts, diagnostic output files, filtered logs, and temporary state-dumps must be written inside the project's local `.agents/artifacts/` folder, preventing repo pollution.
2. **Local Log Filtering (No Large File Reads):**
   The agent is strictly forbidden from reading large `.log`, `.json`, or `.xml` files directly into the chat history. Instead, it writes a small local helper script (in Python, JS, or Bash) into `.agents/artifacts/` to parse and filter the files locally. It then reads only the high-signal filtered lines back into the chat.
3. **Session Re-start / Handoffs:**
   When a session becomes too fragmented or slow, the agent compiles a `SESSION_STATE.md` summary of key decisions, file locations, active bugs, and immediate tasks, and prompts the user to reset the chat.

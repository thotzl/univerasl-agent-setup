# 04 - Code Craft

## Developer Overview

The **Code Craft** skill establishes general, language-agnostic software engineering standards for the agent. It enforces a strict "Implement -> Self-Review -> Simplify" loop, prioritizing readability and robust error handling.

### Why This Skill Exists

Agents often write overly complex, nested, or unreadable code with speculative APIs or "magic" helpers because they don't critically self-review their solutions before submitting them.

---

## Practical Impact

When active, this module forces the agent to follow a strict quality gate:

1. **The Implement-Review-Simplify Loop:**
   - **Understand:** The agent must explicitly verify surrounding code patterns using search tools before typing.
   - **Implement:** Write complete, production-ready code with no speculative features, empty stubs, or TODOs.
   - **Review:** Critically self-evaluate the code for typings, duplication, performance, and naming.
   - **Simplify:** Refactor and strip away unnecessary layers of abstraction to ensure the solution is as simple as possible (KISS).
2. **Strict KISS & DRY Principles:**
   - **KISS:** Guard clauses are prioritized over deep nesting.
   - **DRY:** Code extraction is limited to real, active duplication. The agent is explicitly told that a small, clean duplicate block is better than a complex, multi-purpose abstraction built "just in case".
3. **English-Only Why-Comments:**
   - Code comments must explain the _reasons_ (Why) behind complex logic. Comments that simply restate what the code does are banned.
4. **Pre-Flight Checklist Verification:**
   Before declaring a task done, the agent must run a check on typings, null/undefined safety, async flow handling, and imports.

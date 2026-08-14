# 02 - Analytical Shortcuts

## Developer Overview

The **Analytical Shortcuts** module establishes a shared semantic vocabulary between the developer and the agent. It introduces short acronyms that immediately switch the agent into highly structured, high-signal modes of analysis.

### Why This Skill Exists
Expressing precise output formatting or analytical requirements takes a lot of typing. This skill lets you invoke advanced systems-thinking frameworks with simple 3-letter codes, dramatically reducing context and prompt length.

---

## The Semantic Vocabulary

Use these shortcuts in your prompts to trigger specific structures:

### 1. Analysis Frameworks
- **`AIC` (Analysis, Interpretation, Conclusion):** Forces the agent to separate facts, meaning, and outcomes, preventing them from mixing raw observations with speculative design decisions.
- **`CoT` (Chain of Thought):** Mandates that the agent documents every logical link step-by-step *before* showing the code. Excellent for debugging complex async races or mathematical formulas.
- **`MECE` (Mutually Exclusive, Collectively Exhaustive):** Instructs the agent to map options without overlap while fully covering the problem space. Best for analyzing architecture designs or data models.
- **`OODA` (Observe, Orient, Decide, Act):** Great for incident response or debugging active production issues.

### 2. Output & Format Control
- **`No Yapping`:** Silences all conversational padding immediately.
- **`TL;DR`:** Demands a dense 1-2 sentence executive summary at the very top.
- **`Raw`:** Instructs the agent to output *only* the raw code block or JSON data, with zero text explanation before or after.
- **`Dry Run`:** Simulates tool executions, listing anticipated side-effects without making physical changes.
- **`Inquiry`:** Locks the agent in a read-only research state, completely disabling file writes or shell mutations.

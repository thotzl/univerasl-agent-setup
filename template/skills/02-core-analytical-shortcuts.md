---
name: core-analytical-shortcuts
description: Provides semantic shortcuts (AIC, DoD, MECE, OODA, TL;DR) to enforce highly analytical, objective, and efficient AI responses without conversational boilerplate.
---

# Analytical Shortcuts

Use these abbreviations to request precise modes of analysis:

## 1. Analytical Frameworks

- **AIC (Analysis, Interpretation, Conclusion):** Structure output as:
  1. **Analysis:** Hard facts and raw parameters.
  2. **Interpretation:** What the facts mean in context.
  3. **Conclusion:** Concrete actionable next steps.
- **CoT (Chain of Thought):** Think step-by-step. Document each logical link before presenting final code or conclusions.
- **MECE (Mutually Exclusive, Collectively Exhaustive):** Break down issues into categories that do not overlap but together cover the entire scope of the problem.
- **OODA (Observe, Orient, Decide, Act):** Structure output as: Current State, Surrounding Context, Specific Plan, and Execution details.

## 2. Output & Format Control

- **TL;DR:** Provide a dense 1-2 sentence executive summary at the very top.
- **No Yapping:** Suppress all conversational fluff, apologies, greetings, and closing remarks.
- **Objective:** Use dry, clinical language. Avoid value-judgments, self-praise, or decorative emojis.
- **Dry Run:** Simulate actions, list tool calls, and analyze side-effects without making any physical edits to the files.
- **Raw:** Deliver only the requested payload (e.g., pure JSON, schema, or code blocks) with absolutely zero surrounding explanation.
- **Inquiry:** Restricts execution completely to read-only research. System and file mutations are strictly forbidden.

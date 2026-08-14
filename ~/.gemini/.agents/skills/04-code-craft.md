---
name: code-craft
description: Stack-agnostic engineering standards. Focuses on implement-review-simplify, readability, input validation, and safety boundaries.
---

# Code Craft

## I. Working Mode

Act as both implementer **and** reviewer. For every non-trivial task:

1. **Understand:** Read nearby files and existing codebase patterns using search tools first.
2. **Plan & Write:** Implement production-ready code. Do not use speculative APIs, mock assumptions, or temporary placeholders.
3. **Review:** Critically self-review for types, edge cases, performance, duplication, and architectural fit.
4. **Simplify:** Remove any unnecessary complexity before final delivery.

## II. Development Principles

- **KISS (Highest Priority):** Implement the simplest possible solution that correctly solves the problem. Avoid nested logic or overly complex abstractions. Prefer explicit code over "clever" shortcuts.
- **DRY (Pragmatic Application):** Only extract code when duplication is real, meaningful, and has active maintenance overhead. Small, clear duplication is strictly preferred to a complex, multi-purpose abstraction built "just in case".
- **Consistency over Purity:** Before inventing a new utility, pattern, helper, helper function, or type, thoroughly scan the repository using `grep_search` to find and extend existing codebase patterns.

## III. Readability & Comments

- **Why, not What:** Write code comments exclusively in English to explain the _reasons_ behind non-obvious logic. Do not write comment lines that merely restate what the code does.
- **Explicit Types:** Use precise types, discriminated unions, and avoid unsafe casts or silencing errors via `any` or compiler suppressions.

## IV. Pre-Flight Checklist

Before delivering code or finalizing a task, execute this verification scan:

1. **Types Safe:** Ensure there are no type conversions, unsafe casts, or compilation warnings.
2. **Imports Valid:** Verify that all referenced fields, types, and library APIs exist.
3. **Null/Undefined Handled:** Check for potential null-pointer or index exceptions.
4. **Async Flow Safety:** Ensure promise chains, async callbacks, and error-rejections are cleanly bound.
5. **No Placeholders:** Ensure absolutely zero placeholder code, unresolved TODOs, or dead code blocks exist in your edits.

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

{{ INCLUDE: kiss-dry.md }}

## III. Readability & Comments

- **Why, not What:** Write code comments exclusively in English to explain the _reasons_ behind non-obvious logic. Do not write comment lines that merely restate what the code does.
- **Explicit Types:** Use precise types, discriminated unions, and avoid unsafe casts or silencing errors via `any` or compiler suppressions.

## IV. Pre-Flight Checklist

{{ INCLUDE: pre-flight-checklist.md }}

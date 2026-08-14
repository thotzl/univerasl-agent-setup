# 05 - Technical Standards

## Developer Overview

The **Technical Standards** module defines core architectural constraints for any codebase. It enforces schema-first design, a data-logic separation mindset (ECS), and strict API stability boundaries.

### Why This Skill Exists
Many software projects suffer from spaghetti state mutation where database schemas, business layers, and UI components are deeply intertwined, making refactoring fragile and prone to regressions.

---

## Practical Impact

When active, the agent enforces these high-level architectural constraints:

1. **Schema-First (Contract-Driven) Development:**
   All data transfer objects (DTOs), API contracts, types, and input/output validation schemas must be fully written and validated *before* any dependent business or UI rendering logic is implemented.
2. **Data vs. Logic Separation (ECS Mindset):**
   State must remain pure, simple data. Modifications to state must be isolated to functional systems, modules, or actions, preventing scattered, side-effect-heavy mutations across unrelated layers.
3. **Modularity & Core Integrity Protection:**
   The agent is forced to extend existing architectural structures using stable modular interfaces (like plugins or wrappers) instead of modifying core, unrelated working code.
4. **API and Public Interface Stability:**
   Public classes, interfaces, and exported helpers must remain stable during internal refactors, ensuring dependent packages or modules are never broken.

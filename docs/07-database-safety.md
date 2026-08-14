# 07 - Database Safety

## Developer Overview

The **Database Safety** module enforces strict transactional boundaries, robust schema evolution rules, and clean local reset strategies.

### Why This Skill Exists

Agents can easily corrupt or lock local databases by running manual schema changes, executing un-wrapped or un-isolated mutations, or attempting speculative, buggy "down-migrations" when a migration fails.

---

## Practical Impact

When active, the agent adheres to these database guardrails:

1. **Strict Evolution Control:**
   Schema changes must be registered exclusively through migration scripts. Manual, ad-hoc edits to database schemas on active development or production environments are strictly banned.
2. **No Speculative Rollbacks (Down-Migrations):**
   Automatic, tool-generated down-migrations are prone to failure and can lead to irreversible data loss. The agent is discouraged from writing speculative rollback files.
3. **Local Reset Enforcement:**
   If a schema conflict occurs in a local workspace, the agent is directed to perform a complete database wipe/reset to guarantee a clean, transactional database baseline, rather than trying to patch individual local tables.
4. **Wrap in Transactions:**
   All multi-step state mutations written by the agent must be explicitly wrapped in isolated transactions. A failure at any intermediate step must automatically trigger a clean database rollback.

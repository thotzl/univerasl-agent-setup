# DEVELOPER DOCUMENTATION (DOCS)

## Purpose

Generate Git Wiki-style documentation in `docs/` mirroring the codebase structure, dynamically derived from current state and context.

## Generation Protocol

1. **Preparation:** Run a "Deep Context Scan" (DUMP) first.
2. **Mirroring Rules:**
   - Documentation structure must mirror the actual source directory structure (e.g., `src/hooks/` -> `docs/hooks/`).
   - Create a markdown file for each significant source file.
   - Preserve subdirectory hierarchy.
3. **Format Standards (Header):**

   ```markdown
   # [Name]

   > **Last Updated:** [YYYY-MM-DD HH:MM:SS] > **Location:** `path/to/file.ts` > **Type:** Component/Hook/Service/etc.
   ```

4. **Required Sections:**
   - **Overview:** Role in the system, "Why" it exists.
   - **API/Interface:** Complete TypeScript interfaces and function signatures.
   - **Usage Examples:** Real-world examples extracted from the codebase.
   - **Dependencies:** Imports and integration points.
   - **Implementation Details:** Logic flow, state handling, side effects.
   - **Edge Cases & Error Handling:** Boundary conditions and recovery.
5. **Special Files:**
   - `docs/README.md`: Navigation, quick start, architecture summary.
   - `docs/ARCHITECTURE.md`: Derived from context and codebase analysis.
   - `docs/CHANGELOG.md`: Track documentation updates with ISO 8601 timestamps.
6. **Maintenance:** Update timestamps and links on every update. Bidirectional references between related files.

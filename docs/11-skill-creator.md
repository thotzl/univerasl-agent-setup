# 11 - Skill Creator

## Developer Overview

The **Skill Creator** is a modular guide that instructs agents on how to construct, validate, and package _new_ custom skills for any project, maintaining consistency across the team.

### Why This Skill Exists

As projects evolve, teams need to add specialized custom knowledge or automation scripts. Without a standard guide, agents build custom skills with inconsistent directory layouts, messy metadata, or verbose explanations that clog the context window.

---

## Practical Impact

When creating or refining a custom skill inside a project, this guide ensures that:

1. **Agnostic & Clean Metadata:**
   Skills start with correct, clean YAML frontmatter that contains ONLY `name` and `description` keys. Descriptions are kept as dense, single-line triggers.
2. **Progressive Disclosure:**
   Core rules are kept under 400 lines in the main `SKILL.md` file. Heavy documentation, API specs, schemas, or models are moved to a `references/` subdirectory and linked on-demand.
3. **Verified Scripts:**
   Any automation script included in `scripts/` must be tested locally first. They must output clean, LLM-friendly stdout and suppress verbose system stack traces.
4. **Zero Placeholders:**
   Skills are thoroughly audited to ensure no unfinished segments or unresolved "TODO" style indicators remain before packaging.
5. **Agnostic Formatting:**
   Custom skills are designed completely independent of specific host platforms, personal user folders, or proprietary project references to ensure perfect team portability.

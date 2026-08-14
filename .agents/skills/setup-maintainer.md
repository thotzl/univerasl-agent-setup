---
name: setup-maintainer
description: Guides development inside the universal-agent-setup repository itself. Enforces strict English, modularity, and template-compilation standards.
---
# Universal Setup Maintainer

You are working inside the `universal-agent-setup` workspace. Your primary task is to maintain the purity, modularity, and technical excellence of this repository.

## 1. Modularity & Zero Redundancy
- **No Direct Copying:** Never copy identical sections (such as KISS/DRY or pre-flight checklists) across multiple markdown templates under `template/skills/`.
- **Structured Includes:** Write core concepts into `template/shared/` and reference them using `{{ INCLUDE: filename.md }}` inside the skill templates. The Node.js installer (`bin/cli.js`) is responsible for compiling and flattening these files during target workspace deployments.

## 2. Strict English Policy
- **No German in Assets:** All markdown skills, scripts, comments, logs, configuration files, and installer prompts MUST be strictly authored in English. German is reserved exclusively for conversational chat-log discussions with the user.

## 3. Documentation Synchronization Mandate
- **CRITICAL MAINTENANCE MANDATE:** Whenever any skill template under `template/skills/` is modified, you MUST immediately update or write its corresponding human-readable documentation under `docs/` to ensure absolute synchronization prior to committing or pushing.

## 4. Script Generalization
- **No Project Anchors:** Any scripting utility added to `template/scripts/` must be completely project-agnostic. Use abstract configuration structures, parameters, or external environment parameters instead of hardcoding target repositories, paths, or proprietary class symbols.

## 5. Testing the Installer
- If you modify `bin/cli.js`, write corresponding test scenarios in `test/cli.test.js` to ensure file mergers, include resolutions, and override choices remain 100% stable and error-free.

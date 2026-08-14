# Universal Agent Setup

Deterministic, modular, and industry-standard AI agent scaffolding and skills installer. 

This repository provides a highly optimized set of workflow files, unyielding behavior baselines, and engineering principles that trim any AI agent (e.g., Cursor, Gemini, Claude, Copilot) for maximum precision, safety, and efficiency across any codebase.

---

## 🏛️ Directory Structure

```text
universal-agent-setup/
├── package.json
├── README.md                  # Root pointer to this Wiki
├── bin/
│   └── cli.js                 # Interactive Node-native installer
├── docs/                      # Core Documentation & Wiki Space (Flat Folder)
│   ├── Home.md                # This page (Wiki Landing Page)
│   ├── SUMMARY.md             # Wiki Sidebar / Table of Contents
│   ├── ARCHITECTURE.md        # Deep dive into modular compilation and includes
│   ├── SCRIPTS.md             # Guide on using the bundled neutral agent scripts
│   ├── 01-behavioral-baseline.md
│   ├── 02-analytical-shortcuts.md
│   ...
│   └── 11-skill-creator.md
```

## 🚀 Installation & Integration

To bootstrap or integrate the scaffolding into any target repository:

1. Navigate to your target project folder.
2. Run the interactive installer locally using its absolute NPM prefix path:
   ```bash
   npm start --prefix ~/projects/universal-agent-setup
   ```

Alternatively, if you are working directly inside the `universal-agent-setup` repository, you can manage the installer using the package scripts:

```bash
npm start     # Runs the interactive CLI installer
npm test      # Runs the E2E and compliance test suite
```

### Installation Modes:
- **Safe Merge (Default):** Appends the unyielding behavioral rules to your existing `AGENTS.md` inside a `# --- UNIVERSAL AGENT DIRECTIVES ---` block and copies selected skills without deleting existing project-specific skills.
- **Overwrite:** Wipes the target `.agents/` folder and completely replaces your root `AGENTS.md` and `.aiignore` configurations.

---

## 🛠️ Compilation & Compilation Engine

To ensure dry maintenance, common concepts (like KISS/DRY or pre-flight check-lists) are stored as atomic markdown snippets inside `template/shared/`. 

The installer (`bin/cli.js`) automatically parses and resolves these `{{ INCLUDE: file.md }}` patterns on the fly.

This provides the best of both worlds:
1. **DRY Maintenance:** Edit shared concepts in a single file inside this repository.
2. **Flattened AI Context:** The agent in the target repository gets a complete, self-contained markdown file, minimizing context-jumping and reading errors.

---

## ⚖️ Development & Testing

This project prioritizes high test coverage. Always run verification suites after modifying the CLI or includes:

```bash
npm test
```

---

## 📓 Universal Skill Modules

Below is the complete, documented catalog of modular skills included in this scaffolding system. Click any skill to read its purpose, operational guidelines, and developer impact:

- [01. Behavioral Baseline](01-behavioral-baseline.md) - Core direct tone, sparring partner rules, and fluff suppression.
- [02. Analytical Shortcuts](02-analytical-shortcuts.md) - AIC, CoT, MECE, Raw, and Inquiry directive vocabulary.
- [03. Vibe Coding Standard](03-vibe-coding.md) - Phase Gates, State Handoffs, and modular AbsProduct design patterns.
- [04. Code Craft Guide](04-code-craft.md) - Implement-Review-Simplify loops, KISS, DRY, and Pre-flight checklist.
- [05. Technical Standards](05-technical-standards.md) - Schema-First design, ECS data-logic separation, and API stability.
- [06. Testing Strategies](06-testing-strategies.md) - Reproduction-First bugfixing, tier lanes, and surgical mocking boundaries.
- [07. Database Safety](07-database-safety.md) - Schema evolution control, transactional mutations, and clean local resets.
- [08. Operations & Ticketing](08-ops-and-ticketing.md) - GitOps, in-code status-neutral markdown tickets, and atomic releases.
- [09. Browser Automation](09-browser-automation.md) - WebMCP protocols, browser state-injection (Redux/Zustand), and A11y snapshots.
- [10. Context Management](10-context-management.md) - Sandbox environment (`.agents/artifacts/`), extractive local script log filtering.
- [11. Skill Creator Guide](11-skill-creator.md) - Progressive disclosure design patterns and packaging of custom project skills.

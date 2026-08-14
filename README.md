# Universal Agent Setup

Deterministic, modular, and industry-standard AI agent scaffolding and skills installer. 

This repository provides a highly optimized set of workflow files, unyielding behavior baselines, and engineering principles that trim any AI agent (e.g., Cursor, Gemini, Claude, Copilot) for maximum precision, safety, and efficiency across any codebase.

---

## 🏛️ Directory Structure

```text
universal-agent-setup/
├── package.json
├── README.md                  # Project overview and installation guide
├── bin/
│   └── cli.js                 # Interactive Node-native installer
├── docs/                      # Core architectural documentation
│   ├── ARCHITECTURE.md        # Deep dive into modular compilation and includes
│   └── SCRIPTS.md             # Guide on using the bundled neutral agent scripts
├── template/
│   ├── root/
│   │   ├── .aiignore          # Optimized context ignoring and un-ignoring boundaries
│   │   └── AGENTS.md          # Unyielding Root behavioral baselines
│   ├── shared/                # Core concepts included dynamically during compilation
│   │   ├── kiss-dry.md
│   │   └── pre-flight-checklist.md
│   ├── scripts/               # Project-neutral automation scripts
│   │   ├── gather-context.py
│   │   ├── extract-ticket.py
│   │   └── safe_curl.sh
│   └── skills/                # 10 modular, high-signal, standalone skill templates
│       ├── 01-behavioral-baseline.md
│       ├── 02-analytical-shortcuts.md
│       ├── 03-vibe-coding.md
│       ├── 04-code-craft.md
│       ├── 05-technical-standards.md
│       ├── 06-testing-strategies.md
│       ├── 07-database-safety.md
│       ├── 08-ops-and-ticketing.md
│       ├── 09-browser-automation.md
│       └── 10-context-management.md
└── .agents/
    └── skills/
        └── setup-maintainer.md # Self-maintaining rules for this repository
```

## 🚀 Installation & Integration

To bootstrap or integrate the scaffolding into any target repository:

1. Navigate to your target project folder.
2. Run the interactive installer locally:
   ```bash
   node ~/projects/universal-agent-setup/bin/cli.js
   ```

### Installation Modes:
- **Safe Merge (Default):** Appends the unyielding behavioral rules to your existing `AGENTS.md` inside a `# --- UNIVERSAL AGENT DIRECTIVES ---` block and copies selected skills without deleting existing project-specific skills.
- **Overwrite:** Wipes the target `.agents/` folder and completely replaces your root `AGENTS.md` and `.aiignore` configurations.

---

## 🛠️ Compilation & Compilation Engine

To ensure dry maintenance, common concepts (like KISS/DRY or pre-flight check-lists) are stored as atomic markdown snippets inside `template/shared/`. 

The installer (`bin/cli.js`) automatically parses and resolves these `{{ INCLUDE: shared/file.md }}` patterns on the fly.

This provides the best of both worlds:
1. **DRY Maintenance:** Edit shared concepts in a single file inside this repository.
2. **Flattened AI Context:** The agent in the target repository gets a complete, self-contained markdown file, minimizing context-jumping and reading errors.

---

## ⚖️ Development & Testing

This project prioritizes high test coverage. Always run verification suites after modifying the CLI or includes:

```bash
npm test
```

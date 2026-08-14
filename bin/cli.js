#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import os from "os";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(__dirname, "..");

// Helper to expand user home directory shortcut (~)
function expandHomeDir(filepath) {
  if (filepath === "~") {
    return os.homedir();
  }
  if (filepath.startsWith("~/") || filepath.startsWith("~" + path.sep)) {
    return path.join(os.homedir(), filepath.slice(2));
  }
  return filepath;
}

// Helper to ask questions in terminal
async function askQuestion(rl, question, defaultValue) {
  const ans = await rl.question(`${question} [${defaultValue}]: `);
  return ans.trim() || defaultValue;
}

// Helper to resolve template includes recursively
async function compileTemplate(filePath, sharedDir) {
  let content = await fs.readFile(filePath, "utf-8");
  const includeRegex = /\{\{\s*INCLUDE:\s*(.*?)\s*\}\}/g;
  let match;

  while ((match = includeRegex.exec(content)) !== null) {
    const includePath = path.resolve(sharedDir, match[1]);
    try {
      const includeContent = await fs.readFile(includePath, "utf-8");
      content = content.replace(match[0], includeContent);
    } catch (err) {
      console.warn(
        `Warning: Could not include ${match[1]} from ${includePath}: ${err.message}`,
      );
      content = content.replace(
        match[0],
        `<!-- Failed to include ${match[1]} -->`,
      );
    }
    // Reset regex index because we modified content length
    includeRegex.lastIndex = 0;
  }
  return content;
}

// Parse Command Line Arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    target: null,
    mode: null,
    skills: null,
    yes: false,
    headless: false,
    uninstall: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--target" || arg === "-t") {
      options.target = args[++i];
      options.headless = true;
    } else if (arg === "--mode" || arg === "-m") {
      options.mode = args[++i];
      options.headless = true;
    } else if (arg === "--skills" || arg === "-s") {
      options.skills = args[++i];
      options.headless = true;
    } else if (arg === "--yes" || arg === "-y") {
      options.yes = true;
      options.headless = true;
    } else if (arg === "--uninstall" || arg === "-u") {
      options.uninstall = true;
      options.headless = true;
    }
  }
  return options;
}

async function main() {
  console.log("\n=============================================");
  console.log("    Universal Agent Scaffolding Installer    ");
  console.log("=============================================\n");

  const cliOptions = parseArgs();

  const originalCwd = process.env.INIT_CWD || process.cwd();
  let targetDir = originalCwd;

  if (cliOptions.uninstall) {
    console.log("=============================================");
    console.log("          Uninstalling Agent Setup           ");
    console.log("=============================================\n");

    const targetInput = cliOptions.target || ".";
    targetDir = path.resolve(originalCwd, expandHomeDir(targetInput));

    // Resolve redirection block and list of rule files
    const agentRuleFiles = [
      ".cursorrules",
      ".windsurfrules",
      ".clinerules",
      ".copilotrules",
      ".github/copilot-instructions.md",
      "CLAUDE.md",
      "GEMINI.md",
      ".gemini",
      ".geminirules",
    ];

    const redirectComment = `\n\n# ==============================================================================\n#                 Universal AI Agent & Copilot Redirection\n# ==============================================================================\n# This workspace utilizes a unified cognitive rule-structure. To prevent context \n# drift, hallucinations, or anti-hallucination rule violations, ALL AI agents \n# (Cursor, Copilot, Windsurf, Gemini, Cline, Roo Code, etc.) working inside this\n# codebase MUST read, internalize, and strictly prioritize:\n# \n# 1. The master root mandates in: AGENTS.md\n# 2. The compiled, flattened specialized skills in: .agents/skills/\n# ==============================================================================\n`;

    if (!cliOptions.yes) {
      const rl = readline.createInterface({ input, output });
      try {
        const confirm = await askQuestion(
          rl,
          `This will delete .agents/, AGENTS.md, .aiignore and strip redirection from rule files in:\n  ${targetDir}\nProceed with uninstallation? (y/n)`,
          "n",
        );
        if (confirm.toLowerCase() !== "y") {
          console.log("Uninstallation cancelled.");
          rl.close();
          return;
        }
      } catch (err) {
        console.error(`✗ Prompt error: ${err.message}`);
        rl.close();
        process.exit(1);
      } finally {
        rl.close();
      }
    }

    try {
      // 1. Remove .agents/
      const destAgents = path.join(targetDir, ".agents");
      try {
        await fs.rm(destAgents, { recursive: true, force: true });
        console.log("✓ Removed .agents/ directory");
      } catch (err) {
        console.warn(`⚠ Could not remove .agents/ directory: ${err.message}`);
      }

      // 2. Remove AGENTS.md
      const destAgentsMd = path.join(targetDir, "AGENTS.md");
      try {
        await fs.rm(destAgentsMd, { force: true });
        console.log("✓ Removed AGENTS.md");
      } catch (err) {
        console.warn(`⚠ Could not remove AGENTS.md: ${err.message}`);
      }

      // 3. Remove .aiignore
      const destAiignore = path.join(targetDir, ".aiignore");
      try {
        await fs.rm(destAiignore, { force: true });
        console.log("✓ Removed .aiignore");
      } catch (err) {
        console.warn(`⚠ Could not remove .aiignore: ${err.message}`);
      }

      // 4. Strip redirection from rule files
      for (const ruleFile of agentRuleFiles) {
        const destRulePath = path.join(targetDir, ruleFile);
        let ruleFileExists = false;
        try {
          await fs.access(destRulePath);
          ruleFileExists = true;
        } catch {}

        if (!ruleFileExists) continue;

        try {
          let ruleContent = await fs.readFile(destRulePath, "utf-8");
          if (ruleContent.includes(redirectComment)) {
            ruleContent = ruleContent.replace(redirectComment, "");
          } else {
            // Regex fallback
            const redirectRegex =
              /\r?\n\r?\n# =+[\s\S]*?Universal AI Agent & Copilot Redirection[\s\S]*?# =+\r?\n?/g;
            ruleContent = ruleContent.replace(redirectRegex, "");
          }

          ruleContent = ruleContent.trim();
          if (ruleContent === "") {
            await fs.rm(destRulePath, { force: true });
            // Clean up empty directories if left behind (like .github/)
            if (ruleFile.includes("/")) {
              const parentDir = path.dirname(destRulePath);
              try {
                const remainingFiles = await fs.readdir(parentDir);
                if (remainingFiles.length === 0) {
                  await fs.rmdir(parentDir);
                  console.log(
                    `✓ Removed empty parent directory: ${path.basename(parentDir)}`,
                  );
                }
              } catch {}
            }
            console.log(`✓ Removed empty rule file: ${ruleFile}`);
          } else {
            await fs.writeFile(destRulePath, ruleContent + "\n");
            console.log(`✓ Stripped redirection from: ${ruleFile}`);
          }
        } catch (err) {
          console.warn(
            `⚠ Could not process ${ruleFile} during uninstall: ${err.message}`,
          );
        }
      }

      console.log("\n=============================================");
      console.log("   Uninstallation completed successfully!    ");
      console.log("=============================================\n");
    } catch (err) {
      console.error(`✗ Uninstallation failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  let overwriteMode = false;
  let selectedFiles = [];

  const modules = [
    {
      id: "1",
      name: "01-core-behavioral-baseline.md",
      desc: "Core direct tone, sparring partner rules",
    },
    {
      id: "2",
      name: "02-core-analytical-shortcuts.md",
      desc: "AIC, CoT, MECE, Raw, Inquiry directives",
    },
    {
      id: "3",
      name: "03-core-vibe-coding.md",
      desc: "Schema-first, DoD, Phase-gates engineering standard",
    },
    {
      id: "4",
      name: "04-core-code-craft.md",
      desc: "Implement-Review-Simplify, KISS, Pre-flight checks",
    },
    {
      id: "5",
      name: "05-core-technical-standards.md",
      desc: "Data-logic separation (ECS), stable interfaces",
    },
    {
      id: "6",
      name: "06-core-testing-strategies.md",
      desc: "Reproduction-first, surgical mocking rules",
    },
    {
      id: "7",
      name: "07-core-database-safety.md",
      desc: "No experimental rollbacks, clean local resets",
    },
    {
      id: "8",
      name: "08-core-ops-and-ticketing.md",
      desc: "Markdown ticketing (.tickets/), atomic changelogs",
    },
    {
      id: "9",
      name: "09-core-browser-automation.md",
      desc: "WebMCP & structured state-injection (Redux/Zustand)",
    },
    {
      id: "10",
      name: "10-core-context-management.md",
      desc: "Extractive compression & local script sandbox",
    },
    {
      id: "11",
      name: "11-core-skill-creator.md",
      desc: "Agnostic guidelines to create modular agent skills",
    },
    {
      id: "12",
      name: "12-core-redux-investigator.md",
      desc: "Live Redux state analysis and browser action dispatching",
    },
    {
      id: "13",
      name: "13-core-project-workflows.md",
      desc: "Workspace context, REPO_MAP sync, and Phase-gates limits",
    },
  ];

  if (cliOptions.headless) {
    // ------------------ HEADLESS MODE ------------------
    console.log("Running in Headless (Non-Interactive) Mode...\n");

    // 1. Resolve target
    const targetInput = cliOptions.target || ".";
    targetDir = path.resolve(originalCwd, expandHomeDir(targetInput));

    // 2. Resolve mode
    const modeInput = cliOptions.mode || "safe";
    overwriteMode = modeInput.toLowerCase() === "overwrite";

    // 3. Resolve skills
    const skillsInput = cliOptions.skills || "all";
    if (skillsInput.toLowerCase() === "all") {
      selectedFiles = modules.map((m) => m.name);
    } else {
      const selectedIds = skillsInput.split(",").map((s) => s.trim());
      selectedFiles = modules
        .filter(
          (m) => selectedIds.includes(m.id) || selectedIds.includes(m.name),
        )
        .map((m) => m.name);
    }

    if (!cliOptions.yes) {
      console.error(
        "Error: Headless mode requires the --yes or -y flag to confirm execution.",
      );
      process.exit(1);
    }
  } else {
    // ------------------ INTERACTIVE MODE ------------------
    const rl = readline.createInterface({ input, output });

    try {
      // 1. Ask Target Directory
      const targetInput = await askQuestion(
        rl,
        "Enter target installation directory",
        ".",
      );
      targetDir = path.resolve(originalCwd, expandHomeDir(targetInput));

      // 2. Ask Integration Mode
      console.log("\nSelect Installation Mode:");
      console.log(
        " 1) Safe Merge (Append rules to existing AGENTS.md, merge skills without deleting others)",
      );
      console.log(
        " 2) Overwrite (Wipe and replace existing .agents/ and AGENTS.md)",
      );
      const modeChoice = await askQuestion(rl, "Enter choice (1 or 2)", "1");
      overwriteMode = modeChoice === "2";

      // 3. Display Modules
      console.log("\nAvailable Skill Modules:");
      modules.forEach((m) => {
        console.log(`  ${m.id}) ${m.name.padEnd(28)} - ${m.desc}`);
      });

      const selectChoice = await askQuestion(
        rl,
        'Enter IDs to install (comma-separated, e.g. 1,2,3,5) or "all"',
        "all",
      );
      if (selectChoice.toLowerCase() === "all") {
        selectedFiles = modules.map((m) => m.name);
      } else {
        const selectedIds = selectChoice.split(",").map((s) => s.trim());
        selectedFiles = modules
          .filter((m) => selectedIds.includes(m.id))
          .map((m) => m.name);
      }

      // 4. Confirm install
      console.log(`\nTarget Location : ${targetDir}`);
      console.log(
        `Mode            : ${overwriteMode ? "OVERWRITE" : "SAFE INTEGRATE"}`,
      );
      console.log(`Skills to Copy  : ${selectedFiles.length} files`);

      const confirm = await askQuestion(
        rl,
        "Proceed with installation? (y/n)",
        "y",
      );
      if (confirm.toLowerCase() !== "y") {
        console.log("Installation cancelled.");
        rl.close();
        return;
      }
    } catch (err) {
      console.error(`✗ Prompt error: ${err.message}`);
      rl.close();
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  // ------------------ EXECUTION ENGINE ------------------
  try {
    const templateRoot = path.join(REPO_ROOT, "template", "root");
    const templateSkills = path.join(REPO_ROOT, "template", "skills");
    const templateShared = path.join(REPO_ROOT, "template", "shared");
    const templateScripts = path.join(REPO_ROOT, "template", "scripts");

    const destAgents = path.join(targetDir, ".agents");

    // Dynamically resolve skills destination: if the target is a hidden dotfolder (like .gemini, .cursor, etc.)
    // we install directly to skills/ to align with global config standards. Otherwise, we install to .agents/skills/
    const isGlobalInstall = path.basename(targetDir).startsWith(".");
    const destSkills = isGlobalInstall
      ? path.join(targetDir, "skills")
      : path.join(destAgents, "skills");

    const destArtifacts = path.join(destAgents, "artifacts");
    const destState = path.join(destAgents, "state");
    const destScripts = path.join(destAgents, "scripts");

    // Ensure basic folders exist
    await fs.mkdir(destAgents, { recursive: true });
    await fs.mkdir(destSkills, { recursive: true });
    await fs.mkdir(destArtifacts, { recursive: true });
    await fs.mkdir(destState, { recursive: true });

    // Create gitignored keep files
    await fs.writeFile(path.join(destArtifacts, ".keep"), "");
    await fs.writeFile(path.join(destState, ".keep"), "");

    // Handle Root Files
    // .aiignore
    const srcAiignore = path.join(templateRoot, ".aiignore");
    const destAiignore = path.join(targetDir, ".aiignore");
    let aiignoreContent = "";
    try {
      aiignoreContent = await fs.readFile(srcAiignore, "utf-8");
    } catch {
      // Fallback default
      aiignoreContent = `# Agent standard ignores\nnode_modules/\nbuild/\ndist/\n.git/\n\n# Unignore agent directories explicitly so tools can index them\n!.agents/\n!.agents/**/*\n!AGENTS.md\n`;
    }
    await fs.writeFile(destAiignore, aiignoreContent);
    console.log("✓ Wrote .aiignore (configured to unignore .agents/)");

    // AGENTS.md
    const srcAgentsMd = path.join(templateRoot, "AGENTS.md");
    const destAgentsMd = path.join(targetDir, "AGENTS.md");
    let agentsMdContent = await fs.readFile(srcAgentsMd, "utf-8");

    let agentsMdExists = false;
    try {
      await fs.access(destAgentsMd);
      agentsMdExists = true;
    } catch {}

    if (agentsMdExists && !overwriteMode) {
      // Safe Merge mode
      let existingContent = await fs.readFile(destAgentsMd, "utf-8");
      if (existingContent.includes("UNIVERSAL AGENT DIRECTIVES")) {
        console.log(
          "! AGENTS.md already contains the universal directives block. Skipping merge.",
        );
      } else {
        const mergedContent = `${existingContent}\n\n# --- UNIVERSAL AGENT DIRECTIVES ---\n\n${agentsMdContent}`;
        await fs.writeFile(destAgentsMd, mergedContent);
        console.log(
          "✓ Integrated universal directives into existing AGENTS.md",
        );
      }
    } else {
      // Overwrite/Write new
      await fs.writeFile(destAgentsMd, agentsMdContent);
      console.log("✓ Wrote AGENTS.md");
    }

    // Handle Agent-Typical Rule Files Redirection
    const agentRuleFiles = [
      ".cursorrules",
      ".windsurfrules",
      ".clinerules",
      ".copilotrules",
      ".github/copilot-instructions.md",
      "CLAUDE.md",
      "GEMINI.md",
      ".gemini",
      ".geminirules",
    ];

    const redirectComment = `\n\n# ==============================================================================\n#                 Universal AI Agent & Copilot Redirection\n# ==============================================================================\n# This workspace utilizes a unified cognitive rule-structure. To prevent context \n# drift, hallucinations, or anti-hallucination rule violations, ALL AI agents \n# (Cursor, Copilot, Windsurf, Gemini, Cline, Roo Code, etc.) working inside this\n# codebase MUST read, internalize, and strictly prioritize:\n# \n# 1. The master root mandates in: AGENTS.md\n# 2. The compiled, flattened specialized skills in: .agents/skills/\n# ==============================================================================\n`;

    for (const ruleFile of agentRuleFiles) {
      const destRulePath = path.join(targetDir, ruleFile);
      let ruleFileExists = false;
      try {
        await fs.access(destRulePath);
        ruleFileExists = true;
      } catch {}

      // ONLY process files that already exist to prevent polluting the workspace with unused rule files!
      // EXCEPTION: .github/copilot-instructions.md is created even if it doesn't exist.
      if (!ruleFileExists && ruleFile !== ".github/copilot-instructions.md")
        continue;

      try {
        // Ensure parent directory exists (e.g. for .github/copilot-instructions.md)
        await fs.mkdir(path.dirname(destRulePath), { recursive: true });

        if (!overwriteMode && ruleFileExists) {
          // Safe Merge: Append redirection if not already present
          let existingRuleContent = await fs.readFile(destRulePath, "utf-8");
          if (
            !existingRuleContent.includes(
              "Universal AI Agent & Copilot Redirection",
            )
          ) {
            await fs.writeFile(
              destRulePath,
              existingRuleContent + redirectComment,
            );
            console.log(
              `✓ Merged redirection pointer into existing ${ruleFile}`,
            );
          } else {
            console.log(
              `! ${ruleFile} already contains redirection. Skipping.`,
            );
          }
        } else {
          // Overwrite mode or new file creation: Replace/write completely with redirection pointer
          await fs.writeFile(destRulePath, redirectComment);
          if (ruleFileExists) {
            console.log(
              `✓ Overwrote existing ${ruleFile} with clean redirection pointer`,
            );
          } else {
            console.log(
              `✓ Created new ${ruleFile} with clean redirection pointer`,
            );
          }
        }
      } catch (err) {
        console.warn(
          `\n⚠ WARNING: Could not write redirection to ${ruleFile}: ${err.message}`,
        );
        console.warn(
          `Please manually paste the following redirection block into your ${ruleFile} file:\n`,
        );
        console.warn(redirectComment);
      }
    }

    // Handle Skills (Compile with Includes and Copy Assets)
    for (const file of selectedFiles) {
      const srcFile = path.join(templateSkills, file);

      // Extract directory name (e.g. "01-core-behavioral-baseline.md" -> "core-behavioral-baseline")
      const skillDirName = file.replace(/^\d+-/, "").replace(".md", "");
      const skillTargetDir = path.join(destSkills, skillDirName);
      const destFile = path.join(skillTargetDir, "SKILL.md");

      try {
        // Explicitly wipe the old skill directory to guarantee a clean, non-polluted replacement and prevent orphaned files
        await fs.rm(skillTargetDir, { recursive: true, force: true });

        // Create directory for the skill
        await fs.mkdir(skillTargetDir, { recursive: true });

        // Compile and write SKILL.md
        const compiled = await compileTemplate(srcFile, templateShared);
        await fs.writeFile(destFile, compiled);
        console.log(`✓ Compiled and wrote skill: ${skillDirName}/SKILL.md`);

        // Check if there are associated assets/scripts inside the template folder
        const srcAssetDir = path.join(templateSkills, skillDirName);
        let srcAssetDirExists = false;
        try {
          await fs.access(srcAssetDir);
          srcAssetDirExists = true;
        } catch {}

        if (srcAssetDirExists) {
          // Recursively copy references, scripts, assets, etc.
          await fs.cp(srcAssetDir, skillTargetDir, { recursive: true });
          console.log(
            `   ↳ Copied associated assets/scripts for ${skillDirName}`,
          );
        }
      } catch (err) {
        console.error(
          `✗ Error processing skill ${skillDirName}: ${err.message}`,
        );
      }
    }

    // Handle Scripts if exist
    let scriptsCopied = 0;
    try {
      const files = await fs.readdir(templateScripts);
      if (files.length > 0) {
        await fs.mkdir(destScripts, { recursive: true });
        for (const file of files) {
          const srcPath = path.join(templateScripts, file);
          const destPath = path.join(destScripts, file);
          await fs.copyFile(srcPath, destPath);
          await fs.chmod(destPath, 0o755); // Make scripts executable
          scriptsCopied++;
        }
        console.log(
          `✓ Copied ${scriptsCopied} utility scripts to .agents/scripts/`,
        );
      }
    } catch {}

    console.log("\n=============================================");
    console.log("   Installation completed successfully!      ");
    console.log("=============================================\n");
  } catch (err) {
    console.error(`✗ Installation failed: ${err.message}`);
    process.exit(1);
  }
}

main();

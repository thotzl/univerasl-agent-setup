#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(__dirname, '..');

// Helper to ask questions in terminal
async function askQuestion(rl, question, defaultValue) {
  const ans = await rl.question(`${question} [${defaultValue}]: `);
  return ans.trim() || defaultValue;
}

// Helper to resolve template includes recursively
async function compileTemplate(filePath, sharedDir) {
  let content = await fs.readFile(filePath, 'utf-8');
  const includeRegex = /\{\{\s*INCLUDE:\s*(.*?)\s*\}\}/g;
  let match;
  
  while ((match = includeRegex.exec(content)) !== null) {
    const includePath = path.resolve(sharedDir, match[1]);
    try {
      const includeContent = await fs.readFile(includePath, 'utf-8');
      content = content.replace(match[0], includeContent);
    } catch (err) {
      console.warn(`Warning: Could not include ${match[1]} from ${includePath}: ${err.message}`);
      content = content.replace(match[0], `<!-- Failed to include ${match[1]} -->`);
    }
    // Reset regex index because we modified content length
    includeRegex.lastIndex = 0;
  }
  return content;
}

async function main() {
  const rl = readline.createInterface({ input, output });
  
  console.log('\n=============================================');
  console.log('    Universal Agent Scaffolding Installer    ');
  console.log('=============================================\n');
  
  try {
    // 1. Ask Target Directory
    const targetInput = await askQuestion(rl, 'Enter target installation directory', '.');
    const targetDir = path.resolve(process.cwd(), targetInput);
    
    // 2. Ask Integration Mode
    console.log('\nSelect Installation Mode:');
    console.log(' 1) Safe Merge (Append rules to existing AGENTS.md, merge skills without deleting others)');
    console.log(' 2) Overwrite (Wipe and replace existing .agents/ and AGENTS.md)');
    const modeChoice = await askQuestion(rl, 'Enter choice (1 or 2)', '1');
    const overwriteMode = modeChoice === '2';
    
    // 3. Define Modules
    const modules = [
      { id: '1', name: 'behavioral-baseline.md', desc: 'Core direct tone, sparring partner rules' },
      { id: '2', name: 'analytical-shortcuts.md', desc: 'AIC, CoT, MECE, Raw, Inquiry directives' },
      { id: '3', name: 'vibe-coding.md', desc: 'Schema-first, DoD, Phase-gates engineering standard' },
      { id: '4', name: 'context-management.md', desc: 'Extractive compression & local script sandbox' },
      { id: '5', name: 'code-craft.md', desc: 'Implement-Review-Simplify, KISS, Pre-flight checks' },
      { id: '6', name: 'technical-standards.md', desc: 'Data-logic separation (ECS), stable interfaces' },
      { id: '7', name: 'testing-strategies.md', desc: 'Reproduction-first, surgical mocking rules' },
      { id: '8', name: 'database-safety.md', desc: 'No experimental rollbacks, clean local resets' },
      { id: '9', name: 'ops-and-ticketing.md', desc: 'Markdown ticketing (.tickets/), atomic changelogs' },
      { id: '10', name: 'browser-automation.md', desc: 'WebMCP & structured state-injection (Redux/Zustand)' }
    ];
    
    console.log('\nAvailable Skill Modules:');
    modules.forEach(m => {
      console.log(`  ${m.id}) ${m.name.padEnd(28)} - ${m.desc}`);
    });
    
    const selectChoice = await askQuestion(rl, 'Enter IDs to install (comma-separated, e.g. 1,2,3,5) or "all"', 'all');
    let selectedFiles = [];
    if (selectChoice.toLowerCase() === 'all') {
      selectedFiles = modules.map(m => m.name);
    } else {
      const selectedIds = selectChoice.split(',').map(s => s.trim());
      selectedFiles = modules.filter(m => selectedIds.includes(m.id)).map(m => m.name);
    }
    
    // 4. Confirm install
    console.log(`\nTarget Location : ${targetDir}`);
    console.log(`Mode            : ${overwriteMode ? 'OVERWRITE' : 'SAFE INTEGRATE'}`);
    console.log(`Skills to Copy  : ${selectedFiles.length} files`);
    
    const confirm = await askQuestion(rl, 'Proceed with installation? (y/n)', 'y');
    if (confirm.toLowerCase() !== 'y') {
      console.log('Installation cancelled.');
      rl.close();
      return;
    }
    
    // 5. Run Execution
    const templateRoot = path.join(REPO_ROOT, 'template', 'root');
    const templateSkills = path.join(REPO_ROOT, 'template', 'skills');
    const templateShared = path.join(REPO_ROOT, 'template', 'shared');
    const templateScripts = path.join(REPO_ROOT, 'template', 'scripts');
    
    const destAgents = path.join(targetDir, '.agents');
    const destSkills = path.join(destAgents, 'skills');
    const destArtifacts = path.join(destAgents, 'artifacts');
    const destState = path.join(destAgents, 'state');
    const destScripts = path.join(destAgents, 'scripts');
    
    // Ensure basic folders exist
    await fs.mkdir(destAgents, { recursive: true });
    await fs.mkdir(destSkills, { recursive: true });
    await fs.mkdir(destArtifacts, { recursive: true });
    await fs.mkdir(destState, { recursive: true });
    
    // Create gitignored keep files
    await fs.writeFile(path.join(destArtifacts, '.keep'), '');
    await fs.writeFile(path.join(destState, '.keep'), '');
    
    // Handle Root Files
    // .aiignore
    const srcAiignore = path.join(templateRoot, '.aiignore');
    const destAiignore = path.join(targetDir, '.aiignore');
    let aiignoreContent = '';
    try {
      aiignoreContent = await fs.readFile(srcAiignore, 'utf-8');
    } catch {
      // Fallback default
      aiignoreContent = `# Agent standard ignores\nnode_modules/\nbuild/\ndist/\n.git/\n\n# Unignore agent directories explicitly so tools can index them\n!.agents/\n!.agents/**/*\n!AGENTS.md\n`;
    }
    await fs.writeFile(destAiignore, aiignoreContent);
    console.log('✓ Wrote .aiignore (configured to unignore .agents/)');
    
    // AGENTS.md
    const srcAgentsMd = path.join(templateRoot, 'AGENTS.md');
    const destAgentsMd = path.join(targetDir, 'AGENTS.md');
    let agentsMdContent = await fs.readFile(srcAgentsMd, 'utf-8');
    
    let agentsMdExists = false;
    try {
      await fs.access(destAgentsMd);
      agentsMdExists = true;
    } catch {}
    
    if (agentsMdExists && !overwriteMode) {
      // Safe Merge mode
      let existingContent = await fs.readFile(destAgentsMd, 'utf-8');
      if (existingContent.includes('UNIVERSAL AGENT DIRECTIVES')) {
        console.log('! AGENTS.md already contains the universal directives block. Skipping merge.');
      } else {
        const mergedContent = `${existingContent}\n\n# --- UNIVERSAL AGENT DIRECTIVES ---\n\n${agentsMdContent}`;
        await fs.writeFile(destAgentsMd, mergedContent);
        console.log('✓ Integrated universal directives into existing AGENTS.md');
      }
    } else {
      // Overwrite/Write new
      await fs.writeFile(destAgentsMd, agentsMdContent);
      console.log('✓ Wrote AGENTS.md');
    }
    
    // Handle Skills (Compile with Includes)
    for (const file of selectedFiles) {
      const srcFile = path.join(templateSkills, file);
      const destFile = path.join(destSkills, file);
      
      try {
        const compiled = await compileTemplate(srcFile, templateShared);
        await fs.writeFile(destFile, compiled);
        console.log(`✓ Compiled and wrote skill: ${file}`);
      } catch (err) {
        console.error(`✗ Error processing skill ${file}: ${err.message}`);
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
        console.log(`✓ Copied ${scriptsCopied} utility scripts to .agents/scripts/`);
      }
    } catch {}
    
    console.log('\n=============================================');
    console.log('   Installation completed successfully!      ');
    console.log('=============================================\n');
    
  } catch (err) {
    console.error(`✗ Installation failed: ${err.message}`);
  } finally {
    rl.close();
  }
}

main();

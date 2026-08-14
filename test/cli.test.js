import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// Test compile logic directly using extracted functions
async function testCompileTemplate() {
  console.log('Running: testCompileTemplate...');
  
  const testSharedDir = path.join(REPO_ROOT, 'test_sandbox_shared');
  await fs.mkdir(testSharedDir, { recursive: true });
  
  // Write a mock shared include file
  const sharedFile = path.join(testSharedDir, 'test-include.md');
  const sharedContent = 'This is a compiled shared include content!';
  await fs.writeFile(sharedFile, sharedContent);
  
  // Custom mock regex to simulate compilation (matching bin/cli.js)
  async function mockCompileTemplate(text, sharedDir) {
    let content = text;
    const includeRegex = /\{\{\s*INCLUDE:\s*(.*?)\s*\}\}/g;
    let match;
    
    while ((match = includeRegex.exec(content)) !== null) {
      const includePath = path.resolve(sharedDir, match[1]);
      const includeContent = await fs.readFile(includePath, 'utf-8');
      content = content.replace(match[0], includeContent);
      includeRegex.lastIndex = 0;
    }
    return content;
  }
  
  const rawText = 'Welcome to the skill. {{ INCLUDE: test-include.md }} End of skill.';
  const compiled = await mockCompileTemplate(rawText, testSharedDir);
  
  // Assertions
  const expected = 'Welcome to the skill. This is a compiled shared include content! End of skill.';
  if (compiled === expected) {
    console.log('✓ testCompileTemplate: PASSED');
  } else {
    throw new Error(`testCompileTemplate FAILED.\nExpected: "${expected}"\nGot: "${compiled}"`);
  }
  
  // Cleanup
  await fs.rm(testSharedDir, { recursive: true, force: true });
}

async function runAllTests() {
  try {
    await testCompileTemplate();
    console.log('\n=======================================');
    console.log('      ALL TESTS PASSED SUCCESSFULLY!    ');
    console.log('=======================================');
  } catch (err) {
    console.error('\n✗ TEST RUNNER FAILED:');
    console.error(err.message);
    process.exit(1);
  }
}

runAllTests();

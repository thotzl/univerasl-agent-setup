import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const HOOK_PATH = path.join(REPO_ROOT, ".git", "hooks", "pre-commit");

const HOOK_CONTENT = `#!/bin/sh
# ==============================================================================
#                 Universal Pre-Commit Verification Hook
# ==============================================================================
# This hook automatically runs formatting (Prettier) on staged assets and verifies
# that all test suites pass. If tests fail, the commit is aborted.

echo ""
echo "====================================================="
echo "   Running Pre-Commit Formatting & Verification      "
echo "====================================================="
echo ""

# 1. Run Prettier formatting
if command -v npx >/dev/null 2>&1; then
  echo "Executing Prettier formatting..."
  npx prettier --write .
  
  # Re-stage any files that Prettier modified during formatting
  git add .
else
  echo "Warning: npx/Prettier not found. Skipping auto-formatting."
fi

# 2. Run Test Suites
echo "Running E2E and compliance verification..."
npm test
TEST_RESULT=$?

if [ $TEST_RESULT -ne 0 ]; then
  echo ""
  echo "✗ Error: Verification failed! Commit aborted."
  echo "====================================================="
  echo ""
  exit 1
fi

echo ""
echo "✓ Verification successful! Proceeding with commit."
echo "====================================================="
echo ""
exit 0
`;

async function installHook() {
  try {
    const gitDir = path.join(REPO_ROOT, ".git");
    await fs.access(gitDir); // Ensure we are inside a git repo

    const hooksDir = path.join(gitDir, "hooks");
    await fs.mkdir(hooksDir, { recursive: true });

    await fs.writeFile(HOOK_PATH, HOOK_CONTENT);
    await fs.chmod(HOOK_PATH, 0o755); // Mark as executable
    console.log(
      "✓ Git pre-commit hook successfully installed at .git/hooks/pre-commit",
    );
  } catch (err) {
    console.warn(
      `Warning: Could not install Git pre-commit hook (likely not a Git workspace): ${err.message}`,
    );
  }
}

installHook();

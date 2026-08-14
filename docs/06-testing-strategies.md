# 06 - Testing Strategies

## Developer Overview

The **Testing Strategies** module introduces unyielding commandments for code verification, mandating a reproduction-first approach and clear testing boundaries.

### Why This Skill Exists

Agents frequently claim success without running or writing tests, or write slow, flaky end-to-end (E2E) integration tests for simple logical checks that should be handled by lightweight unit tests.

---

## Practical Impact

When active, the agent adheres to these strict testing boundaries:

1. **Reproduction-First Bugfixing:**
   The agent is forbidden from applying a bugfix or patch without first writing an automated test case that successfully reproduces the reported error or failure.
2. **Right-Lane Test Allocation:**
   Tests must be allocated to the correct testing tier. Heavy, slow E2E or integration tests must never be used to verify basic logical units. This keeps your CI/CD pipelines running at maximum velocity.
3. **Surgical Mocking Boundaries:**
   Mocks must be restricted to external third-party APIs or network-level resources. The agent is discouraged from mocking internal business models, which often hides database or typing regressions.
4. **Test Isolation Assurance:**
   Test suites must have zero cross-test state dependencies. The agent must cleanly dismantle mock states and reset local test databases between individual test runs.

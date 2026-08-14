# 09 - Browser Automation

## Developer Overview

The **Browser Automation** module provides advanced workflows and guidelines for interacting with live web applications and inspecting browser-side states (such as Redux, Zustand, or global singletons).

### Why This Skill Exists
Agents often struggle with UI automation because they guess DOM CSS classes or volatile selectors, leading to fragile, flaky scripts. Furthermore, they are often unaware that they can inspect global singletons directly instead of scraping the DOM.

---

## Practical Impact

When active, this skill structures browser automation into a strict hierarchy:

1. **Protocol-First (WebMCP):**
   The agent must first check if the page exposes a structured WebMCP API for agents. If available, it executes actions programmatically using clean, schema-verified WebMCP tool calls, completely bypassing the UI.
2. **State-First Inspection (JS Injection):**
   If the agent needs to analyze application data or active routes, it evaluates global state variables (e.g. `window.store` for Redux) by injecting a JavaScript snippet, reading state values with 100% precision instead of scraping text from HTML elements.
3. **Robust Accessibility (A11y) Snapshots:**
   If UI interaction is necessary, the agent retrieves a text-based Accessibility tree snapshot first, identifying and clicking buttons/inputs strictly by their unique snapshot identifiers (`uid`). Volatile, randomized, or utility-heavy CSS classes are ignored.
4. **Console-First Debugging:**
   If a frontend interaction fails, the agent reads browser console logs immediately to pinpoint the exact failure (e.g., uncaught network-errors) rather than guessing or modifying project source code.

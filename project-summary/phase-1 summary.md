# Phase 1: Project Setup & Foundation - Summary

## Overview

Phase 1 established the foundational structure for the Playwright showcase repository. We initialized the project, configured TypeScript, set up Playwright, created test data files, and verified everything works with a "hello world" test.

---

## What We Built

### 1. Project Initialization
- **File:** `package.json`
- **What it does:** Manages project dependencies and scripts
- **Key dependencies installed:**
  - `@playwright/test` - Playwright testing framework
  - `typescript` - TypeScript compiler
  - `@types/node` - TypeScript type definitions for Node.js

### 2. TypeScript Configuration
- **File:** `tsconfig.json`
- **What it does:** Configures how TypeScript compiles your code
- **Key settings:**
  - `target: ES2022` - Compile to modern JavaScript
  - `module: commonjs` - Use Node.js module system
  - `strict: true` - Enable strict type checking
  - `resolveJsonModule: true` - Allow importing JSON files
  - Includes: tests, pages, fixtures, utils folders

### 3. Playwright Configuration
- **File:** `playwright.config.ts`
- **What it does:** Configures how Playwright runs tests
- **Key settings:**
  - `baseURL: 'https://www.saucedemo.com'` - Target website
  - `timeout: 30000` - 30 seconds per test
  - `fullyParallel: true` - Run tests in parallel
  - `reporter: 'html'` - Generate HTML test reports
  - **3 browser projects:** Chromium, Firefox, WebKit
  - Screenshots and videos on failure

### 4. Test Data Files
- **File:** `test-data/users.json`
  - Contains SauceDemo user credentials
  - Valid users: standard_user, problem_user, performance_glitch_user
  - Locked out user for negative testing
  - Invalid user for error testing

- **File:** `test-data/products.json`
  - Contains product information from SauceDemo
  - 6 products with IDs, names, prices, descriptions
  - Will be used for data-driven tests in later phases

### 5. First Test File
- **File:** `tests/hello-world.spec.ts`
- **What it does:** Verifies the Playwright setup is working
- **Tests included:**
  1. `hello world - verify SauceDemo homepage loads`
     - Navigates to homepage
     - Checks page title contains "Swag Labs"
     - Verifies login form elements are visible
  
  2. `verify login form elements`
     - Checks username input is visible
     - Checks password input is visible
     - Checks login button is visible
     - Verifies placeholder text

### 6. Project Structure Created
```
playwright-saucelabs/
├── .gitignore
├── project-summary/
│    ├── overview.md
│    └── phase-1-summary.md (this file)
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── test-data/
│   ├── users.json
│   └── products.json
└── tests/
    └── hello-world.spec.ts
```

---

## TypeScript Concepts Learned

### 1. **Imports and Exports**
```typescript
import { test, expect } from '@playwright/test';
export default defineConfig({ ... });
```
- `import { }` - Import specific named exports
- `export default` - Export the main thing from a file

### 2. **Async/Await**
```typescript
async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Swag Labs/);
}
```
- `async` - Function that returns a Promise
- `await` - Wait for a Promise to complete before continuing

### 3. **Arrow Functions**
```typescript
({ page }) => { ... }
```
- Modern JavaScript function syntax
- Shorter than `function() { }`

### 4. **Object Destructuring**
```typescript
async ({ page }) => { ... }
```
- Extracts the `page` property from the object Playwright provides
- Instead of: `async (context) => { const page = context.page; }`

### 5. **Type Inference**
```typescript
const usernameInput = page.locator('#user-name');
```
- TypeScript automatically knows `usernameInput` is type `Locator`
- No need to write: `const usernameInput: Locator = ...`

### 6. **Basic Types**
- **String:** `'hello world'` - Text in quotes
- **Number:** `30 * 1000` - Numeric values
- **Boolean:** `true` or `false`
- **Undefined:** `undefined` - No value set

### 7. **Ternary Operator**
```typescript
retries: process.env.CI ? 2 : 0
```
- Shorthand for if/else: `condition ? ifTrue : ifFalse`

### 8. **Spread Operator**
```typescript
use: { ...devices['Desktop Chrome'] }
```
- `...` copies all properties from one object to another

### 9. **Const vs Let**
- `const` - Variable that cannot be reassigned
- `let` - Variable that can be reassigned
- Always prefer `const` unless you need to reassign

---

## Test Results

```bash
$ npx playwright test hello-world.spec.ts

Running 6 tests using 6 workers
  6 passed (12.0s)

To open last HTML report run:
  npx playwright show-report
```

**Why 6 tests?**
- 2 test cases in the file
- × 3 browsers (Chromium, Firefox, WebKit)
- = 6 total test runs

All tests passed successfully! ✅

---

## Commands Used

### Installation
```bash
npm init -y                                    # Initialize package.json
npm install -D @playwright/test typescript     # Install Playwright and TypeScript
npx playwright install                         # Install browser binaries
```

### Running Tests
```bash
npx playwright test                            # Run all tests
npx playwright test hello-world.spec.ts        # Run specific test file
npx playwright show-report                     # Open HTML test report
npx playwright test --headed                   # Run tests with browser visible
npx playwright test --project=chromium         # Run tests in specific browser
```

---

## Key Files Explained

### tsconfig.json
Controls TypeScript compilation:
- **target:** JavaScript version to compile to
- **module:** Module system (CommonJS for Node.js)
- **strict:** Enable strict type checking (catches more errors)
- **include/exclude:** Which files to compile

### playwright.config.ts
Controls Playwright test execution:
- **testDir:** Where test files are located
- **baseURL:** Default URL for tests
- **timeout:** How long tests can run
- **projects:** Which browsers to test in
- **reporter:** How to display results

### package.json
Manages project dependencies:
- **dependencies:** Packages needed to run the project
- **devDependencies:** Packages needed only for development
- **scripts:** Commands you can run with `npm run`

---

## What's Next?

**Phase 2: Page Object Models (POM)**

In the next phase, we'll:
- Learn TypeScript **classes** and **constructors**
- Learn TypeScript **interfaces** for defining object shapes
- Create 5 Page Object Models for SauceDemo pages:
  - LoginPage
  - InventoryPage
  - ProductPage
  - CartPage
  - CheckoutPage
- Understand the POM pattern and why it's useful
- Practice encapsulating page interactions

---

## Questions to Review

Before moving to Phase 2, make sure you understand:

1. ✅ What is `async/await` and why do we use it?
2. ✅ What does `import { test, expect }` do?
3. ✅ What is the difference between `const` and `let`?
4. ✅ What does `await page.goto('/')` do?
5. ✅ Why did we get 6 test results from 2 tests?
6. ✅ What is `baseURL` in playwright.config.ts?
7. ✅ What does the spread operator `...` do?

---

## Useful Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Async/Await Guide](https://javascript.info/async-await)
- [SauceDemo Test Site](https://www.saucedemo.com)

---

**Phase 1 Status:** ✅ Complete  
**Ready for Phase 2:** Yes  
**All Tests Passing:** Yes (6/6)

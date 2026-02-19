# <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="38" style="vertical-align: middle;" /> Playwright Test Automation Repository

A portfolio-ready Playwright + TypeScript automation framework built against SauceDemo.

It demonstrates production-style test architecture and practical QA workflows you can clone, run, and extend locally.

## Project Overview

**Target Site:** https://www.saucedemo.com/  
**Language:** TypeScript (with learning explanations)  
**Approach:** Hybrid structure (feature-based + concept showcase tests)  
**Pattern:** Primarily Page Object Model (POM), with some non-POM examples to demonstrate judgment

Project structure details live in [project-summary/overview.md](project-summary/overview.md).

## Highlights

- **90+ tests** across feature, API, visual, and accessibility coverage
- **3-browser execution** (Chromium, Firefox, WebKit)
- **Built-in reporting and artifacts** (HTML report, traces, screenshots, videos)

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run specific test suite
npx playwright test login.spec.ts

# Run with browser visible
npx playwright test --headed

# Run in Playwright UI mode
npx playwright test --ui

# View test report
npx playwright show-report
```

## Showcase Web Page

This repository includes a lightweight project showcase page at [`site/index.html`](site/index.html), with curated visual snapshot examples and a short test-run clip.

### View Locally

```bash
# Option 1: open directly in your browser
open site/index.html

# Option 2: run a simple static server
python3 -m http.server 4173 --directory site
```

## Test Implementation Reference Guide

Use this as a quick lookup when building a new test. Start from the closest example and adapt it.

| If you need to implement... | Reference example | Notes |
| --- | --- | --- |
| Login happy path + negative auth cases | [`tests/login.spec.ts`](tests/login.spec.ts) | Covers valid users, locked user, empty-field validation, and UI assertions |
| Product catalog checks (sorting, cart count, add/remove) | [`tests/inventory.spec.ts`](tests/inventory.spec.ts) | Good patterns for data-driven assertions and cart state checks |
| Full checkout journeys | [`tests/end-to-end.spec.ts`](tests/end-to-end.spec.ts) | End-to-end flows from login to order completion |
| API request testing (GET/POST/PUT/DELETE) | [`tests/api.spec.ts`](tests/api.spec.ts) | Request context usage, headers/params, and response validation |
| Visual regression and screenshot assertions | [`tests/visual.spec.ts`](tests/visual.spec.ts) | Element/page snapshots, masking, thresholds, responsive checks |
| Accessibility checks (keyboard, ARIA, semantics) | [`tests/accessibility.spec.ts`](tests/accessibility.spec.ts) | Practical baseline accessibility patterns |
| Basic Playwright syntax starter | [`tests/hello-world.spec.ts`](tests/hello-world.spec.ts) | Lightweight example for new test scaffolding |

### Supporting Reuse Files

- **Page Objects:** [`pages/`](pages/) (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`, `ProductPage`)
- **Utilities:** [`utils/test-helpers.ts`](utils/test-helpers.ts)
- **Test Data:** [`test-data/users.json`](test-data/users.json), [`test-data/products.json`](test-data/products.json)

Tip: run one file while iterating with `npx playwright test tests/<file>.spec.ts --project=chromium`.


## Current Scope

- Production-style Playwright + TypeScript framework
- 5 page objects (POM) supporting end-to-end user journeys
- Feature, API, visual, and accessibility test suites
- Reusable fixtures and helper utilities for maintainable tests
- Cross-browser execution and HTML reporting

## Further Reading

For build details and full project documentation:
- [Project Overview](project-summary/overview.md)
- [Phase Summaries](project-summary/)


## Key Features Implemented

### Core Playwright Functionality
- **Actions** - Click, fill, select, keyboard navigation, focus management
- **Assertions** - Visibility, text content, attributes, state, URL, count comparisons
- **Locators** - CSS selectors, data-test attributes, text content, chaining, nth()
- **Waits** - Auto-waiting, waitFor(), explicit timeouts

### Advanced Features
- **Page Object Model** - 5 comprehensive page objects (~1,290 lines)
- **Custom Fixtures** - Authenticated state, automatic page object creation
- **API Testing** - GET, POST, PUT, DELETE with validation patterns
- **Visual Regression** - Screenshot comparison with masking and thresholds
- **Accessibility Testing** - Keyboard navigation, ARIA, WCAG patterns
- **Test Helpers** - 25+ utility functions for DRY code
- **Test Hooks** - beforeEach for setup, test.describe for organization
- **Data-Driven Tests** - JSON test data (users, products)
- **Cross-Browser** - Chromium, Firefox, WebKit configured
- **Responsive Testing** - Multiple viewport sizes in visual tests
- **Reporting** - HTML reporter with screenshots/videos on failure
- **Trace Debugging** - Playwright traces for failure investigation

## Project Statistics

- **Total Files Created:** 20+
- **Total Lines of Code:** ~3,000+
- **Page Objects:** 5 (~1,290 lines)
- **Test Files:** 8
- **Helper Functions:** 25+
- **Test Runs:** 273 (91 tests × 3 browsers)
- **Documentation:** 4 comprehensive phase summaries + this README

## Acknowledgments

This repository was built by me with assistance from AI coding tools for planning, implementation support, and documentation refinement.

## Disclaimer

This is an independent educational and portfolio project. It is not affiliated with, endorsed by, or sponsored by Microsoft or the Playwright team. "Playwright" is a trademark of Microsoft.

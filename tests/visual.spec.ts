/**
 * VISUAL COMPARISON TESTING
 * 
 * Playwright can capture screenshots and compare them to detect visual changes.
 * This is useful for:
 * - Detecting unintended visual changes
 * - Verifying responsive design
 * - Cross-browser visual consistency
 * - Component visual testing
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Screenshot options
 * - Visual comparison assertions
 * - Viewport configuration
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import users from '../test-data/users.json';

test.describe('Visual Regression Tests', () => {

  test('login page visual snapshot', async ({ page }) => {
    // TYPESCRIPT: Navigate to page
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // TYPESCRIPT: Take screenshot and compare to baseline
    // First run creates baseline, subsequent runs compare
    await expect(page).toHaveScreenshot('login-page.png');
    
    // If visual differences are detected, test fails
    // Playwright shows a diff image highlighting changes
  });

  test('inventory page visual snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Login first
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // Wait for page to load
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('inventory-page.png', {
      fullPage: true
    });
  });

  test('specific element visual snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // TYPESCRIPT: Screenshot a specific element
    await expect(loginPage.usernameInput).toHaveScreenshot('username-input.png');
    await expect(loginPage.loginButton).toHaveScreenshot('login-button.png');
  });

  test('visual snapshot with mask', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // TYPESCRIPT: Mask dynamic content that changes between runs
    // Useful for timestamps, random IDs, etc.
    await expect(page).toHaveScreenshot('inventory-masked.png', {
      mask: [inventoryPage.shoppingCartBadge], // Mask cart badge (changes)
      fullPage: true
    });
  });

  test('visual snapshot with custom threshold', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // TYPESCRIPT: Allow small differences (anti-aliasing, fonts, etc.)
    await expect(page).toHaveScreenshot('login-with-threshold.png', {
      maxDiffPixels: 100, // Allow up to 100 pixels difference
    });
  });

  test('visual snapshot with animations disabled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // TYPESCRIPT: Disable animations for consistent screenshots
    await expect(page).toHaveScreenshot('login-no-animations.png', {
      animations: 'disabled'
    });
  });
});

test.describe('Responsive Design Visual Tests', () => {

  test('mobile viewport snapshot', async ({ page }) => {
    // TYPESCRIPT: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    await expect(page).toHaveScreenshot('login-mobile.png');
  });

  test('tablet viewport snapshot', async ({ page }) => {
    // TYPESCRIPT: Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    await expect(page).toHaveScreenshot('login-tablet.png');
  });

  test('desktop viewport snapshot', async ({ page }) => {
    // TYPESCRIPT: Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    await expect(page).toHaveScreenshot('login-desktop.png');
  });

  test('compare multiple viewports', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // TYPESCRIPT: Test multiple viewports in one test
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      await expect(page).toHaveScreenshot(`login-${viewport.name}.png`);
    }
  });
});

test.describe('Component Visual Tests', () => {

  test('product card visual snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // TYPESCRIPT: Screenshot first product card
    const firstProduct = inventoryPage.getProductItems().first();
    await expect(firstProduct).toHaveScreenshot('product-card.png');
  });

  test('error message visual snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('invalid', 'invalid');
    
    // Wait for error to appear
    await expect(loginPage.errorMessage).toBeVisible();
    
    // Screenshot the error message
    await expect(loginPage.errorMessage).toHaveScreenshot('error-message.png');
  });

  test('cart badge visual snapshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // Add item to cart
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    
    // Screenshot cart badge with count
    await expect(inventoryPage.shoppingCartBadge).toHaveScreenshot('cart-badge-with-item.png');
  });
});

test.describe('State-Based Visual Tests', () => {

  test('button states visual comparison', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    const addButton = inventoryPage.getAddToCartButton('Sauce Labs Backpack');
    
    // Screenshot "Add to cart" state
    await expect(addButton).toHaveScreenshot('button-add-state.png');
    
    // Click button
    await addButton.click();
    
    // Screenshot "Remove" state
    const removeButton = inventoryPage.getRemoveButton('Sauce Labs Backpack');
    await expect(removeButton).toHaveScreenshot('button-remove-state.png');
  });

  test('sorted products visual comparison', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // Screenshot default sort
    await expect(page).toHaveScreenshot('products-default-sort.png', {
      fullPage: true
    });
    
    // Sort by price
    await inventoryPage.sortProducts('lohi');
    
    // Screenshot price sort
    await expect(page).toHaveScreenshot('products-price-sort.png', {
      fullPage: true
    });
  });
});

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. SCREENSHOT ASSERTION:
 *    await expect(page).toHaveScreenshot('name.png')
 *    Captures and compares screenshot
 * 
 * 2. SCREENSHOT OPTIONS:
 *    fullPage: true - Capture entire page
 *    mask: [locator] - Hide dynamic elements
 *    maxDiffPixels: number - Tolerance for differences
 *    animations: 'disabled' - Disable animations
 * 
 * 3. ELEMENT SCREENSHOTS:
 *    await expect(element).toHaveScreenshot('name.png')
 *    Screenshot specific element only
 * 
 * 4. VIEWPORT CONFIGURATION:
 *    page.setViewportSize({ width, height })
 *    Test different screen sizes
 * 
 * 5. ARRAY OF OBJECTS:
 *    const viewports = [{ name: 'mobile', width: 375 }]
 *    Test multiple configurations
 * 
 * VISUAL TESTING WORKFLOW:
 * 
 * 1. FIRST RUN (Generate Baselines):
 *    npx playwright test visual.spec.ts
 *    Creates baseline screenshots in test-results/
 * 
 * 2. SUBSEQUENT RUNS (Compare):
 *    npx playwright test visual.spec.ts
 *    Compares to baselines, fails if different
 * 
 * 3. UPDATE BASELINES:
 *    npx playwright test visual.spec.ts --update-snapshots
 *    Updates baselines with new screenshots
 * 
 * 4. VIEW DIFFERENCES:
 *    Playwright generates diff images showing changes
 *    Check test-results/ folder for diffs
 * 
 * BEST PRACTICES:
 * 
 * ✅ Disable animations for consistency
 * ✅ Mask dynamic content (timestamps, IDs)
 * ✅ Use appropriate thresholds
 * ✅ Test multiple viewports
 * ✅ Screenshot stable states
 * ✅ Commit baselines to version control
 * 
 * WHEN TO USE VISUAL TESTS:
 * 
 * - Detecting CSS regressions
 * - Verifying responsive design
 * - Testing component appearance
 * - Cross-browser visual consistency
 * - Catching unintended UI changes
 * 
 * LIMITATIONS:
 * 
 * ⚠️ Can be flaky (fonts, rendering)
 * ⚠️ Baselines need maintenance
 * ⚠️ Large baseline files
 * ⚠️ Slower than functional tests
 * ⚠️ Platform-specific rendering
 * 
 * TIPS:
 * 
 * - Use maxDiffPixels for small differences
 * - Mask dynamic content
 * - Test on consistent environment
 * - Keep baselines in git
 * - Review diffs carefully
 * 
 * RUNNING VISUAL TESTS:
 * 
 * # Generate baselines (first time)
 * npx playwright test visual.spec.ts
 * 
 * # Run visual tests
 * npx playwright test visual.spec.ts
 * 
 * # Update baselines
 * npx playwright test visual.spec.ts --update-snapshots
 * 
 * # Run in specific browser
 * npx playwright test visual.spec.ts --project=chromium
 * 
 * Note: Visual tests create baseline images on first run.
 * Subsequent runs compare against these baselines.
 * Use --update-snapshots to update baselines when changes are intentional.
 */

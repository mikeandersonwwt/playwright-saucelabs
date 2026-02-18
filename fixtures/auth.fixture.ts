/**
 * AUTHENTICATION FIXTURE
 * 
 * Fixtures are a powerful Playwright feature that allows you to:
 * - Set up reusable test context
 * - Share state between tests
 * - Automatically handle setup and teardown
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Extending base test
 * - Type definitions for fixtures
 * - Async fixture functions
 */

import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProductPage } from '../pages/ProductPage';
import users from '../test-data/users.json';

// TYPESCRIPT LEARNING: TYPE DEFINITION FOR FIXTURES
// This interface defines what fixtures are available in tests
// Each property is a fixture that tests can use
type AuthFixtures = {
  // Page objects - automatically created for each test
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
  
  // Authenticated page - already logged in
  authenticatedPage: Page;
};

// TYPESCRIPT LEARNING: EXTENDING THE BASE TEST
// We extend Playwright's base test with our custom fixtures
// This creates a new 'test' object with our fixtures available
export const test = base.extend<AuthFixtures>({
  
  // FIXTURE: loginPage
  // Automatically creates a LoginPage instance for each test
  loginPage: async ({ page }, use) => {
    // TYPESCRIPT: 'use' is a function that provides the fixture to the test
    // The test runs while 'use' is active, then cleanup happens after
    const loginPage = new LoginPage(page);
    await use(loginPage);
    // Cleanup code would go here if needed
  },

  // FIXTURE: inventoryPage
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  // FIXTURE: cartPage
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  // FIXTURE: checkoutPage
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  // FIXTURE: productPage
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },

  // FIXTURE: authenticatedPage
  // This is a special fixture that provides a page that's already logged in
  // This saves time by not having to login in every test
  authenticatedPage: async ({ page }, use) => {
    // Perform login
    const loginPage = new LoginPage(page);
    const user = users.validUsers[0];
    
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    
    // Wait for inventory page to ensure login is complete
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.inventoryContainer.waitFor({ state: 'visible' });
    
    // Provide the authenticated page to the test
    await use(page);
    
    // Cleanup: logout after test (optional)
    // await inventoryPage.logout();
  },
});

// TYPESCRIPT LEARNING: EXPORT EXPECT
// Re-export expect so tests can import both test and expect from this file
export { expect } from '@playwright/test';

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. TYPE DEFINITIONS:
 *    type AuthFixtures = { ... }
 *    Defines the shape of our fixtures object
 * 
 * 2. EXTENDING TYPES:
 *    base.extend<AuthFixtures>({ ... })
 *    Adds our fixtures to the base test type
 * 
 * 3. ASYNC FIXTURE FUNCTIONS:
 *    async ({ page }, use) => { ... }
 *    Fixtures are async functions that set up and tear down
 * 
 * 4. USE FUNCTION:
 *    await use(value)
 *    Provides the fixture value to the test
 * 
 * 5. DESTRUCTURING:
 *    async ({ page }, use)
 *    Extract page from the context object
 * 
 * HOW TO USE FIXTURES:
 * 
 * // Import from fixture file instead of @playwright/test
 * import { test, expect } from '../fixtures/auth.fixture';
 * 
 * // Use page objects directly - no need to create them
 * test('example', async ({ loginPage, inventoryPage }) => {
 *   await loginPage.goto();
 *   await loginPage.login('user', 'pass');
 *   await inventoryPage.addProductToCart('product');
 * });
 * 
 * // Use authenticated page - already logged in
 * test('example', async ({ authenticatedPage, inventoryPage }) => {
 *   // Already logged in, start testing immediately
 *   await inventoryPage.addProductToCart('product');
 * });
 * 
 * BENEFITS OF FIXTURES:
 * 
 * ✅ Reduce boilerplate code
 * ✅ Automatic setup and teardown
 * ✅ Share state between tests
 * ✅ Type-safe with TypeScript
 * ✅ Composable - fixtures can use other fixtures
 * ✅ Lazy - only created when needed
 * 
 * FIXTURE LIFECYCLE:
 * 
 * 1. Test starts
 * 2. Fixture setup runs (before 'use')
 * 3. Test code runs (during 'use')
 * 4. Fixture teardown runs (after 'use')
 * 5. Test ends
 */

/**
 * LOGIN FEATURE TESTS
 * 
 * This file tests the login functionality of SauceDemo.
 * We're using the LoginPage POM we created in Phase 2.
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Test structure and organization
 * - Using Page Object Models in tests
 * - Assertions and expectations
 * - Test data usage
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import users from '../test-data/users.json';

// TYPESCRIPT LEARNING: test.describe()
// Groups related tests together
// This creates a test suite for login functionality
test.describe('Login Feature', () => {
  
  // TYPESCRIPT LEARNING: test.beforeEach()
  // Runs before each test in this describe block
  // Used for common setup that all tests need
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // POSITIVE TEST CASES - Testing expected/happy path behavior

  test('should login successfully with valid credentials', async ({ page }) => {
    // TYPESCRIPT: Create instances of page objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // TYPESCRIPT: Access properties from imported JSON
    // users.validUsers[0] gets the first valid user object
    const user = users.validUsers[0];
    
    // Perform login
    await loginPage.login(user.username, user.password);
    
    // TYPESCRIPT LEARNING: ASSERTIONS
    // expect() is used to verify expected outcomes
    // These are the actual test checks
    
    // Verify we're on the inventory page
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    
    // Verify the URL changed to inventory page
    await expect(page).toHaveURL(/inventory.html/);
    
    // Verify we can see products
    const productCount = await inventoryPage.getProductItems().count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should login with all valid user types', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // TYPESCRIPT: for...of loop through array
    // Test each valid user can login
    for (const user of users.validUsers) {
      // Login with this user
      await loginPage.login(user.username, user.password);
      
      // Verify successful login
      await expect(inventoryPage.inventoryContainer).toBeVisible();
      
      // Logout to test next user
      await inventoryPage.logout();
      
      // Wait for login page to appear
      await expect(loginPage.loginButton).toBeVisible();
    }
  });

  test('should display username in input field after typing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const testUsername = 'test_user';
    
    // Fill username
    await loginPage.fillUsername(testUsername);
    
    // TYPESCRIPT LEARNING: inputValue() gets the value of an input field
    const inputValue = await loginPage.usernameInput.inputValue();
    
    // Verify the value matches what we typed
    expect(inputValue).toBe(testUsername);
  });

  // NEGATIVE TEST CASES - Testing error conditions

  test('should show error with invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Use invalid credentials from test data
    const invalidUser = users.invalidUser;
    
    // Attempt login with invalid credentials
    await loginPage.login(invalidUser.username, invalidUser.password);
    
    // Verify error message appears
    await expect(loginPage.errorMessage).toBeVisible();
    
    // Verify error message contains expected text
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
    
    // Verify we're still on login page (not redirected)
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should show error with locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Use locked out user from test data
    const lockedUser = users.lockedOutUser;
    
    // Attempt login
    await loginPage.login(lockedUser.username, lockedUser.password);
    
    // Verify specific error message for locked out user
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Sorry, this user has been locked out');
    
    // Verify error message is visible
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should show error when username is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Try to login with empty username
    await loginPage.login('', 'secret_sauce');
    
    // Verify error message
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username is required');
  });

  test('should show error when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Try to login with empty password
    await loginPage.login('standard_user', '');
    
    // Verify error message
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Password is required');
  });

  test('should show error when both fields are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Try to login with both fields empty
    await loginPage.login('', '');
    
    // Verify error message
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username is required');
  });

  // UI VERIFICATION TESTS

  test('should display all login form elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // TYPESCRIPT: Multiple assertions to verify UI elements
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    
    // Verify input placeholders
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
    
    // Verify button text
    await expect(loginPage.loginButton).toHaveValue('Login');
  });

  test('should have correct input types', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Verify username is text input
    await expect(loginPage.usernameInput).toHaveAttribute('type', 'text');
    
    // Verify password is password input (hidden)
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  // INTERACTION TESTS

  test('should be able to clear username field', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Fill username
    await loginPage.fillUsername('test_user');
    
    // Clear it
    await loginPage.usernameInput.clear();
    
    // Verify it's empty
    const value = await loginPage.usernameInput.inputValue();
    expect(value).toBe('');
  });

  test('should allow clicking login button multiple times', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Fill invalid credentials
    await loginPage.fillUsername('invalid');
    await loginPage.fillPassword('invalid');
    
    // Click login multiple times
    await loginPage.clickLogin();
    await expect(loginPage.errorMessage).toBeVisible();
    
    // Click again
    await loginPage.clickLogin();
    await expect(loginPage.errorMessage).toBeVisible();
  });
});

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. TEST STRUCTURE:
 *    test.describe() - Group related tests
 *    test() - Individual test case
 *    test.beforeEach() - Setup before each test
 * 
 * 2. ASYNC/AWAIT:
 *    All test functions are async
 *    Use await for asynchronous operations
 * 
 * 3. ASSERTIONS:
 *    expect(value).toBe() - Exact equality
 *    expect(value).toContain() - String contains
 *    expect(element).toBeVisible() - Element visible
 *    expect(page).toHaveURL() - URL matches
 *    expect(number).toBeGreaterThan() - Numeric comparison
 * 
 * 4. IMPORTING:
 *    import { test, expect } - Playwright test functions
 *    import { LoginPage } - Our page object
 *    import users from '../test-data/users.json' - Test data
 * 
 * 5. OBJECT ACCESS:
 *    users.validUsers[0] - Array index access
 *    user.username - Object property access
 * 
 * 6. LOOPS:
 *    for (const user of users.validUsers) - Iterate array
 * 
 * 7. PAGE OBJECT USAGE:
 *    const loginPage = new LoginPage(page) - Create instance
 *    await loginPage.login() - Call methods
 *    loginPage.usernameInput - Access getters
 * 
 * 8. TEST ORGANIZATION:
 *    Positive tests (happy path)
 *    Negative tests (error cases)
 *    UI verification tests
 *    Interaction tests
 * 
 * RUNNING THESE TESTS:
 * 
 * npx playwright test login.spec.ts              # Run all login tests
 * npx playwright test login.spec.ts --headed     # Run with browser visible
 * npx playwright test login.spec.ts --project=chromium  # Run in specific browser
 * npx playwright test login.spec.ts --grep "invalid"    # Run tests matching pattern
 */

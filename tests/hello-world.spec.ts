// TYPESCRIPT LEARNING: Import statement
// We're importing 'test' and 'expect' from the Playwright test library
// - test: A function to define a test case
// - expect: A function to make assertions (check if something is true)
// TYPESCRIPT: The curly braces {} mean we're importing specific named exports
import { test, expect } from '@playwright/test';

/**
 * HELLO WORLD TEST
 * 
 * This is a simple test to verify our Playwright setup is working.
 * It will navigate to SauceDemo and check that the page loads correctly.
 * 
 * TYPESCRIPT CONCEPTS IN THIS FILE:
 * - Imports and exports
 * - Async/await (handling asynchronous operations)
 * - Function parameters with types
 * - String types
 */

// TYPESCRIPT: 'test()' is a function that takes parameters
// Parameter 1: A string describing what the test does
// Parameter 2: An async function that contains the test code
// TYPESCRIPT: 'async' means this function returns a Promise (handles asynchronous operations)
test('hello world - verify SauceDemo homepage loads', async ({ page }) => {
  // TYPESCRIPT: '{ page }' is object destructuring
  // Playwright automatically provides a 'page' object that represents a browser tab
  // The type of 'page' is 'Page' (defined by Playwright)
  
  // STEP 1: Navigate to the homepage
  // TYPESCRIPT: 'await' pauses execution until the navigation completes
  // page.goto() returns a Promise, so we need 'await'
  // We use '/' because we set baseURL in playwright.config.ts
  await page.goto('/');
  
  // STEP 2: Verify the page title
  // TYPESCRIPT: expect() is a function that takes a value to check
  // toHaveTitle() is a matcher that checks the page title
  // The regex /Swag Labs/ means "contains the text 'Swag Labs'"
  await expect(page).toHaveTitle(/Swag Labs/);
  
  // STEP 3: Verify the login form is visible
  // TYPESCRIPT: page.locator() returns a Locator object
  // '#user-name' is a CSS selector (# means ID)
  // toBeVisible() checks if the element is displayed on the page
  await expect(page.locator('#user-name')).toBeVisible();
  
  // STEP 4: Verify the login button exists
  await expect(page.locator('#login-button')).toBeVisible();
  
  // If all assertions pass, the test passes!
  // If any assertion fails, the test fails and shows which assertion failed
});

// TYPESCRIPT: Let's add another test to demonstrate test structure
test('verify login form elements', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  // TYPESCRIPT: We can store locators in variables
  // 'const' means this variable cannot be reassigned
  // The type is inferred as 'Locator' by TypeScript
  const usernameInput = page.locator('#user-name');
  const passwordInput = page.locator('#password');
  const loginButton = page.locator('#login-button');
  
  // Check all form elements are visible
  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(loginButton).toBeVisible();
  
  // TYPESCRIPT: We can also check attributes
  // getAttribute() returns a Promise<string | null>
  // The '|' means "or" - it can be a string OR null
  const placeholderText = await usernameInput.getAttribute('placeholder');
  
  // TYPESCRIPT: We need to check if placeholderText is not null before using it
  // This is TypeScript's null safety feature
  expect(placeholderText).toBe('Username');
});

/**
 * KEY TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. IMPORTS: Bringing in code from other files/packages
 *    import { test, expect } from '@playwright/test';
 * 
 * 2. ASYNC/AWAIT: Handling asynchronous operations
 *    async () => { await page.goto('/'); }
 * 
 * 3. ARROW FUNCTIONS: Modern JavaScript function syntax
 *    ({ page }) => { ... }
 * 
 * 4. OBJECT DESTRUCTURING: Extracting properties from objects
 *    { page } extracts the 'page' property
 * 
 * 5. TYPE INFERENCE: TypeScript automatically figures out types
 *    const usernameInput = page.locator('#user-name'); // Type: Locator
 * 
 * 6. PROMISES: Asynchronous operations that complete in the future
 *    page.goto() returns a Promise that resolves when navigation completes
 * 
 * 7. STRING TYPES: Text values in quotes
 *    'hello world - verify SauceDemo homepage loads'
 * 
 * 8. REGEX: Regular expressions for pattern matching
 *    /Swag Labs/ matches any string containing "Swag Labs"
 */

/**
 * LOGIN PAGE OBJECT MODEL
 * 
 * This is our first Page Object Model (POM) class.
 * A POM encapsulates all the elements and actions for a specific page.
 * 
 * BENEFITS OF POM:
 * - Reusability: Use the same login logic across multiple tests
 * - Maintainability: If the page changes, update only this file
 * - Readability: Tests become more readable (loginPage.login() vs multiple locators)
 * - Encapsulation: Hide implementation details from tests
 */

// TYPESCRIPT LEARNING: Import the Page type from Playwright
// 'Page' is a TypeScript type (interface) that represents a browser tab
// We use it to tell TypeScript what type our 'page' property is
import { Page } from '@playwright/test';

// TYPESCRIPT LEARNING: This is a CLASS
// A class is a blueprint for creating objects
// It can have properties (data) and methods (functions)
export class LoginPage {
  // TYPESCRIPT LEARNING: PROPERTIES (class variables)
  // 'readonly' means this property cannot be changed after it's set in the constructor
  // ': Page' is a type annotation - it tells TypeScript this is a Page object
  readonly page: Page;

  // TYPESCRIPT LEARNING: CONSTRUCTOR
  // A constructor is a special method that runs when you create a new instance of the class
  // It's used to initialize the object's properties
  // Syntax: constructor(parameters) { ... }
  constructor(page: Page) {
    // 'this.page' refers to the property above
    // 'page' (without 'this') refers to the parameter
    // We're storing the page parameter in the class property
    this.page = page;
  }

  // TYPESCRIPT LEARNING: LOCATOR GETTERS
  // These are 'getter' methods that return Playwright Locators
  // We use getters (get keyword) so we can access them like properties: loginPage.usernameInput
  // But they're actually methods that run each time, ensuring we get fresh locators
  
  // Why getters instead of properties?
  // Locators should be created fresh each time to avoid stale element references
  get usernameInput() {
    // Returns a Locator for the username input field
    // '#user-name' is a CSS selector (# means ID)
    return this.page.locator('#user-name');
  }

  get passwordInput() {
    return this.page.locator('#password');
  }

  get loginButton() {
    return this.page.locator('#login-button');
  }

  get errorMessage() {
    // This locator finds the error message that appears for invalid login
    return this.page.locator('[data-test="error"]');
  }

  // TYPESCRIPT LEARNING: ASYNC METHODS
  // These are methods that perform actions on the page
  // They're marked 'async' because they return Promises (asynchronous operations)
  // The return type ': Promise<void>' means they return a Promise with no value
  
  /**
   * Navigate to the login page
   * TYPESCRIPT: async method that returns Promise<void>
   * void means "no return value"
   */
  async goto(): Promise<void> {
    // Navigate to the base URL (set in playwright.config.ts)
    await this.page.goto('/');
  }

  /**
   * Perform login with username and password
   * TYPESCRIPT: This method takes two parameters, both strings
   * @param username - The username to enter (type: string)
   * @param password - The password to enter (type: string)
   */
  async login(username: string, password: string): Promise<void> {
    // Fill in the username field
    await this.usernameInput.fill(username);
    
    // Fill in the password field
    await this.passwordInput.fill(password);
    
    // Click the login button
    await this.loginButton.click();
  }

  /**
   * Get the error message text
   * TYPESCRIPT: Returns Promise<string | null>
   * The '|' means "or" - it can be a string OR null
   * It's null if the element doesn't exist or has no text
   */
  async getErrorMessage(): Promise<string | null> {
    // textContent() gets the text inside an element
    return await this.errorMessage.textContent();
  }

  /**
   * Check if we're on the login page
   * TYPESCRIPT: Returns Promise<boolean>
   * boolean means true or false
   */
  async isOnLoginPage(): Promise<boolean> {
    // Check if the login button is visible
    // This is a good way to verify we're on the right page
    return await this.loginButton.isVisible();
  }

  /**
   * Fill username only (useful for testing)
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Fill password only (useful for testing)
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }
}

/**
 * HOW TO USE THIS PAGE OBJECT IN A TEST:
 * 
 * import { test } from '@playwright/test';
 * import { LoginPage } from '../pages/LoginPage';
 * 
 * test('login test', async ({ page }) => {
 *   const loginPage = new LoginPage(page);
 *   await loginPage.goto();
 *   await loginPage.login('standard_user', 'secret_sauce');
 * });
 * 
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. CLASS: A blueprint for creating objects
 *    export class LoginPage { ... }
 * 
 * 2. CONSTRUCTOR: Initializes the object when created
 *    constructor(page: Page) { this.page = page; }
 * 
 * 3. PROPERTIES: Variables that belong to the class
 *    readonly page: Page;
 * 
 * 4. TYPE ANNOTATIONS: Specify what type a variable is
 *    page: Page, username: string
 * 
 * 5. GETTERS: Methods that act like properties
 *    get usernameInput() { return this.page.locator('#user-name'); }
 * 
 * 6. ASYNC METHODS: Methods that return Promises
 *    async login(username: string, password: string): Promise<void>
 * 
 * 7. RETURN TYPES: Specify what a method returns
 *    Promise<void>, Promise<string | null>, Promise<boolean>
 * 
 * 8. UNION TYPES: A value can be one of several types
 *    string | null means "string OR null"
 * 
 * 9. ACCESS MODIFIERS: Control who can access properties/methods
 *    readonly (can't be changed)
 * 
 * 10. THIS KEYWORD: Refers to the current instance of the class
 *     this.page, this.usernameInput
 */

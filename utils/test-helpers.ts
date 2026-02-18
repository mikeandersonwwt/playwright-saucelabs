/**
 * TEST HELPERS AND UTILITIES
 * 
 * This file contains reusable helper functions for tests.
 * Helpers reduce code duplication and make tests more readable.
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Function types and signatures
 * - Generic functions
 * - Utility functions
 * - Error handling
 */

import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../test-data/users.json';

// TYPESCRIPT LEARNING: FUNCTION TYPE DEFINITIONS
// We can define types for function parameters and return values

/**
 * Login helper - performs standard login
 * TYPESCRIPT: Function with typed parameters and return type
 * 
 * @param page - Playwright Page object
 * @param username - Optional username (defaults to standard_user)
 * @param password - Optional password (defaults to secret_sauce)
 */
export async function loginAsStandardUser(
  page: Page,
  username: string = users.validUsers[0].username,
  password: string = users.validUsers[0].password
): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
}

/**
 * Wait for a specific amount of time
 * TYPESCRIPT: Function with default parameter
 * 
 * @param ms - Milliseconds to wait (default: 1000)
 */
export async function wait(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random string
 * TYPESCRIPT: Function returning string
 * 
 * @param length - Length of random string
 * @returns Random alphanumeric string
 */
export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email
 * TYPESCRIPT: Function composition
 */
export function randomEmail(): string {
  return `test_${randomString(8)}@example.com`;
}

/**
 * Take screenshot with timestamp
 * TYPESCRIPT: Async function with string interpolation
 * 
 * @param page - Playwright Page object
 * @param name - Base name for screenshot
 */
export async function takeTimestampedScreenshot(
  page: Page,
  name: string
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Retry an action until it succeeds or max attempts reached
 * TYPESCRIPT: Generic function with callback
 * 
 * @param action - Async function to retry
 * @param maxAttempts - Maximum number of attempts (default: 3)
 * @param delayMs - Delay between attempts in ms (default: 1000)
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await wait(delayMs);
      }
    }
  }
  
  throw new Error(
    `Action failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Wait for URL to match pattern
 * TYPESCRIPT: Function with RegExp parameter
 * 
 * @param page - Playwright Page object
 * @param pattern - URL pattern to match
 * @param timeout - Timeout in ms (default: 5000)
 */
export async function waitForURL(
  page: Page,
  pattern: RegExp | string,
  timeout: number = 5000
): Promise<void> {
  await page.waitForURL(pattern, { timeout });
}

/**
 * Get current timestamp as string
 * TYPESCRIPT: Function returning formatted string
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format price from number to string
 * TYPESCRIPT: Number to string conversion
 * 
 * @param price - Price as number
 * @returns Formatted price string (e.g., "$29.99")
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Parse price from string to number
 * TYPESCRIPT: String to number conversion
 * 
 * @param priceString - Price string (e.g., "$29.99")
 * @returns Price as number
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace('$', ''));
}

/**
 * Check if arrays are equal (deep comparison)
 * TYPESCRIPT: Generic function with array comparison
 * 
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns true if arrays are equal
 */
export function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  
  return true;
}

/**
 * Check if array is sorted in ascending order
 * TYPESCRIPT: Generic function with comparison
 * 
 * @param arr - Array to check
 * @returns true if sorted ascending
 */
export function isSortedAscending<T>(arr: T[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

/**
 * Check if array is sorted in descending order
 * TYPESCRIPT: Generic function with comparison
 * 
 * @param arr - Array to check
 * @returns true if sorted descending
 */
export function isSortedDescending<T>(arr: T[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < arr[i + 1]) return false;
  }
  return true;
}

/**
 * Get random item from array
 * TYPESCRIPT: Generic function returning array item
 * 
 * @param arr - Array to pick from
 * @returns Random item from array
 */
export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get multiple random items from array
 * TYPESCRIPT: Generic function with array manipulation
 * 
 * @param arr - Array to pick from
 * @param count - Number of items to pick
 * @returns Array of random items
 */
export function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Chunk array into smaller arrays
 * TYPESCRIPT: Generic function with array chunking
 * 
 * @param arr - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Sleep for random duration
 * TYPESCRIPT: Function with min/max range
 * 
 * @param minMs - Minimum milliseconds
 * @param maxMs - Maximum milliseconds
 */
export async function randomWait(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await wait(ms);
}

/**
 * Log test step with timestamp
 * TYPESCRIPT: Console logging helper
 * 
 * @param step - Step description
 */
export function logStep(step: string): void {
  console.log(`[${getTimestamp()}] ${step}`);
}

/**
 * Assert element count
 * TYPESCRIPT: Custom assertion helper
 * 
 * @param actual - Actual count
 * @param expected - Expected count
 * @param message - Error message
 */
export function assertCount(
  actual: number,
  expected: number,
  message: string = 'Count mismatch'
): void {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

/**
 * Create test data object
 * TYPESCRIPT: Object factory function
 * 
 * @returns Test checkout info object
 */
export function createCheckoutInfo() {
  return {
    firstName: `Test${randomString(5)}`,
    lastName: `User${randomString(5)}`,
    postalCode: Math.floor(10000 + Math.random() * 90000).toString()
  };
}

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. FUNCTION SIGNATURES:
 *    async function name(param: Type): Promise<ReturnType>
 * 
 * 2. DEFAULT PARAMETERS:
 *    function name(param: Type = defaultValue)
 * 
 * 3. OPTIONAL PARAMETERS:
 *    function name(required: Type, optional?: Type)
 * 
 * 4. GENERIC FUNCTIONS:
 *    function name<T>(param: T): T
 *    Works with any type
 * 
 * 5. ARROW FUNCTIONS:
 *    const func = (param: Type): ReturnType => { ... }
 * 
 * 6. TYPE ASSERTIONS:
 *    error as Error
 *    Tell TypeScript the specific type
 * 
 * 7. TEMPLATE LITERALS:
 *    `text ${variable} more text`
 * 
 * 8. ARRAY METHODS:
 *    map, filter, slice, sort, etc.
 * 
 * 9. PROMISE HANDLING:
 *    async/await, Promise<T>
 * 
 * 10. ERROR HANDLING:
 *     try/catch blocks
 * 
 * HOW TO USE HELPERS:
 * 
 * import { loginAsStandardUser, randomString } from '../utils/test-helpers';
 * 
 * test('example', async ({ page }) => {
 *   // Use login helper
 *   await loginAsStandardUser(page);
 *   
 *   // Generate random data
 *   const email = randomEmail();
 *   
 *   // Check sorting
 *   const prices = [10, 20, 30];
 *   expect(isSortedAscending(prices)).toBe(true);
 * });
 */

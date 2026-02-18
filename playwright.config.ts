// TYPESCRIPT LEARNING: This is an ES6 import statement
// We're importing two things from the @playwright/test package:
// - defineConfig: A function that helps configure Playwright with TypeScript type checking
// - devices: Pre-configured device settings (screen sizes, user agents, etc.)
import { defineConfig, devices } from '@playwright/test';

/**
 * PLAYWRIGHT CONFIGURATION FILE
 * 
 * This file controls how Playwright runs your tests.
 * It's written in TypeScript (.ts extension) which gives us:
 * - Type safety (catches errors before running)
 * - Auto-completion in your IDE
 * - Better documentation through types
 */

// TYPESCRIPT LEARNING: 'export default' means this is the main thing exported from this file
// defineConfig() is a function that takes a configuration object and returns it with proper types
export default defineConfig({
  // testDir: Where Playwright looks for test files
  // './' means "current directory", so './tests' means the 'tests' folder
  testDir: './tests',
  
  // fullyParallel: Run all tests in parallel (faster execution)
  // TYPESCRIPT: 'true' is a boolean type (true/false)
  fullyParallel: true,
  
  // forbidOnly: Prevent test.only() from being committed to CI
  // TYPESCRIPT: '!!' converts a value to boolean, process.env.CI is a string or undefined
  // This prevents accidentally running only one test in CI
  forbidOnly: !!process.env.CI,
  
  // retries: How many times to retry failed tests
  // TYPESCRIPT: This uses a ternary operator (condition ? ifTrue : ifFalse)
  // In CI: retry 2 times, locally: don't retry (0)
  retries: process.env.CI ? 2 : 0,
  
  // workers: How many parallel worker processes to use
  // TYPESCRIPT: 'undefined' is a type meaning "no value set"
  // In CI: use 1 worker (sequential), locally: use default (based on CPU cores)
  workers: process.env.CI ? 1 : undefined,
  
  // reporter: How to display test results
  // 'html' creates a nice HTML report you can open in a browser
  // TYPESCRIPT: This is a string type (text in quotes)
  reporter: 'html',
  
  // timeout: Maximum time for each test (in milliseconds)
  // 30 seconds per test (30 * 1000 milliseconds)
  timeout: 30 * 1000,
  
  // expect timeout: Maximum time for assertions to pass
  // 5 seconds for assertions like expect(element).toBeVisible()
  expect: {
    timeout: 5000
  },
  
  // use: Settings that apply to all tests
  // TYPESCRIPT: This is an object with key-value pairs
  use: {
    // baseURL: The starting URL for your tests
    // Now you can use page.goto('/') instead of page.goto('https://www.saucedemo.com/')
    baseURL: 'https://www.saucedemo.com',

    // trace: When to collect detailed debugging traces
    // 'on-first-retry' means only collect traces when a test fails and is retried
    // Traces show screenshots, network requests, console logs, etc.
    trace: 'on-first-retry',
    
    // screenshot: When to take screenshots
    // 'only-on-failure' saves screenshots only when tests fail
    screenshot: 'only-on-failure',
    
    // video: When to record videos
    // 'retain-on-failure' keeps videos only for failed tests
    video: 'retain-on-failure',
  },

  // projects: Define different browser configurations to test against
  // TYPESCRIPT: This is an array (list) of objects
  // Each object represents a browser configuration
  projects: [
    {
      // TYPESCRIPT: 'name' is a string property
      name: 'chromium',
      // TYPESCRIPT: '...' is the spread operator - it copies all properties from devices['Desktop Chrome']
      // This gives us Chrome's viewport size, user agent, etc.
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      // WebKit is the browser engine used by Safari
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports (commented out for now, we'll enable these in Phase 9)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
});

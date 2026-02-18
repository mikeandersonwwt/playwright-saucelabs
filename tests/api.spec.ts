/**
 * API TESTING WITH PLAYWRIGHT
 * 
 * Playwright can test APIs directly without a browser.
 * This is useful for:
 * - Testing backend endpoints
 * - Validating API responses
 * - Setting up test data
 * - Hybrid UI + API testing
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - API request/response types
 * - JSON handling
 * - HTTP methods
 * - Status code validation
 */

import { test, expect } from '@playwright/test';

// Note: SauceDemo doesn't have a public API, so these are example patterns
// In a real project, you'd test your actual API endpoints

test.describe('API Testing Examples', () => {

  test('example: GET request pattern', async ({ request }) => {
    // TYPESCRIPT: 'request' is a Playwright APIRequestContext
    // It provides methods for making HTTP requests
    
    // Example GET request (this URL is just for demonstration)
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    // TYPESCRIPT: Verify status code
    expect(response.status()).toBe(200);
    
    // TYPESCRIPT: Parse JSON response
    const data = await response.json();
    
    // TYPESCRIPT: Verify response structure
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
    
    // TYPESCRIPT: Type the response data
    interface Post {
      userId: number;
      id: number;
      title: string;
      body: string;
    }
    
    const post = data as Post;
    expect(post.id).toBe(1);
  });

  test('example: POST request pattern', async ({ request }) => {
    // TYPESCRIPT: POST request with JSON body
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1
      }
    });
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('Test Post');
  });

  test('example: PUT request pattern', async ({ request }) => {
    // TYPESCRIPT: PUT request to update resource
    const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
      data: {
        id: 1,
        title: 'Updated Title',
        body: 'Updated body',
        userId: 1
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.title).toBe('Updated Title');
  });

  test('example: DELETE request pattern', async ({ request }) => {
    // TYPESCRIPT: DELETE request
    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
    
    expect(response.status()).toBe(200);
  });

  test('example: request with headers', async ({ request }) => {
    // TYPESCRIPT: Add custom headers
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'Accept': 'application/json',
        'Custom-Header': 'custom-value'
      }
    });
    
    expect(response.status()).toBe(200);
  });

  test('example: request with query parameters', async ({ request }) => {
    // TYPESCRIPT: Add query parameters
    const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
      params: {
        userId: 1,
        _limit: 5
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeLessThanOrEqual(5);
  });

  test('example: validate response headers', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    // TYPESCRIPT: Access response headers
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
  });

  test('example: handle error responses', async ({ request }) => {
    // TYPESCRIPT: Test error handling
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/999999');
    
    // This endpoint returns 404 for non-existent resources
    expect(response.status()).toBe(404);
  });

  test('example: validate response time', async ({ request }) => {
    // TYPESCRIPT: Measure response time
    const startTime = Date.now();
    
    await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Verify response time is reasonable (under 2 seconds)
    expect(responseTime).toBeLessThan(2000);
  });

  test('example: chain multiple API calls', async ({ request }) => {
    // TYPESCRIPT: Make multiple related API calls
    
    // Get a user
    const userResponse = await request.get('https://jsonplaceholder.typicode.com/users/1');
    const user = await userResponse.json();
    
    // Get that user's posts
    const postsResponse = await request.get('https://jsonplaceholder.typicode.com/posts', {
      params: { userId: user.id }
    });
    const posts = await postsResponse.json();
    
    // Verify we got posts for the correct user
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].userId).toBe(user.id);
  });
});

test.describe('Hybrid UI + API Testing', () => {
  
  test('example: use API to set up test data, then test UI', async ({ page, request }) => {
    // TYPESCRIPT: Combine API and UI testing
    // This pattern is useful for:
    // - Setting up test data via API
    // - Testing UI with known data
    // - Verifying UI changes via API
    
    // Step 1: Use API to create test data (example pattern)
    // In a real app, you might create a user, product, etc.
    
    // Step 2: Test the UI
    await page.goto('https://www.saucedemo.com');
    
    // Step 3: Verify UI displays the data correctly
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('example: verify UI action via API', async ({ page, request }) => {
    // TYPESCRIPT: Pattern for verifying UI actions
    
    // Step 1: Perform UI action
    await page.goto('https://www.saucedemo.com');
    
    // Step 2: Verify the action via API (example pattern)
    // In a real app, you might verify:
    // - Database state changed
    // - Backend received correct data
    // - External service was called
  });
});

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. API REQUEST CONTEXT:
 *    const response = await request.get(url)
 *    Playwright's APIRequestContext for HTTP requests
 * 
 * 2. HTTP METHODS:
 *    request.get() - GET request
 *    request.post() - POST request
 *    request.put() - PUT request
 *    request.delete() - DELETE request
 * 
 * 3. REQUEST OPTIONS:
 *    { data: {...} } - Request body
 *    { headers: {...} } - Custom headers
 *    { params: {...} } - Query parameters
 * 
 * 4. RESPONSE HANDLING:
 *    response.status() - HTTP status code
 *    response.json() - Parse JSON response
 *    response.headers() - Response headers
 *    response.text() - Response as text
 * 
 * 5. TYPE ASSERTIONS:
 *    const data = await response.json() as MyType
 * 
 * 6. INTERFACE DEFINITIONS:
 *    interface Post { id: number; title: string; }
 * 
 * 7. ARRAY TYPE CHECKING:
 *    Array.isArray(data)
 * 
 * 8. TIMING:
 *    Date.now() - Current timestamp
 *    Measure performance
 * 
 * REAL-WORLD API TESTING PATTERNS:
 * 
 * 1. AUTHENTICATION:
 *    - Get auth token via API
 *    - Use token in subsequent requests
 *    - Test protected endpoints
 * 
 * 2. CRUD OPERATIONS:
 *    - Create resource
 *    - Read/verify resource
 *    - Update resource
 *    - Delete resource
 * 
 * 3. DATA VALIDATION:
 *    - Verify response schema
 *    - Check data types
 *    - Validate business rules
 * 
 * 4. ERROR HANDLING:
 *    - Test invalid inputs
 *    - Verify error messages
 *    - Check status codes
 * 
 * 5. PERFORMANCE:
 *    - Measure response times
 *    - Test under load
 *    - Verify timeouts
 * 
 * BENEFITS OF API TESTING:
 * 
 * ✅ Faster than UI tests
 * ✅ More reliable (no UI flakiness)
 * ✅ Better for data setup
 * ✅ Can test backend directly
 * ✅ Good for integration testing
 * 
 * WHEN TO USE API TESTS:
 * 
 * - Testing backend logic
 * - Setting up test data
 * - Verifying database state
 * - Testing integrations
 * - Performance testing
 * 
 * WHEN TO USE UI TESTS:
 * 
 * - Testing user workflows
 * - Verifying visual elements
 * - Testing user interactions
 * - End-to-end scenarios
 * - Accessibility testing
 * 
 * RUNNING THESE TESTS:
 * 
 * npx playwright test api.spec.ts
 * 
 * Note: These tests use a public API for demonstration.
 * In your project, replace with your actual API endpoints.
 */

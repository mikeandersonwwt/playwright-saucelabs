/**
 * END-TO-END TESTS
 * 
 * This file tests complete user journeys through the application.
 * E2E tests verify that multiple features work together correctly.
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Chaining page objects
 * - Testing complete workflows
 * - Complex test scenarios
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../test-data/users.json';
import products from '../test-data/products.json';

test.describe('End-to-End User Journeys', () => {

  test('complete purchase flow - single item', async ({ page }) => {
    // TYPESCRIPT: This test demonstrates a complete user journey
    // from login to order completion
    
    // Initialize all page objects we'll need
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    
    // Step 2: Add product to cart
    const product = products.products[0];
    await inventoryPage.addProductToCart(product.name);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
    
    // Step 3: Go to cart
    await inventoryPage.goToCart();
    await expect(cartPage.cartContainer).toBeVisible();
    
    // Step 4: Verify product in cart
    const cartItems = await cartPage.getAllProductNames();
    expect(cartItems).toContain(product.name);
    
    // Step 5: Proceed to checkout
    await cartPage.checkout();
    await expect(checkoutPage.firstNameInput).toBeVisible();
    
    // Step 6: Fill checkout information
    await checkoutPage.completeCheckoutInfo({
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    });
    
    // Step 7: Verify we're on overview page
    await expect(checkoutPage.finishButton).toBeVisible();
    
    // Step 8: Complete the order
    await checkoutPage.finish();
    
    // Step 9: Verify order completion
    await expect(checkoutPage.completeHeader).toBeVisible();
    const headerText = await checkoutPage.getCompleteHeader();
    expect(headerText).toContain('Thank you for your order');
  });

  test('complete purchase flow - multiple items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // TYPESCRIPT: Add multiple products using array
    const productsToAdd = products.products.slice(0, 3).map(p => p.name);
    await inventoryPage.addMultipleProductsToCart(productsToAdd);
    
    // Verify cart count
    expect(await inventoryPage.getCartItemCount()).toBe(3);
    
    // Go to cart and verify all items
    await inventoryPage.goToCart();
    const cartItems = await cartPage.getAllProductNames();
    expect(cartItems.length).toBe(3);
    
    // Checkout
    await cartPage.checkout();
    await checkoutPage.completeCheckout({
      firstName: 'Jane',
      lastName: 'Smith',
      postalCode: '54321'
    });
    
    // Verify completion
    expect(await checkoutPage.isOrderComplete()).toBe(true);
  });

  test('add items, remove one, then complete purchase', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // Add 3 products
    const productsToAdd = products.products.slice(0, 3);
    for (const product of productsToAdd) {
      await inventoryPage.addProductToCart(product.name);
    }
    
    // Go to cart
    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(3);
    
    // Remove one product
    await cartPage.removeProduct(productsToAdd[1].name);
    expect(await cartPage.getCartItemCount()).toBe(2);
    
    // Continue with checkout
    await cartPage.checkout();
    await checkoutPage.completeCheckout({
      firstName: 'Bob',
      lastName: 'Johnson',
      postalCode: '99999'
    });
    
    // Verify completion
    expect(await checkoutPage.isOrderComplete()).toBe(true);
  });

  test('verify cart total calculation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // Add products with known prices
    const productsToAdd = products.products.slice(0, 2);
    for (const product of productsToAdd) {
      await inventoryPage.addProductToCart(product.name);
    }
    
    // Go to cart and calculate expected total
    await inventoryPage.goToCart();
    const cartTotal = await cartPage.getTotalPrice();
    
    // TYPESCRIPT: Calculate expected total from test data
    const expectedTotal = productsToAdd.reduce((sum, p) => sum + p.price, 0);
    
    // Verify totals match (with small tolerance for floating point)
    expect(Math.abs(cartTotal - expectedTotal)).toBeLessThan(0.01);
    
    // Proceed to checkout overview
    await cartPage.checkout();
    await checkoutPage.completeCheckoutInfo({
      firstName: 'Test',
      lastName: 'User',
      postalCode: '11111'
    });
    
    // Verify subtotal on checkout page
    const subtotal = await checkoutPage.getSubtotal();
    expect(Math.abs(subtotal - expectedTotal)).toBeLessThan(0.01);
    
    // Verify total includes tax
    const total = await checkoutPage.getTotal();
    const tax = await checkoutPage.getTax();
    expect(Math.abs(total - (subtotal + tax))).toBeLessThan(0.01);
  });

  test('browse products, sort, then purchase', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // Sort products by price low to high
    await inventoryPage.sortProducts('lohi');
    
    // Get the cheapest product (first after sorting)
    const productNames = await inventoryPage.getAllProductNames();
    const cheapestProduct = productNames[0];
    
    // Add cheapest product
    await inventoryPage.addProductToCart(cheapestProduct);
    
    // Complete purchase
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.completeCheckout({
      firstName: 'Budget',
      lastName: 'Shopper',
      postalCode: '00000'
    });
    
    // Verify completion
    expect(await checkoutPage.isOrderComplete()).toBe(true);
  });

  test('cancel checkout and return to shopping', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Login and add product
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    await inventoryPage.addProductToCart(products.products[0].name);
    
    // Go to cart
    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(1);
    
    // Start checkout
    await cartPage.checkout();
    await expect(checkoutPage.firstNameInput).toBeVisible();
    
    // Cancel checkout
    await checkoutPage.cancel();
    
    // Verify we're back at cart
    await expect(cartPage.cartContainer).toBeVisible();
    
    // Verify item still in cart
    expect(await cartPage.getCartItemCount()).toBe(1);
    
    // Continue shopping
    await cartPage.continueShopping();
    
    // Verify we're back at inventory
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    
    // Verify cart still has item
    expect(await inventoryPage.getCartItemCount()).toBe(1);
  });

  test('empty cart before checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    // Login and add products
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    const productsToAdd = products.products.slice(0, 3).map(p => p.name);
    await inventoryPage.addMultipleProductsToCart(productsToAdd);
    
    // Go to cart
    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(3);
    
    // Remove all items
    await cartPage.removeAllProducts();
    
    // Verify cart is empty
    expect(await cartPage.isEmpty()).toBe(true);
    
    // Verify checkout button still exists but cart is empty
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('add from inventory, remove from cart, add again', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    const product = products.products[0];
    
    // Login
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    
    // Add product from inventory
    await inventoryPage.addProductToCart(product.name);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
    
    // Go to cart and remove
    await inventoryPage.goToCart();
    await cartPage.removeProduct(product.name);
    expect(await cartPage.isEmpty()).toBe(true);
    
    // Go back to inventory
    await cartPage.continueShopping();
    
    // Verify product shows "Add to cart" again
    expect(await inventoryPage.isProductInCart(product.name)).toBe(false);
    
    // Add it again
    await inventoryPage.addProductToCart(product.name);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
  });

  test('complete purchase and return home', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Complete a purchase
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    await inventoryPage.addProductToCart(products.products[0].name);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.completeCheckout({
      firstName: 'Complete',
      lastName: 'Test',
      postalCode: '77777'
    });
    
    // Verify completion
    expect(await checkoutPage.isOrderComplete()).toBe(true);
    
    // Go back home
    await checkoutPage.backHome();
    
    // Verify we're back at inventory
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    
    // Verify cart is empty (new session)
    expect(await inventoryPage.getCartItemCount()).toBe(0);
  });

  test('test with different user - problem user', async ({ page }) => {
    // TYPESCRIPT: Testing with a different user type
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    // Login with problem user
    const problemUser = users.validUsers.find(u => u.username === 'problem_user');
    
    await loginPage.goto();
    await loginPage.login(problemUser!.username, problemUser!.password);
    
    // Verify login successful
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    
    // Note: problem_user has known issues, but login should work
    // In a real test suite, we'd document the expected problems
  });

  test('verify checkout form validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Setup: login and add product
    await loginPage.goto();
    await loginPage.login(users.validUsers[0].username, users.validUsers[0].password);
    await inventoryPage.addProductToCart(products.products[0].name);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    
    // Try to continue without filling form
    await checkoutPage.continue();
    
    // Verify error message appears
    expect(await checkoutPage.hasError()).toBe(true);
    
    // Fill only first name
    await checkoutPage.fillCheckoutForm('John', '', '');
    await checkoutPage.continue();
    expect(await checkoutPage.hasError()).toBe(true);
    
    // Fill first and last name
    await checkoutPage.fillCheckoutForm('John', 'Doe', '');
    await checkoutPage.continue();
    expect(await checkoutPage.hasError()).toBe(true);
    
    // Fill all fields
    await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
    await checkoutPage.continue();
    
    // Should proceed to overview
    await expect(checkoutPage.finishButton).toBeVisible();
  });
});

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. CHAINING PAGE OBJECTS:
 *    Multiple page objects used in sequence
 *    Simulates real user workflows
 * 
 * 2. COMPLEX WORKFLOWS:
 *    Multi-step processes
 *    State management across pages
 * 
 * 3. ARRAY OPERATIONS:
 *    slice() - Get subset of array
 *    map() - Transform array
 *    reduce() - Calculate totals
 *    find() - Find specific item
 * 
 * 4. OPTIONAL CHAINING:
 *    problemUser!.username - Assert value exists
 *    The ! tells TypeScript "I know this isn't null"
 * 
 * 5. MATHEMATICAL OPERATIONS:
 *    Math.abs() - Absolute value
 *    Floating point comparison with tolerance
 * 
 * 6. STATE VERIFICATION:
 *    Checking state changes across pages
 *    Verifying data persistence
 * 
 * 7. ERROR HANDLING:
 *    Testing validation
 *    Verifying error messages
 * 
 * 8. USER SCENARIOS:
 *    Happy path (successful purchase)
 *    Alternative paths (cancel, remove items)
 *    Edge cases (empty cart, validation)
 * 
 * WHY E2E TESTS MATTER:
 * 
 * - Verify features work together
 * - Catch integration issues
 * - Test real user workflows
 * - Ensure business processes work
 * - Provide confidence in releases
 * 
 * E2E vs UNIT TESTS:
 * 
 * Unit tests: Test individual components
 * E2E tests: Test complete workflows
 * 
 * Both are important:
 * - Unit tests catch component bugs
 * - E2E tests catch integration bugs
 * 
 * RUNNING THESE TESTS:
 * 
 * npx playwright test end-to-end.spec.ts                  # Run all E2E tests
 * npx playwright test end-to-end.spec.ts --headed         # Run with browser visible
 * npx playwright test end-to-end.spec.ts --project=chromium  # Run in specific browser
 * npx playwright test end-to-end.spec.ts --grep "purchase"   # Run purchase tests only
 * 
 * BEST PRACTICES:
 * 
 * ✅ Test complete user journeys
 * ✅ Verify state across pages
 * ✅ Test both happy and sad paths
 * ✅ Use realistic test data
 * ✅ Keep tests independent
 * ✅ Clean up after tests
 */

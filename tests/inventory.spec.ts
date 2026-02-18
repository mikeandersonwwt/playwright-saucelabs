/**
 * INVENTORY PAGE TESTS
 * 
 * This file tests the product inventory/catalog functionality.
 * Tests include: viewing products, sorting, adding to cart, cart operations.
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Working with arrays in tests
 * - Data-driven testing
 * - Complex assertions
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import users from '../test-data/users.json';
import products from '../test-data/products.json';

test.describe('Inventory Page', () => {
  
  // TYPESCRIPT LEARNING: test.beforeEach with authentication
  // This runs before each test to ensure we're logged in
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = users.validUsers[0];
    
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    
    // Wait for inventory page to load
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  // PRODUCT DISPLAY TESTS

  test('should display all products on inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Get the count of displayed products
    const productCount = await inventoryPage.getProductItems().count();
    
    // TYPESCRIPT: Verify count matches expected number from test data
    expect(productCount).toBe(products.products.length);
  });

  test('should display product names correctly', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Get all product names from the page
    const displayedNames = await inventoryPage.getAllProductNames();
    
    // TYPESCRIPT: Extract expected names from test data using map()
    const expectedNames = products.products.map(p => p.name);
    
    // Verify all expected products are displayed
    for (const expectedName of expectedNames) {
      expect(displayedNames).toContain(expectedName);
    }
  });

  test('should display product prices correctly', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Get all prices from the page
    const displayedPrices = await inventoryPage.getAllProductPrices();
    
    // TYPESCRIPT: Extract expected prices from test data
    const expectedPrices = products.products.map(p => p.price);
    
    // Verify we have the right number of prices
    expect(displayedPrices.length).toBe(expectedPrices.length);
    
    // Verify all prices are positive numbers
    for (const price of displayedPrices) {
      expect(price).toBeGreaterThan(0);
    }
  });

  // SORTING TESTS

  test('should sort products by name A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Sort products A to Z
    await inventoryPage.sortProducts('az');
    
    // Get product names after sorting
    const sortedNames = await inventoryPage.getAllProductNames();
    
    // TYPESCRIPT: Create a sorted copy to compare
    // [...array] creates a copy, then sort() sorts it
    const expectedOrder = [...sortedNames].sort();
    
    // Verify the order matches
    expect(sortedNames).toEqual(expectedOrder);
  });

  test('should sort products by name Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Sort products Z to A
    await inventoryPage.sortProducts('za');
    
    // Get product names after sorting
    const sortedNames = await inventoryPage.getAllProductNames();
    
    // TYPESCRIPT: Sort in reverse order
    const expectedOrder = [...sortedNames].sort().reverse();
    
    // Verify the order matches
    expect(sortedNames).toEqual(expectedOrder);
  });

  test('should sort products by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Sort by price low to high
    await inventoryPage.sortProducts('lohi');
    
    // Get prices after sorting
    const sortedPrices = await inventoryPage.getAllProductPrices();
    
    // TYPESCRIPT: Verify prices are in ascending order
    for (let i = 0; i < sortedPrices.length - 1; i++) {
      expect(sortedPrices[i]).toBeLessThanOrEqual(sortedPrices[i + 1]);
    }
  });

  test('should sort products by price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Sort by price high to low
    await inventoryPage.sortProducts('hilo');
    
    // Get prices after sorting
    const sortedPrices = await inventoryPage.getAllProductPrices();
    
    // TYPESCRIPT: Verify prices are in descending order
    for (let i = 0; i < sortedPrices.length - 1; i++) {
      expect(sortedPrices[i]).toBeGreaterThanOrEqual(sortedPrices[i + 1]);
    }
  });

  // ADD TO CART TESTS

  test('should add single product to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Get first product from test data
    const product = products.products[0];
    
    // Add product to cart
    await inventoryPage.addProductToCart(product.name);
    
    // Verify cart badge shows 1 item
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
    
    // Verify product shows "Remove" button
    const isInCart = await inventoryPage.isProductInCart(product.name);
    expect(isInCart).toBe(true);
  });

  test('should add multiple products to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // TYPESCRIPT: Get first 3 products
    const productsToAdd = products.products.slice(0, 3);
    const productNames = productsToAdd.map(p => p.name);
    
    // Add multiple products
    await inventoryPage.addMultipleProductsToCart(productNames);
    
    // Verify cart badge shows correct count
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(3);
  });

  test('should remove product from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const product = products.products[0];
    
    // Add product first
    await inventoryPage.addProductToCart(product.name);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
    
    // Remove product
    await inventoryPage.removeProductFromCart(product.name);
    
    // Verify cart is empty (badge not visible)
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);
    
    // Verify "Add to cart" button is back
    const isInCart = await inventoryPage.isProductInCart(product.name);
    expect(isInCart).toBe(false);
  });

  test('should update cart count when adding multiple products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Add products one by one and verify count
    for (let i = 0; i < 3; i++) {
      await inventoryPage.addProductToCart(products.products[i].name);
      const count = await inventoryPage.getCartItemCount();
      expect(count).toBe(i + 1);
    }
  });

  // NAVIGATION TESTS

  test('should navigate to product detail page when clicking product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const product = products.products[0];
    
    // Click on product name
    await inventoryPage.clickProduct(product.name);
    
    // Verify URL changed to product detail page
    await expect(page).toHaveURL(/inventory-item.html/);
  });

  test('should navigate to cart page when clicking cart icon', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Click cart icon
    await inventoryPage.goToCart();
    
    // Verify we're on cart page
    await expect(page).toHaveURL(/cart.html/);
  });

  test('should logout successfully', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const loginPage = new LoginPage(page);
    
    // Logout
    await inventoryPage.logout();
    
    // Verify we're back on login page
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
  });

  // CART INTEGRATION TESTS

  test('should maintain cart when navigating to cart and back', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const product = products.products[0];
    
    // Add product to cart
    await inventoryPage.addProductToCart(product.name);
    
    // Go to cart
    await inventoryPage.goToCart();
    await expect(cartPage.cartContainer).toBeVisible();
    
    // Go back to inventory
    await cartPage.continueShopping();
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    
    // Verify cart still shows 1 item
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should show correct products in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    // Add specific products
    const productsToAdd = [products.products[0].name, products.products[2].name];
    await inventoryPage.addMultipleProductsToCart(productsToAdd);
    
    // Go to cart
    await inventoryPage.goToCart();
    
    // Verify correct products are in cart
    const cartProductNames = await cartPage.getAllProductNames();
    
    for (const productName of productsToAdd) {
      expect(cartProductNames).toContain(productName);
    }
  });

  // DATA-DRIVEN TESTS

  test('should be able to add all products to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // TYPESCRIPT: Test with all products from test data
    for (const product of products.products) {
      await inventoryPage.addProductToCart(product.name);
    }
    
    // Verify cart count matches total products
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(products.products.length);
  });

  test('should display correct price for each product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // TYPESCRIPT: Verify each product's price matches test data
    for (const product of products.products) {
      // Get the product element
      const productElement = inventoryPage.getProductByName(product.name);
      
      // Get the price from the page
      const priceText = await productElement.locator('.inventory_item_price').textContent();
      
      // Verify it matches expected price
      expect(priceText).toBe(`$${product.price}`);
    }
  });

  // EDGE CASES

  test('should handle adding and removing same product multiple times', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const product = products.products[0];
    
    // Add, remove, add, remove
    await inventoryPage.addProductToCart(product.name);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
    
    await inventoryPage.removeProductFromCart(product.name);
    expect(await inventoryPage.getCartItemCount()).toBe(0);
    
    await inventoryPage.addProductToCart(product.name);
    expect(await inventoryPage.getCartItemCount()).toBe(1);
    
    await inventoryPage.removeProductFromCart(product.name);
    expect(await inventoryPage.getCartItemCount()).toBe(0);
  });

  test('should maintain sort order after adding to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Sort products
    await inventoryPage.sortProducts('az');
    const namesBeforeAdd = await inventoryPage.getAllProductNames();
    
    // Add a product
    await inventoryPage.addProductToCart(products.products[0].name);
    
    // Verify sort order is maintained
    const namesAfterAdd = await inventoryPage.getAllProductNames();
    expect(namesAfterAdd).toEqual(namesBeforeAdd);
  });
});

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. ARRAY METHODS:
 *    array.map() - Transform array items
 *    array.slice() - Get portion of array
 *    array.length - Get array size
 *    [...array] - Create array copy
 *    array.sort() - Sort array
 *    array.reverse() - Reverse array order
 * 
 * 2. LOOPS:
 *    for...of - Iterate over array items
 *    for (let i = 0; i < length; i++) - Traditional loop with index
 * 
 * 3. ARRAY COMPARISONS:
 *    expect(array).toContain(item) - Check if array contains item
 *    expect(array).toEqual(otherArray) - Deep equality check
 * 
 * 4. NUMERIC COMPARISONS:
 *    toBeGreaterThan() - Greater than
 *    toBeLessThanOrEqual() - Less than or equal
 *    toBeGreaterThanOrEqual() - Greater than or equal
 * 
 * 5. DATA-DRIVEN TESTING:
 *    Using test-data/products.json
 *    Testing with multiple data sets
 *    Verifying against expected data
 * 
 * 6. TEST ORGANIZATION:
 *    Product display tests
 *    Sorting tests
 *    Add to cart tests
 *    Navigation tests
 *    Cart integration tests
 *    Data-driven tests
 *    Edge cases
 * 
 * 7. COMPLEX ASSERTIONS:
 *    Verifying order of sorted arrays
 *    Checking multiple conditions
 *    Testing state changes
 * 
 * RUNNING THESE TESTS:
 * 
 * npx playwright test inventory.spec.ts                    # Run all inventory tests
 * npx playwright test inventory.spec.ts --headed           # Run with browser visible
 * npx playwright test inventory.spec.ts --grep "sort"      # Run only sorting tests
 * npx playwright test inventory.spec.ts --grep "cart"      # Run only cart tests
 */

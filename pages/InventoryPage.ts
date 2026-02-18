/**
 * INVENTORY PAGE OBJECT MODEL
 * 
 * This page represents the product inventory/catalog page shown after login.
 * Users can view products, sort them, filter them, and add them to cart.
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Working with arrays and lists
 * - Optional parameters
 * - String literal types (union of specific strings)
 */

import { Page, Locator } from '@playwright/test';

// TYPESCRIPT LEARNING: STRING LITERAL TYPES
// Instead of just 'string', we can specify exactly which strings are allowed
// This is called a "union type" of string literals
// The '|' means "or" - sortOption can be one of these specific values
type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
// 'az' = Name A to Z
// 'za' = Name Z to A
// 'lohi' = Price low to high
// 'hilo' = Price high to low

export class InventoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // LOCATORS

  get inventoryContainer() {
    return this.page.locator('.inventory_container');
  }

  get sortDropdown() {
    // The sort dropdown lets users sort products
    return this.page.locator('[data-test="product-sort-container"]');
  }

  get shoppingCartBadge() {
    // The badge shows how many items are in the cart
    return this.page.locator('.shopping_cart_badge');
  }

  get shoppingCartLink() {
    return this.page.locator('.shopping_cart_link');
  }

  get burgerMenuButton() {
    return this.page.locator('#react-burger-menu-btn');
  }

  // TYPESCRIPT LEARNING: METHOD THAT RETURNS A LOCATOR
  // This method takes a parameter and returns a Locator
  // Return type is 'Locator' (imported from '@playwright/test')
  
  /**
   * Get all product items on the page
   * TYPESCRIPT: Returns a Locator that can match multiple elements
   */
  getProductItems(): Locator {
    // This returns ALL product items (multiple elements)
    return this.page.locator('.inventory_item');
  }

  /**
   * Get a specific product by its name
   * TYPESCRIPT: Takes a string parameter, returns a Locator
   * @param productName - The name of the product to find
   */
  getProductByName(productName: string): Locator {
    // Use text= to find an element containing specific text
    return this.page.locator(`.inventory_item:has-text("${productName}")`);
  }

  /**
   * Get the "Add to cart" button for a specific product
   * @param productName - The name of the product
   */
  getAddToCartButton(productName: string): Locator {
    // Find the product, then find its "Add to cart" button
    return this.getProductByName(productName).locator('button:has-text("Add to cart")');
  }

  /**
   * Get the "Remove" button for a specific product (shown after adding to cart)
   * @param productName - The name of the product
   */
  getRemoveButton(productName: string): Locator {
    return this.getProductByName(productName).locator('button:has-text("Remove")');
  }

  // METHODS (ACTIONS)

  /**
   * Check if we're on the inventory page
   * TYPESCRIPT: async method returning Promise<boolean>
   */
  async isOnInventoryPage(): Promise<boolean> {
    return await this.inventoryContainer.isVisible();
  }

  /**
   * Sort products using the dropdown
   * TYPESCRIPT: The parameter type is our custom SortOption type
   * This means TypeScript will only allow: 'az', 'za', 'lohi', or 'hilo'
   * If you try to pass 'invalid', TypeScript will show an error!
   * 
   * @param option - How to sort: 'az' | 'za' | 'lohi' | 'hilo'
   */
  async sortProducts(option: SortOption): Promise<void> {
    // selectOption() selects a value from a dropdown
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Add a product to cart by its name
   * @param productName - The name of the product to add
   */
  async addProductToCart(productName: string): Promise<void> {
    await this.getAddToCartButton(productName).click();
  }

  /**
   * Remove a product from cart by its name
   * @param productName - The name of the product to remove
   */
  async removeProductFromCart(productName: string): Promise<void> {
    await this.getRemoveButton(productName).click();
  }

  /**
   * Add multiple products to cart
   * TYPESCRIPT: Takes an array of strings (string[])
   * The '[]' after a type means "array of that type"
   * 
   * @param productNames - Array of product names to add
   */
  async addMultipleProductsToCart(productNames: string[]): Promise<void> {
    // TYPESCRIPT: 'for...of' loop iterates over array items
    // 'const' means the variable can't be reassigned in the loop
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }

  /**
   * Get the cart item count from the badge
   * TYPESCRIPT: Returns Promise<number>
   * number is the TypeScript type for numeric values
   * 
   * @returns The number of items in cart, or 0 if badge not visible
   */
  async getCartItemCount(): Promise<number> {
    // Check if the badge is visible (it's hidden when cart is empty)
    const isVisible = await this.shoppingCartBadge.isVisible();
    
    if (!isVisible) {
      // TYPESCRIPT: 'return 0' - returning a number
      return 0;
    }
    
    // Get the text content of the badge
    const text = await this.shoppingCartBadge.textContent();
    
    // TYPESCRIPT: parseInt() converts a string to a number
    // '|| 0' means "if parseInt returns NaN (not a number), use 0 instead"
    return parseInt(text || '0', 10);
  }

  /**
   * Click on a product to view its details
   * @param productName - The name of the product to click
   */
  async clickProduct(productName: string): Promise<void> {
    // Click on the product name link
    await this.getProductByName(productName).locator('.inventory_item_name').click();
  }

  /**
   * Go to the shopping cart
   */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Get all product names currently displayed
   * TYPESCRIPT: Returns Promise<string[]>
   * string[] is an array of strings
   * 
   * @returns Array of product names
   */
  async getAllProductNames(): Promise<string[]> {
    // Get all product name elements
    const nameElements = this.page.locator('.inventory_item_name');
    
    // TYPESCRIPT: allTextContents() returns Promise<string[]>
    // It gets the text from all matching elements
    return await nameElements.allTextContents();
  }

  /**
   * Get all product prices currently displayed
   * TYPESCRIPT: Returns an array of numbers
   * 
   * @returns Array of product prices as numbers
   */
  async getAllProductPrices(): Promise<number[]> {
    // Get all price elements
    const priceElements = this.page.locator('.inventory_item_price');
    
    // Get all price texts
    const priceTexts = await priceElements.allTextContents();
    
    // TYPESCRIPT: map() transforms each item in an array
    // For each price text, remove the '$' and convert to number
    // Arrow function: (price) => parseFloat(price.replace('$', ''))
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Check if a product is in the cart (has "Remove" button)
   * @param productName - The name of the product to check
   */
  async isProductInCart(productName: string): Promise<boolean> {
    return await this.getRemoveButton(productName).isVisible();
  }

  /**
   * Open the burger menu
   */
  async openMenu(): Promise<void> {
    await this.burgerMenuButton.click();
  }

  /**
   * Logout (via burger menu)
   */
  async logout(): Promise<void> {
    await this.openMenu();
    // Wait for menu to open
    await this.page.waitForTimeout(500);
    await this.page.locator('#logout_sidebar_link').click();
  }
}

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. STRING LITERAL TYPES: Specific string values allowed
 *    type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
 * 
 * 2. ARRAY TYPES: Arrays of specific types
 *    string[] = array of strings
 *    number[] = array of numbers
 * 
 * 3. FOR...OF LOOP: Iterate over array items
 *    for (const item of array) { ... }
 * 
 * 4. MAP FUNCTION: Transform array items
 *    array.map(item => transform(item))
 * 
 * 5. CONDITIONAL LOGIC: if/else statements
 *    if (condition) { ... } else { ... }
 * 
 * 6. TEMPLATE LITERALS: Strings with embedded expressions
 *    `text ${variable} more text`
 * 
 * 7. LOGICAL OR OPERATOR: Provide default values
 *    value || defaultValue
 * 
 * 8. METHOD CHAINING: Call methods on returned objects
 *    this.getProductByName(name).locator('button')
 * 
 * 9. RETURN TYPE ANNOTATIONS: Specify what methods return
 *    Promise<number>, Promise<string[]>, Promise<boolean>
 * 
 * 10. LOCATOR TYPE: Playwright's type for finding elements
 *     getProductItems(): Locator
 */

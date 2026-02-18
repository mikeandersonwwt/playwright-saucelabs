/**
 * CART PAGE OBJECT MODEL
 * 
 * This page represents the shopping cart where users can review items,
 * adjust quantities, remove items, and proceed to checkout.
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Working with arrays of objects
 * - Filter and find array methods
 * - Complex object types
 */

import { Page, Locator } from '@playwright/test';

// TYPESCRIPT LEARNING: INTERFACE FOR CART ITEMS
// This interface defines what a cart item object looks like
interface CartItem {
  name: string;
  description: string;
  price: string;
  quantity: number;
}

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // LOCATORS

  get cartContainer() {
    return this.page.locator('.cart_contents_container');
  }

  get continueShoppingButton() {
    return this.page.locator('[data-test="continue-shopping"]');
  }

  get checkoutButton() {
    return this.page.locator('[data-test="checkout"]');
  }

  /**
   * Get all cart item containers
   * TYPESCRIPT: Returns a Locator that matches multiple elements
   */
  getCartItems(): Locator {
    return this.page.locator('.cart_item');
  }

  /**
   * Get a specific cart item by product name
   * @param productName - The name of the product
   */
  getCartItemByName(productName: string): Locator {
    return this.page.locator(`.cart_item:has-text("${productName}")`);
  }

  /**
   * Get the remove button for a specific product
   * @param productName - The name of the product
   */
  getRemoveButton(productName: string): Locator {
    return this.getCartItemByName(productName).locator('button:has-text("Remove")');
  }

  // METHODS

  /**
   * Check if we're on the cart page
   */
  async isOnCartPage(): Promise<boolean> {
    return await this.cartContainer.isVisible();
  }

  /**
   * Get the number of items in the cart
   * TYPESCRIPT: Returns Promise<number>
   */
  async getCartItemCount(): Promise<number> {
    // Count how many cart items are visible
    return await this.getCartItems().count();
  }

  /**
   * Remove a product from the cart
   * @param productName - The name of the product to remove
   */
  async removeProduct(productName: string): Promise<void> {
    await this.getRemoveButton(productName).click();
  }

  /**
   * Remove all products from the cart
   * TYPESCRIPT: Demonstrates working with arrays in a loop
   */
  async removeAllProducts(): Promise<void> {
    // Get all product names first
    const productNames = await this.getAllProductNames();
    
    // TYPESCRIPT: for...of loop to iterate through the array
    for (const name of productNames) {
      await this.removeProduct(name);
    }
  }

  /**
   * Continue shopping (go back to inventory)
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Proceed to checkout
   */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Get all product names in the cart
   * TYPESCRIPT: Returns Promise<string[]>
   */
  async getAllProductNames(): Promise<string[]> {
    const nameElements = this.page.locator('.cart_item .inventory_item_name');
    return await nameElements.allTextContents();
  }

  /**
   * Get all product prices in the cart
   * TYPESCRIPT: Returns Promise<number[]>
   */
  async getAllProductPrices(): Promise<number[]> {
    const priceElements = this.page.locator('.cart_item .inventory_item_price');
    const priceTexts = await priceElements.allTextContents();
    
    // TYPESCRIPT: map() to convert string prices to numbers
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Get detailed information about all cart items
   * TYPESCRIPT: Returns Promise<CartItem[]>
   * This is an array of CartItem objects
   */
  async getAllCartItems(): Promise<CartItem[]> {
    // Get the count of cart items
    const count = await this.getCartItemCount();
    
    // TYPESCRIPT: Create an empty array with the CartItem[] type
    const items: CartItem[] = [];
    
    // TYPESCRIPT: for loop with index
    for (let i = 0; i < count; i++) {
      // Get the nth cart item (0-indexed)
      const cartItem = this.getCartItems().nth(i);
      
      // Extract information from this cart item
      const name = await cartItem.locator('.inventory_item_name').textContent() || '';
      const description = await cartItem.locator('.inventory_item_desc').textContent() || '';
      const priceText = await cartItem.locator('.inventory_item_price').textContent() || '$0';
      const price = priceText;
      
      // TYPESCRIPT: Create an object that matches the CartItem interface
      // Then push it to the array
      items.push({
        name,
        description,
        price,
        quantity: 1  // SauceDemo doesn't support quantity > 1, always 1
      });
    }
    
    return items;
  }

  /**
   * Check if a specific product is in the cart
   * @param productName - The name of the product to check
   */
  async isProductInCart(productName: string): Promise<boolean> {
    return await this.getCartItemByName(productName).isVisible();
  }

  /**
   * Get the total price of all items in cart
   * TYPESCRIPT: Returns Promise<number>
   */
  async getTotalPrice(): Promise<number> {
    const prices = await this.getAllProductPrices();
    
    // TYPESCRIPT: reduce() method to sum all prices
    // reduce takes a function with (accumulator, currentValue) parameters
    // It starts with 0 and adds each price to the total
    return prices.reduce((total, price) => total + price, 0);
  }

  /**
   * Find a specific cart item by name
   * TYPESCRIPT: Returns Promise<CartItem | undefined>
   * The '| undefined' means it might not find the item
   * 
   * @param productName - The name of the product to find
   */
  async findCartItem(productName: string): Promise<CartItem | undefined> {
    const allItems = await this.getAllCartItems();
    
    // TYPESCRIPT: find() method searches an array
    // Returns the first item that matches, or undefined if not found
    return allItems.find(item => item.name === productName);
  }

  /**
   * Get cart items sorted by price
   * TYPESCRIPT: Demonstrates array sorting
   * @param ascending - true for low to high, false for high to low
   */
  async getCartItemsSortedByPrice(ascending: boolean = true): Promise<CartItem[]> {
    const items = await this.getAllCartItems();
    
    // TYPESCRIPT: sort() method with a comparator function
    // The comparator returns negative, zero, or positive to determine order
    return items.sort((a, b) => {
      const priceA = parseFloat(a.price.replace('$', ''));
      const priceB = parseFloat(b.price.replace('$', ''));
      
      // TYPESCRIPT: Ternary operator for conditional logic
      return ascending ? priceA - priceB : priceB - priceA;
    });
  }

  /**
   * Check if cart is empty
   */
  async isEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }
}

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. INTERFACE: Define object structure
 *    interface CartItem { name: string; price: string; }
 * 
 * 2. ARRAY OF OBJECTS: Type for arrays containing objects
 *    CartItem[] or Array<CartItem>
 * 
 * 3. FOR LOOP WITH INDEX: Traditional loop with counter
 *    for (let i = 0; i < count; i++) { ... }
 * 
 * 4. ARRAY METHODS:
 *    - map(): Transform each item
 *    - reduce(): Combine items into single value
 *    - find(): Find first matching item
 *    - sort(): Sort items by criteria
 * 
 * 5. ARROW FUNCTIONS: Concise function syntax
 *    (a, b) => a - b
 * 
 * 6. OPTIONAL RETURN: Method might not return a value
 *    Promise<CartItem | undefined>
 * 
 * 7. DEFAULT PARAMETERS: Provide default values
 *    async getCartItemsSortedByPrice(ascending: boolean = true)
 * 
 * 8. ARRAY PUSH: Add items to an array
 *    items.push({ name, price })
 * 
 * 9. NTH SELECTOR: Get element by index
 *    this.getCartItems().nth(i)
 * 
 * 10. COMPARISON OPERATORS: Check equality
 *     count === 0, item.name === productName
 * 
 * EXAMPLE USAGE:
 * 
 * const cartPage = new CartPage(page);
 * 
 * // Get all items
 * const items = await cartPage.getAllCartItems();
 * console.log(items[0].name);  // TypeScript knows this is a string
 * 
 * // Find specific item
 * const backpack = await cartPage.findCartItem('Sauce Labs Backpack');
 * if (backpack) {
 *   console.log(backpack.price);
 * }
 * 
 * // Get total
 * const total = await cartPage.getTotalPrice();
 * 
 * // Remove all items
 * await cartPage.removeAllProducts();
 */

/**
 * PRODUCT PAGE OBJECT MODEL
 * 
 * This page represents the product detail page shown when clicking on a product.
 * Users can view product details and add/remove the product from cart.
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Optional properties with '?'
 * - Object types and interfaces
 * - Null handling
 */

import { Page } from '@playwright/test';

// TYPESCRIPT LEARNING: INTERFACE
// An interface defines the shape of an object
// It specifies what properties an object should have and their types
// This is like a contract - any object of this type must have these properties
interface ProductDetails {
  // TYPESCRIPT: Each property has a name and a type
  name: string;           // Product name (required)
  description: string;    // Product description (required)
  price: string;          // Product price as string (e.g., "$29.99")
  
  // TYPESCRIPT: The '?' makes a property optional
  // This means the property might not exist on the object
  imageUrl?: string;      // Optional: Product image URL
}

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // LOCATORS

  get backToProductsButton() {
    return this.page.locator('[data-test="back-to-products"]');
  }

  get productName() {
    return this.page.locator('.inventory_details_name');
  }

  get productDescription() {
    return this.page.locator('.inventory_details_desc');
  }

  get productPrice() {
    return this.page.locator('.inventory_details_price');
  }

  get productImage() {
    return this.page.locator('.inventory_details_img');
  }

  get addToCartButton() {
    return this.page.locator('button:has-text("Add to cart")');
  }

  get removeButton() {
    return this.page.locator('button:has-text("Remove")');
  }

  get shoppingCartBadge() {
    return this.page.locator('.shopping_cart_badge');
  }

  get shoppingCartLink() {
    return this.page.locator('.shopping_cart_link');
  }

  // METHODS

  /**
   * Check if we're on a product detail page
   */
  async isOnProductPage(): Promise<boolean> {
    return await this.productName.isVisible();
  }

  /**
   * Add the product to cart
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Remove the product from cart
   */
  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  /**
   * Check if product is in cart (Remove button is visible)
   */
  async isInCart(): Promise<boolean> {
    return await this.removeButton.isVisible();
  }

  /**
   * Go back to products list
   */
  async goBackToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  /**
   * Go to shopping cart
   */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Get the product name
   * TYPESCRIPT: Returns Promise<string>
   */
  async getProductName(): Promise<string> {
    // TYPESCRIPT: textContent() returns Promise<string | null>
    // We use '|| ""' to provide a default empty string if null
    return await this.productName.textContent() || '';
  }

  /**
   * Get the product description
   */
  async getProductDescription(): Promise<string> {
    return await this.productDescription.textContent() || '';
  }

  /**
   * Get the product price
   */
  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  /**
   * Get the product image URL
   * TYPESCRIPT: Returns Promise<string | null>
   * Could be null if the image doesn't have a src attribute
   */
  async getProductImageUrl(): Promise<string | null> {
    return await this.productImage.getAttribute('src');
  }

  /**
   * Get all product details as an object
   * TYPESCRIPT: Returns Promise<ProductDetails>
   * ProductDetails is our custom interface defined above
   * 
   * This demonstrates how to return a structured object with specific types
   */
  async getProductDetails(): Promise<ProductDetails> {
    // Get all the product information
    const name = await this.getProductName();
    const description = await this.getProductDescription();
    const price = await this.getProductPrice();
    const imageUrl = await this.getProductImageUrl();

    // TYPESCRIPT: Return an object that matches the ProductDetails interface
    // TypeScript will check that this object has all required properties
    // and that they're the correct types
    return {
      name,           // Shorthand for name: name
      description,    // Shorthand for description: description
      price,
      // TYPESCRIPT: imageUrl is optional (has '?'), so it's okay if it's null
      // We use '|| undefined' to convert null to undefined
      imageUrl: imageUrl || undefined
    };
  }

  /**
   * Get the cart item count
   * TYPESCRIPT: Returns Promise<number>
   */
  async getCartItemCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    
    if (!isVisible) {
      return 0;
    }
    
    const text = await this.shoppingCartBadge.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * Verify product details match expected values
   * TYPESCRIPT: Takes a Partial<ProductDetails> parameter
   * 'Partial<T>' is a built-in TypeScript utility type
   * It makes all properties of T optional
   * So we can pass an object with only some of the ProductDetails properties
   * 
   * @param expected - Expected product details (all properties optional)
   * @returns true if all provided properties match
   */
  async verifyProductDetails(expected: Partial<ProductDetails>): Promise<boolean> {
    const actual = await this.getProductDetails();
    
    // TYPESCRIPT: Check each property if it was provided in 'expected'
    // 'in' operator checks if a property exists in an object
    if ('name' in expected && actual.name !== expected.name) {
      return false;
    }
    
    if ('description' in expected && actual.description !== expected.description) {
      return false;
    }
    
    if ('price' in expected && actual.price !== expected.price) {
      return false;
    }
    
    if ('imageUrl' in expected && actual.imageUrl !== expected.imageUrl) {
      return false;
    }
    
    // All checks passed
    return true;
  }

  /**
   * Get the numeric price value (without $)
   * TYPESCRIPT: Returns Promise<number>
   * Converts "$29.99" to 29.99
   */
  async getNumericPrice(): Promise<number> {
    const priceText = await this.getProductPrice();
    // Remove the '$' and convert to number
    return parseFloat(priceText.replace('$', ''));
  }
}

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. INTERFACE: Define object shapes
 *    interface ProductDetails { name: string; price: string; }
 * 
 * 2. OPTIONAL PROPERTIES: Properties that might not exist
 *    imageUrl?: string;
 * 
 * 3. OBJECT LITERAL: Creating objects with specific properties
 *    return { name, description, price };
 * 
 * 4. PROPERTY SHORTHAND: name instead of name: name
 *    { name } is the same as { name: name }
 * 
 * 5. NULL COALESCING: Provide default values for null
 *    value || defaultValue
 * 
 * 6. UNION TYPES: Value can be one of multiple types
 *    Promise<string | null>
 * 
 * 7. UTILITY TYPES: Built-in TypeScript helpers
 *    Partial<ProductDetails> makes all properties optional
 * 
 * 8. IN OPERATOR: Check if property exists in object
 *    'name' in expected
 * 
 * 9. TYPE CONVERSION: Convert between types
 *    parseFloat(string) converts string to number
 * 
 * 10. RETURN TYPE INFERENCE: TypeScript can figure out return types
 *     But it's better to be explicit with Promise<Type>
 * 
 * EXAMPLE USAGE:
 * 
 * const productPage = new ProductPage(page);
 * 
 * // Get all details
 * const details = await productPage.getProductDetails();
 * console.log(details.name);  // TypeScript knows this is a string
 * 
 * // Verify specific details
 * const matches = await productPage.verifyProductDetails({
 *   name: 'Sauce Labs Backpack',
 *   price: '$29.99'
 * });
 * 
 * // Add to cart
 * await productPage.addToCart();
 */

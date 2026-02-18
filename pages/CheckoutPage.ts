/**
 * CHECKOUT PAGE OBJECT MODEL
 * 
 * This page represents the checkout process with multiple steps:
 * 1. Checkout Information (enter name and postal code)
 * 2. Checkout Overview (review order)
 * 3. Checkout Complete (confirmation)
 * 
 * TYPESCRIPT LEARNING FOCUS:
 * - Form handling and validation
 * - Multiple methods for different checkout steps
 * - Error handling patterns
 */

import { Page } from '@playwright/test';

// TYPESCRIPT LEARNING: INTERFACE FOR CHECKOUT INFO
// This defines the structure for checkout form data
interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // LOCATORS - CHECKOUT INFORMATION STEP

  get firstNameInput() {
    return this.page.locator('[data-test="firstName"]');
  }

  get lastNameInput() {
    return this.page.locator('[data-test="lastName"]');
  }

  get postalCodeInput() {
    return this.page.locator('[data-test="postalCode"]');
  }

  get continueButton() {
    return this.page.locator('[data-test="continue"]');
  }

  get cancelButton() {
    return this.page.locator('[data-test="cancel"]');
  }

  get errorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  // LOCATORS - CHECKOUT OVERVIEW STEP

  get finishButton() {
    return this.page.locator('[data-test="finish"]');
  }

  get subtotalLabel() {
    return this.page.locator('.summary_subtotal_label');
  }

  get taxLabel() {
    return this.page.locator('.summary_tax_label');
  }

  get totalLabel() {
    return this.page.locator('.summary_total_label');
  }

  get paymentInfo() {
    return this.page.locator('[data-test="payment-info-value"]');
  }

  get shippingInfo() {
    return this.page.locator('[data-test="shipping-info-value"]');
  }

  // LOCATORS - CHECKOUT COMPLETE STEP

  get completeHeader() {
    return this.page.locator('.complete-header');
  }

  get completeText() {
    return this.page.locator('.complete-text');
  }

  get backHomeButton() {
    return this.page.locator('[data-test="back-to-products"]');
  }

  // METHODS - CHECKOUT INFORMATION STEP

  /**
   * Fill in the checkout information form
   * TYPESCRIPT: Takes a CheckoutInfo object parameter
   * This ensures all required fields are provided
   * 
   * @param info - Object containing firstName, lastName, postalCode
   */
  async fillCheckoutInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  /**
   * Fill checkout form with individual parameters
   * TYPESCRIPT: Alternative method with separate parameters
   * This is more flexible but requires all three parameters
   * 
   * @param firstName - Customer's first name
   * @param lastName - Customer's last name
   * @param postalCode - Customer's postal/zip code
   */
  async fillCheckoutForm(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Click the continue button to proceed to overview
   */
  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Complete the checkout information step
   * TYPESCRIPT: Combines filling form and clicking continue
   * 
   * @param info - Checkout information object
   */
  async completeCheckoutInfo(info: CheckoutInfo): Promise<void> {
    await this.fillCheckoutInfo(info);
    await this.continue();
  }

  /**
   * Cancel checkout and return to cart
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Get the error message text
   * TYPESCRIPT: Returns Promise<string | null>
   */
  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  /**
   * Check if there's an error message displayed
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  // METHODS - CHECKOUT OVERVIEW STEP

  /**
   * Get the subtotal amount
   * TYPESCRIPT: Returns Promise<number>
   * Extracts the numeric value from "Item total: $29.99"
   */
  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent() || '';
    // Extract the number after the dollar sign
    const match = text.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the tax amount
   * TYPESCRIPT: Returns Promise<number>
   */
  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent() || '';
    const match = text.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the total amount
   * TYPESCRIPT: Returns Promise<number>
   */
  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent() || '';
    const match = text.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get payment information
   */
  async getPaymentInfo(): Promise<string> {
    return await this.paymentInfo.textContent() || '';
  }

  /**
   * Get shipping information
   */
  async getShippingInfo(): Promise<string> {
    return await this.shippingInfo.textContent() || '';
  }

  /**
   * Verify the total matches subtotal + tax
   * TYPESCRIPT: Returns Promise<boolean>
   * Demonstrates mathematical operations with floating point numbers
   */
  async verifyTotal(): Promise<boolean> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    
    // TYPESCRIPT: Calculate expected total
    const expectedTotal = subtotal + tax;
    
    // TYPESCRIPT: Compare with small tolerance for floating point precision
    // Math.abs() gets absolute value, we check if difference is less than 0.01
    return Math.abs(total - expectedTotal) < 0.01;
  }

  /**
   * Click finish to complete the order
   */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  // METHODS - CHECKOUT COMPLETE STEP

  /**
   * Check if we're on the checkout complete page
   */
  async isOrderComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }

  /**
   * Get the completion message header
   */
  async getCompleteHeader(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }

  /**
   * Get the completion message text
   */
  async getCompleteText(): Promise<string> {
    return await this.completeText.textContent() || '';
  }

  /**
   * Go back to home/products page
   */
  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  // HELPER METHODS

  /**
   * Complete the entire checkout process
   * TYPESCRIPT: Demonstrates a high-level method that combines multiple steps
   * This is useful for tests that need to complete checkout quickly
   * 
   * @param info - Checkout information
   */
  async completeCheckout(info: CheckoutInfo): Promise<void> {
    // Step 1: Fill and submit checkout info
    await this.completeCheckoutInfo(info);
    
    // Step 2: Finish the order
    await this.finish();
  }

  /**
   * Check if we're on the checkout information step
   */
  async isOnCheckoutInfoStep(): Promise<boolean> {
    return await this.firstNameInput.isVisible();
  }

  /**
   * Check if we're on the checkout overview step
   */
  async isOnCheckoutOverviewStep(): Promise<boolean> {
    return await this.finishButton.isVisible();
  }
}

/**
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * 
 * 1. INTERFACE FOR FORM DATA: Structure for related data
 *    interface CheckoutInfo { firstName: string; lastName: string; }
 * 
 * 2. OBJECT PARAMETERS: Pass multiple values as one object
 *    async fillCheckoutInfo(info: CheckoutInfo)
 * 
 * 3. MULTIPLE PARAMETERS: Traditional parameter list
 *    async fillCheckoutForm(firstName: string, lastName: string, postalCode: string)
 * 
 * 4. REGULAR EXPRESSIONS: Pattern matching in strings
 *    text.match(/\$(\d+\.\d+)/)
 * 
 * 5. OPTIONAL CHAINING: Safe property access
 *    match ? parseFloat(match[1]) : 0
 * 
 * 6. MATHEMATICAL OPERATIONS: Arithmetic with numbers
 *    subtotal + tax, Math.abs(difference)
 * 
 * 7. FLOATING POINT COMPARISON: Handle precision issues
 *    Math.abs(total - expectedTotal) < 0.01
 * 
 * 8. HIGH-LEVEL METHODS: Combine multiple steps
 *    async completeCheckout() calls multiple other methods
 * 
 * 9. STRING METHODS: Text manipulation
 *    text.match(), parseFloat()
 * 
 * 10. LOGICAL OPERATORS: Boolean logic
 *     isVisible() returns boolean, used in conditions
 * 
 * EXAMPLE USAGE:
 * 
 * const checkoutPage = new CheckoutPage(page);
 * 
 * // Fill checkout info with object
 * await checkoutPage.fillCheckoutInfo({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   postalCode: '12345'
 * });
 * 
 * // Or use individual parameters
 * await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
 * 
 * // Complete entire checkout
 * await checkoutPage.completeCheckout({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   postalCode: '12345'
 * });
 * 
 * // Verify totals
 * const isCorrect = await checkoutPage.verifyTotal();
 * 
 * // Check completion
 * const isComplete = await checkoutPage.isOrderComplete();
 */

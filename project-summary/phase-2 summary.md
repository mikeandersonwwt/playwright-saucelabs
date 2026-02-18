# Phase 2: Page Object Models - Summary

## Overview

Phase 2 focused on creating Page Object Models (POM) for all major pages in the SauceDemo application. We built 5 TypeScript classes that encapsulate page elements and interactions, making tests more maintainable, reusable, and readable.

---

## What We Built

### 1. LoginPage.ts
**Purpose:** Handles login page interactions

**Key Features:**
- Username and password input locators
- Login method that fills credentials and clicks login
- Error message handling
- Individual field methods for flexible testing

**TypeScript Concepts:**
- Classes and constructors
- Readonly properties
- Getter methods
- Async methods with Promise return types
- Union types (`string | null`)
- The `this` keyword

**Methods:**
- `goto()` - Navigate to login page
- `login(username, password)` - Complete login flow
- `getErrorMessage()` - Get error text
- `isOnLoginPage()` - Verify page location
- `fillUsername()`, `fillPassword()`, `clickLogin()` - Individual actions

---

### 2. InventoryPage.ts
**Purpose:** Manages product inventory/catalog page

**Key Features:**
- Product listing and sorting
- Add/remove products from cart
- Cart badge counter
- Multiple product operations

**TypeScript Concepts:**
- String literal types (`type SortOption = 'az' | 'za' | 'lohi' | 'hilo'`)
- Array types (`string[]`, `number[]`)
- For...of loops
- Array map() function
- Template literals
- Method chaining

**Methods:**
- `sortProducts(option)` - Sort by name or price
- `addProductToCart(name)` - Add single product
- `addMultipleProductsToCart(names)` - Add multiple products
- `getCartItemCount()` - Get cart badge number
- `getAllProductNames()` - Get array of product names
- `getAllProductPrices()` - Get array of prices as numbers
- `isProductInCart(name)` - Check if product added
- `logout()` - Sign out via burger menu

---

### 3. ProductPage.ts
**Purpose:** Handles individual product detail pages

**Key Features:**
- Product information extraction
- Add/remove from cart
- Structured product data
- Detail verification

**TypeScript Concepts:**
- Interfaces (`interface ProductDetails`)
- Optional properties (`imageUrl?: string`)
- Object literals
- Property shorthand (`{ name, price }`)
- Utility types (`Partial<ProductDetails>`)
- The `in` operator
- Type conversion (`parseFloat`)

**Methods:**
- `addToCart()`, `removeFromCart()` - Cart operations
- `getProductName()`, `getProductPrice()`, `getProductDescription()` - Get details
- `getProductDetails()` - Get all info as structured object
- `verifyProductDetails(expected)` - Verify against expected values
- `getNumericPrice()` - Get price as number
- `goBackToProducts()` - Return to inventory

**Interface:**
```typescript
interface ProductDetails {
  name: string;
  description: string;
  price: string;
  imageUrl?: string;  // Optional
}
```

---

### 4. CartPage.ts
**Purpose:** Manages shopping cart page

**Key Features:**
- View cart items
- Remove items
- Calculate totals
- Sort and filter items

**TypeScript Concepts:**
- Interfaces for complex objects (`interface CartItem`)
- Arrays of objects (`CartItem[]`)
- For loops with index
- Array methods (map, reduce, find, sort)
- Arrow functions
- Default parameters (`ascending: boolean = true`)
- Optional return types (`CartItem | undefined`)

**Methods:**
- `getCartItemCount()` - Count items
- `removeProduct(name)` - Remove single item
- `removeAllProducts()` - Clear cart
- `getAllCartItems()` - Get structured array of items
- `getTotalPrice()` - Sum all prices
- `findCartItem(name)` - Find specific item
- `getCartItemsSortedByPrice(ascending)` - Sort by price
- `isEmpty()` - Check if cart empty
- `checkout()` - Proceed to checkout

**Interface:**
```typescript
interface CartItem {
  name: string;
  description: string;
  price: string;
  quantity: number;
}
```

---

### 5. CheckoutPage.ts
**Purpose:** Handles multi-step checkout process

**Key Features:**
- Form filling (name, postal code)
- Order review and totals
- Order completion
- Error handling

**TypeScript Concepts:**
- Interfaces for form data (`interface CheckoutInfo`)
- Object parameters vs individual parameters
- Regular expressions (`text.match(/\$(\d+\.\d+)/)`)
- Mathematical operations
- Floating point comparison
- High-level methods combining multiple steps

**Methods:**
- `fillCheckoutInfo(info)` - Fill form with object
- `fillCheckoutForm(firstName, lastName, postalCode)` - Fill with parameters
- `completeCheckoutInfo(info)` - Fill and continue
- `getSubtotal()`, `getTax()`, `getTotal()` - Extract amounts
- `verifyTotal()` - Verify math is correct
- `finish()` - Complete order
- `completeCheckout(info)` - Full checkout flow
- `isOrderComplete()` - Check completion

**Interface:**
```typescript
interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}
```

---

## Project Structure After Phase 2

```
playwright-saucelabs/
├── pages/
│   ├── LoginPage.ts          ✅ Created
│   ├── InventoryPage.ts      ✅ Created
│   ├── ProductPage.ts        ✅ Created
│   ├── CartPage.ts           ✅ Created
│   └── CheckoutPage.ts       ✅ Created
├── tests/
│   └── hello-world.spec.ts
├── test-data/
│   ├── users.json
│   └── products.json
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## TypeScript Concepts Learned

### 1. **Classes**
```typescript
export class LoginPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
}
```
- Blueprint for creating objects
- Can have properties and methods
- `constructor` initializes the object

### 2. **Interfaces**
```typescript
interface ProductDetails {
  name: string;
  price: string;
  imageUrl?: string;  // Optional
}
```
- Define the shape of objects
- Specify required and optional properties
- Provide type safety

### 3. **Type Annotations**
```typescript
async login(username: string, password: string): Promise<void>
```
- Specify parameter types
- Specify return types
- Help catch errors early

### 4. **Getters**
```typescript
get usernameInput() {
  return this.page.locator('#user-name');
}
```
- Methods that act like properties
- Access with `loginPage.usernameInput` (no parentheses)
- Create fresh locators each time

### 5. **String Literal Types**
```typescript
type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
```
- Restrict to specific string values
- TypeScript enforces only these values allowed
- Better than plain `string` type

### 6. **Array Types**
```typescript
string[]          // Array of strings
number[]          // Array of numbers
CartItem[]        // Array of CartItem objects
```
- Specify what's in the array
- TypeScript checks array operations

### 7. **Optional Properties**
```typescript
interface ProductDetails {
  imageUrl?: string;  // Might not exist
}
```
- Use `?` to make properties optional
- Value can be the type or `undefined`

### 8. **Union Types**
```typescript
Promise<string | null>
Promise<CartItem | undefined>
```
- Value can be one of multiple types
- Use `|` to separate types

### 9. **Utility Types**
```typescript
Partial<ProductDetails>  // All properties optional
```
- Built-in TypeScript helpers
- Transform existing types

### 10. **Array Methods**
```typescript
array.map(item => transform(item))     // Transform each
array.filter(item => condition)        // Keep matching
array.find(item => condition)          // Find first match
array.reduce((acc, item) => acc + item, 0)  // Combine
array.sort((a, b) => a - b)            // Sort
```
- Functional programming patterns
- Work with arrays efficiently

---

## Page Object Model Pattern

### What is POM?

Page Object Model is a design pattern where:
- Each page/component has its own class
- Locators are defined in one place
- Actions are methods
- Tests use these methods instead of raw locators

### Benefits

**1. Reusability**
```typescript
// Without POM - repeated in every test
await page.locator('#user-name').fill('standard_user');
await page.locator('#password').fill('secret_sauce');
await page.locator('#login-button').click();

// With POM - one line
await loginPage.login('standard_user', 'secret_sauce');
```

**2. Maintainability**
If a locator changes, update only the page object:
```typescript
// Change this once in LoginPage.ts
get usernameInput() {
  return this.page.locator('#username');  // Changed from #user-name
}
// All tests automatically use the new locator
```

**3. Readability**
```typescript
// Clear and readable
await loginPage.login('standard_user', 'secret_sauce');
await inventoryPage.addProductToCart('Sauce Labs Backpack');
await inventoryPage.goToCart();
await cartPage.checkout();
```

**4. Encapsulation**
- Hide implementation details
- Tests don't need to know about locators
- Change internal implementation without breaking tests

---

## How to Use Page Objects

### Basic Usage
```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test('add product to cart', async ({ page }) => {
  // Create page objects
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  
  // Use page object methods
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
});
```

### With Interfaces
```typescript
import { CheckoutPage } from '../pages/CheckoutPage';

test('complete checkout', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  
  // Use interface for type safety
  await checkoutPage.completeCheckout({
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  });
});
```

### Chaining Page Objects
```typescript
test('full user journey', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.goToCart();
  await cartPage.checkout();
  await checkoutPage.completeCheckout({
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  });
});
```

---

## Key Takeaways

### TypeScript Benefits
✅ **Type Safety** - Catch errors before running tests  
✅ **Autocomplete** - IDE suggests methods and properties  
✅ **Documentation** - Types serve as inline documentation  
✅ **Refactoring** - Safely rename and restructure code  

### POM Benefits
✅ **Maintainable** - Update locators in one place  
✅ **Reusable** - Use same methods across tests  
✅ **Readable** - Tests read like user actions  
✅ **Testable** - Easy to add new test scenarios  

### Best Practices
✅ One page object per page/component  
✅ Use getters for locators (fresh each time)  
✅ Use async methods for actions  
✅ Return structured data with interfaces  
✅ Provide both simple and complex methods  
✅ Add helper methods for common workflows  

---

## What's Next?

**Phase 3: First Feature Tests (Using POM)**

In the next phase, we'll:
- Write actual tests using our page objects
- Test login functionality (valid/invalid credentials)
- Test inventory page (viewing products, adding to cart)
- Test basic user flows
- Learn test structure and organization
- Practice assertions with Playwright
- See the benefits of POM in action

---

## Questions to Review

Before moving to Phase 3, make sure you understand:

1. ✅ What is a class and how do you create one?
2. ✅ What is a constructor and when does it run?
3. ✅ What is the difference between a property and a method?
4. ✅ What are getters and why use them for locators?
5. ✅ What is an interface and how is it different from a class?
6. ✅ What does the `?` mean in `imageUrl?: string`?
7. ✅ What is a union type (`string | null`)?
8. ✅ What is the Page Object Model pattern?
9. ✅ Why is POM better than using locators directly in tests?
10. ✅ How do you create and use a page object in a test?

---

## File Summary

| File | Lines | Key Features |
|------|-------|--------------|
| LoginPage.ts | ~200 | Classes, constructors, getters, async methods |
| InventoryPage.ts | ~260 | String literals, arrays, loops, map() |
| ProductPage.ts | ~250 | Interfaces, optional properties, Partial<T> |
| CartPage.ts | ~280 | Array methods, reduce, find, sort |
| CheckoutPage.ts | ~300 | Form handling, regex, math operations |

**Total:** ~1,290 lines of well-documented TypeScript code

---

**Phase 2 Status:** ✅ Complete  
**Ready for Phase 3:** Yes  
**Page Objects Created:** 5/5

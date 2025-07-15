# SpendWise E2E Tests with Cypress

This directory contains end-to-end tests for the SpendWise expense tracker application using Cypress.

## Test Files

### 1. `smoke.cy.ts`
Basic smoke tests to ensure the application loads and routes work correctly.

### 2. `add-expense.cy.ts` 
Comprehensive tests for the Add Expense functionality including:
- Complete form filling and submission flow
- Form validation testing
- Navigation verification
- Integration with expense list

### 3. `dashboard.cy.ts`
Tests for dashboard functionality and expense display components.

## Running Tests

### Prerequisites
Make sure the Angular development server is running:
```bash
npm start
```

### Run Tests

#### Interactive Mode (Cypress GUI)
```bash
npm run e2e:open
```

#### Headless Mode (CI/CD)
```bash
npm run e2e
```

#### Headless with specific browser
```bash
npm run e2e:headless
```

#### Run App and Tests Together
```bash
npm run start:e2e
```

## Test Scenarios Covered

### Add Expense Flow
1. **Happy Path**: Complete form submission with valid data
   - Amount: 120.50
   - Category: Food
   - Date: Today's date
   - Note: "Lunch at restaurant"
   - Verification: New expense appears in list

2. **Validation Testing**:
   - Required field validation
   - Amount format validation
   - Negative amount validation
   - Form state management

3. **User Interactions**:
   - Cancel functionality
   - Character count for notes
   - Button state management

### Integration Tests
- Navigation between pages
- Filter functionality on expense list
- Search functionality
- Dashboard data display

## Test Data
Tests use the sample data provided by the `ExpenseStateService` and create new test expenses during execution.

## Best Practices Implemented

1. **Robust Selectors**: Using `formControlName` and semantic selectors
2. **Wait Strategies**: Proper waiting for elements and navigation
3. **Assertions**: Comprehensive verification of UI state and data
4. **Isolation**: Each test is independent and can run in any order
5. **Page Object Pattern**: Could be implemented for larger test suites

## Configuration

The Cypress configuration is in `cypress.config.ts`:
- Base URL: `http://localhost:4200`
- Viewport: 1280x720
- Video recording: Disabled
- Screenshots on failure: Enabled

## Debugging

1. Use `cy.pause()` to pause test execution
2. Use `cy.debug()` to debug specific elements
3. Use `cy.screenshot()` to capture screenshots at specific points
4. Check the Cypress GUI for detailed test execution

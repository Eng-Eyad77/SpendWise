/// <reference types="cypress" />

describe('Add Expense Flow', () => {
  beforeEach(() => {
    // Start the app and navigate to the add expense page
    cy.visit('/expenses/add')
  })

  it('should successfully add a new expense and navigate to expense list', () => {
    // Get today's date in YYYY-MM-DD format for the date input
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]

    // Fill out the expense form
    cy.get('input[formControlName="amount"]')
      .should('be.visible')
      .type('120.50')

    cy.get('select[formControlName="category"]')
      .should('be.visible')
      .select('Food')

    cy.get('input[formControlName="date"]')
      .should('be.visible')
      .clear()
      .type(todayString)

    cy.get('textarea[formControlName="note"]')
      .should('be.visible')
      .type('Lunch at restaurant')

    // Verify form values are correctly entered
    cy.get('input[formControlName="amount"]').should('have.value', '120.50')
    cy.get('select[formControlName="category"]').should('have.value', 'Food')
    cy.get('input[formControlName="date"]').should('have.value', todayString)
    cy.get('textarea[formControlName="note"]').should('have.value', 'Lunch at restaurant')

    // Submit the form
    cy.get('button[type="submit"]')
      .should('be.visible')
      .should('not.be.disabled')
      .should('contain.text', 'Add Expense')
      .click()

    // Verify navigation to expense list
    cy.url().should('include', '/expenses/list')

    // Wait for the page to load and verify the new expense appears in the list
    cy.get('.expense-card').should('have.length.at.least', 1)

    // Find the expense card containing our new expense
    cy.get('.expense-card').first().within(() => {
      // Verify the amount
      cy.get('.expense-amount').should('contain.text', '$120.50')
      
      // Verify the category
      cy.get('.category-badge').should('contain.text', 'FOOD')
      
      // Verify the note
      cy.get('.expense-note').should('contain.text', 'Lunch at restaurant')
    })

    // Alternative verification: Check if the expense appears anywhere in the list
    cy.contains('$120.50').should('be.visible')
    cy.contains('FOOD').should('be.visible')
    cy.contains('Lunch at restaurant').should('be.visible')
  })

  it('should show validation errors for invalid form submission', () => {
    // Try to submit empty form
    cy.get('button[type="submit"]').click()

    // Form should not navigate (stay on add page)
    cy.url().should('include', '/expenses/add')

    // Check for validation errors
    cy.get('input[formControlName="amount"]').should('have.class', 'error')
    cy.get('select[formControlName="category"]').should('have.class', 'error')

    // Check error messages
    cy.get('.error-message').should('contain.text', 'Amount is required')
    cy.get('.error-message').should('contain.text', 'Category is required')
  })

  it('should validate amount field properly', () => {
    // Test invalid amount (negative)
    cy.get('input[formControlName="amount"]').type('-10')
    cy.get('select[formControlName="category"]').select('Food')
    cy.get('button[type="submit"]').click()

    cy.get('.error-message').should('contain.text', 'Amount must be greater than 0')

    // Test invalid amount (not a number)
    cy.get('input[formControlName="amount"]').clear().type('abc')
    cy.get('button[type="submit"]').click()

    cy.get('.error-message').should('contain.text', 'Please enter a valid amount')

    // Test valid amount
    cy.get('input[formControlName="amount"]').clear().type('25.99')
    cy.get('button[type="submit"]').click()

    // Should navigate successfully
    cy.url().should('include', '/expenses/list')
  })

  it('should allow canceling the form and navigate to dashboard', () => {
    // Fill out some form data
    cy.get('input[formControlName="amount"]').type('50.00')
    cy.get('textarea[formControlName="note"]').type('Test expense')

    // Click cancel button
    cy.get('button').contains('Cancel').click()

    // Should navigate to dashboard
    cy.url().should('include', '/expenses/dashboard')
  })

  it('should show character count for note field', () => {
    const testNote = 'This is a test note'
    
    cy.get('textarea[formControlName="note"]').type(testNote)
    
    // Check character count
    cy.get('.character-count').should('contain.text', `${testNote.length}/500`)
  })

  it('should disable submit button when form is invalid', () => {
    // Initially, submit button should be disabled (empty form)
    cy.get('button[type="submit"]').should('be.disabled')

    // Fill required fields
    cy.get('input[formControlName="amount"]').type('120.50')
    cy.get('select[formControlName="category"]').select('Food')

    // Now submit button should be enabled
    cy.get('button[type="submit"]').should('not.be.disabled')

    // Clear a required field
    cy.get('input[formControlName="amount"]').clear()

    // Submit button should be disabled again
    cy.get('button[type="submit"]').should('be.disabled')
  })
})

describe('Expense List Integration', () => {
  it('should filter expenses by category', () => {
    // Navigate to expense list
    cy.visit('/expenses/list')

    // Select Food category filter
    cy.get('select[formControlName="category"]').select('Food')

    // All visible expense cards should be Food category
    cy.get('.expense-card').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.category-badge').should('contain.text', 'FOOD')
      })
    })
  })

  it('should search expenses by text', () => {
    cy.visit('/expenses/list')

    // Search for "lunch"
    cy.get('input[formControlName="searchText"]').type('lunch')

    // Should show expenses containing "lunch" in note or category
    cy.get('.expense-card').should('have.length.at.least', 1)
    cy.get('.expense-card').each(($card) => {
      cy.wrap($card).should('contain.text', 'lunch', { matchCase: false })
    })
  })

  it('should clear all filters', () => {
    cy.visit('/expenses/list')

    // Apply some filters
    cy.get('select[formControlName="category"]').select('Food')
    cy.get('input[formControlName="searchText"]').type('test')

    // Click clear filters
    cy.get('button').contains('Clear Filters').click()

    // Filters should be reset
    cy.get('select[formControlName="category"]').should('have.value', '')
    cy.get('input[formControlName="searchText"]').should('have.value', '')
  })
})

describe('Navigation Integration', () => {
  it('should navigate between pages using navbar', () => {
    cy.visit('/')

    // Navigate to dashboard
    cy.get('nav a').contains('Dashboard').click()
    cy.url().should('include', '/expenses/dashboard')

    // Navigate to expense list
    cy.get('nav a').contains('Expenses').click()
    cy.url().should('include', '/expenses/list')

    // Navigate to add expense
    cy.get('nav a').contains('Add Expense').click()
    cy.url().should('include', '/expenses/add')
  })

  it('should use floating action button to add expense', () => {
    cy.visit('/expenses/list')

    // Click the floating action button
    cy.get('.fab').should('be.visible').click()

    // Should navigate to add expense page
    cy.url().should('include', '/expenses/add')
  })
})

/// <reference types="cypress" />

describe('Dashboard Functionality', () => {
  beforeEach(() => {
    cy.visit('/expenses/dashboard')
  })

  it('should display dashboard with sample data', () => {
    // Check total expenses card
    cy.get('.total-expenses').should('be.visible')
    cy.get('.total-expenses .amount').should('contain.text', '$')
    cy.get('.total-expenses').should('contain.text', 'Total Expenses')

    // Check expense distribution section
    cy.get('.expense-distribution').should('be.visible')
    cy.get('.expense-distribution').should('contain.text', 'Expense Distribution')

    // Check category summary
    cy.get('.category-summary').should('be.visible')
    cy.get('.category-summary').should('contain.text', 'Category Summary')

    // Check recent expenses section
    cy.get('.recent-expenses').should('be.visible')
    cy.get('.recent-expenses').should('contain.text', 'Recent Expenses')
  })

  it('should display sample expenses in recent expenses section', () => {
    // Should show some expense items
    cy.get('.recent-expenses app-expense-item').should('have.length.at.least', 1)
    
    // Each expense item should have required elements
    cy.get('app-expense-item').first().within(() => {
      cy.get('.category-badge').should('be.visible')
      cy.get('.expense-amount').should('be.visible')
      cy.get('.expense-date').should('be.visible')
    })
  })

  it('should display category summary with progress bars', () => {
    cy.get('.category-summary .summary-item').should('have.length.at.least', 1)
    
    // Each summary item should have the required elements
    cy.get('.summary-item').first().within(() => {
      cy.get('.category-name').should('be.visible')
      cy.get('.category-percentage').should('be.visible')
      cy.get('.progress-bar').should('be.visible')
      cy.get('.category-amount').should('be.visible')
    })
  })

  it('should have working "Add New Expense" button', () => {
    cy.get('.total-expenses .btn').contains('Add New Expense').click()
    cy.url().should('include', '/expenses/add')
  })

  it('should have working "View all expenses" link', () => {
    // Only test if the link exists (it may not if there are less than 5 expenses)
    cy.get('body').then(($body) => {
      if ($body.find('.view-all').length > 0) {
        cy.get('.view-all').click()
        cy.url().should('include', '/expenses/list')
      }
    })
  })

  it('should display chart container', () => {
    cy.get('.chart-container').should('be.visible')
    cy.get('.chart-container app-expense-chart').should('exist')
  })
})

describe('Expense Item Component', () => {
  beforeEach(() => {
    cy.visit('/expenses/list')
  })

  it('should display expense items with proper formatting', () => {
    cy.get('app-expense-item').should('have.length.at.least', 1)
    
    cy.get('app-expense-item').first().within(() => {
      // Check that amount is formatted as currency
      cy.get('.expense-amount').should('contain.text', '$')
      
      // Check that category badge is present
      cy.get('.category-badge').should('be.visible')
      
      // Check that date is formatted properly
      cy.get('.expense-date').should('be.visible')
      
      // Note might be optional
      cy.get('body').then(($body) => {
        if ($body.find('.expense-note').length > 0) {
          cy.get('.expense-note').should('be.visible')
        }
      })
    })
  })
})

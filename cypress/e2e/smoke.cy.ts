/// <reference types="cypress" />

describe('SpendWise Application Smoke Tests', () => {
  it('should load the application successfully', () => {
    cy.visit('/')
    
    // Check that the navbar is present
    cy.get('app-navbar').should('be.visible')
    cy.get('nav').should('contain.text', 'SpendWise')
    
    // Check that router-outlet is present
    cy.get('router-outlet').should('exist')
  })

  it('should redirect to expenses dashboard by default', () => {
    cy.visit('/')
    cy.url().should('include', '/expenses')
  })

  it('should display navigation links', () => {
    cy.visit('/')
    
    // Check all navigation links are present
    cy.get('nav a').contains('Dashboard').should('be.visible')
    cy.get('nav a').contains('Expenses').should('be.visible')
    cy.get('nav a').contains('Add Expense').should('be.visible')
  })

  it('should have working page routes', () => {
    // Test dashboard route
    cy.visit('/expenses/dashboard')
    cy.get('app-dashboard').should('exist')
    
    // Test expense list route
    cy.visit('/expenses/list')
    cy.get('app-expense-list').should('exist')
    
    // Test add expense route
    cy.visit('/expenses/add')
    cy.get('app-add-expense').should('exist')
  })
})

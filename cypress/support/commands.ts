Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('[data-cy=login-email]').type(email)
  cy.get('[data-cy=login-password]').type(password)
  cy.get('[data-cy=login-submit]').click()
  cy.url().should('include', '/dashboard')
})

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
    }
  }
}

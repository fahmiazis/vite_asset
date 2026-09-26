describe('Login flow', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('halaman login tampil dengan benar', () => {
    cy.get('[data-cy=login-email]').should('be.visible')
    cy.get('[data-cy=login-password]').should('be.visible')
    cy.get('[data-cy=login-submit]').should('be.visible')
  })

  it('berhasil login dengan kredensial valid', () => {
    cy.fixture('user').then((user) => {
cy.get('[data-cy=login-email]').type(user.username)
      cy.get('[data-cy=login-password]').type(user.password)
      cy.get('[data-cy=login-submit]').click()
      cy.url().should('include', '/dashboard')
    })
  })

  it('gagal login dengan password salah', () => {
    cy.get('[data-cy=login-email]').type('user@example.com')
    cy.get('[data-cy=login-password]').type('wrongpassword')
    cy.get('[data-cy=login-submit]').click()
    cy.get('[data-cy=login-error]').should('be.visible')
    cy.url().should('include', '/login')
  })

  it('tidak bisa submit form kosong', () => {
    cy.get('[data-cy=login-submit]').click()
    cy.url().should('include', '/login')
  })
})
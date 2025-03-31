describe('Put privacy setting test', () => {
  beforeEach(() => {

    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/settings', { timeout: 10000 })
  })

  it('changes account type to private', () => {

    cy.intercept('PUT', '**/api/privacy-settings').as('updatePrivacy')
    cy.get('select[id="account-select"]').select('private')
    cy.wait('@updatePrivacy').its('response.statusCode').should('eq', 200)
  })

  it('changes account type to public', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/privacy-settings').as('updatePrivacy')
    cy.get('select[id="account-select"]').select('public')
    cy.wait('@updatePrivacy').its('response.statusCode').should('eq', 200)
  })

  it('changes who can comment to subscribers', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/privacy-settings').as('updatePrivacy')
    cy.get('select[id="comment-select"]').select('only_subscribers')
    cy.wait('@updatePrivacy').its('response.statusCode').should('eq', 200)
  })

  it('changes who can comment to all', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/privacy-settings').as('updatePrivacy')
    cy.get('select[id="comment-select"]').select('all')
    cy.wait('@updatePrivacy').its('response.statusCode').should('eq', 200)
  })

  it('changes who can repost to none', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/privacy-settings').as('updatePrivacy')
    cy.get('select[id="repost-select"]').select('none')
    cy.wait('@updatePrivacy').its('response.statusCode').should('eq', 200)
  })

  it('changes who can comment to all', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/privacy-settings').as('updatePrivacy')
    cy.get('select[id="repost-select"]').select('all')
    cy.wait('@updatePrivacy').its('response.statusCode').should('eq', 200)
  })

  it('changes who can message to subscriptions', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/privacy-settings').as('updatePrivacy')
    cy.get('select[id="message-select"]').select('only_my_subscriptions')
    cy.wait('@updatePrivacy').its('response.statusCode').should('eq', 200)
  })

  it('changes who can message to all', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/privacy-settings').as('updatePrivacy')
    cy.get('select[id="message-select"]').select('all')
    cy.wait('@updatePrivacy').its('response.statusCode').should('eq', 200)
  })

})

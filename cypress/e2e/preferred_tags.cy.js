describe('Preferred tags Tests', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/settings', {timeout: 10000})
  })

  it('loads settings page with privacy tags', () => {
    cy.intercept('GET', '**/api/preferredTags').as('getTags')
    cy.wait('@getTags').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
      expect(response.body.data).to.be.an('array')
    })
  })

  it('add preferred tag', () => {
    cy.intercept('POST', '**/api/preferredTag').as('addTags')

    cy.get('input[placeholder="Enter tag"]').type('tag1')
    cy.contains('div', 'Add').should('exist').click()

    cy.wait('@addTags').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('delete preferred tag', () => {
    cy.wait(1000)
    cy.intercept('DELETE', '**/api/preferredTag?id=*').as('deleteTag');

    cy.contains('div', 'tag1').should('exist').click()
    cy.contains('div', 'Delete').should('exist').click()

    cy.wait('@deleteTag').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

})

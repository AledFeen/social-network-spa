describe('Settings Page Tests', () => {
  beforeEach(() => {

    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/settings', { timeout: 10000 })
  })

  it('loads settings page with privacy settings', () => {
    cy.intercept('GET', '**/api/privacy-settings').as('getPrivacy')

    cy.wait('@getPrivacy').its('response').should((response) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.include.all.keys([
        'user_id',
        'account_type',
        'who_can_comment',
        'who_can_repost',
        'who_can_message',
      ])
    })
  })

  it('changes theme to dark', () => {
    cy.get('input[type="radio"][value="dark"]').check()
    cy.url().should('eq', 'http://localhost:5173/settings')
    cy.then(() => {
      expect(localStorage.getItem('theme')).to.eq('dark')
    })
  })

  it('changes theme to light', () => {
    cy.get('input[type="radio"][value="light"]').check()
    cy.url().should('eq', 'http://localhost:5173/settings')
    cy.then(() => {
      expect(localStorage.getItem('theme')).to.eq('light')
    })
  })

  it('changes language to Ukrainian', () => {
    cy.get('select#locale-select').select('ua')
    cy.wait(500)
    cy.then(() => {
      expect(localStorage.getItem('appLocale')).to.eq('ua')
    })
    cy.get('.text-lg').contains('Тема').should('be.visible')
  })

  it('changes language to English', () => {
    cy.get('select#locale-select').select('en').trigger('change')
    cy.wait(500)
    cy.then(() => {
      expect(localStorage.getItem('appLocale')).to.eq('en')
    });
    cy.get('.text-lg').contains('Theme').should('be.visible')
  })

})

describe('test sub req', () => {

  it('test accept sub request', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321',
      })
    })

    cy.visit('/profile/user2', {timeout: 5000})
    cy.get('div.bg-btn_back-secondary')
      .should('have.text', 'Subscribe')
      .should('have.class', 'bg-btn_back-secondary')
      .click()
    cy.wait(1000)

    cy.get('div.me-3').find('img[alt="closeSidebar"]').parent().click()
    cy.get('img[alt="Dropdown"]').click()
    cy.contains('Logout').click()

    cy.visit('/', {timeout: 5000})
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('POST', '**/api/accept-request').as('request')

    cy.visit('/sub-requests', {timeout: 3000})

    cy.contains('div.w-full', 'admin')
      .within(() => {
        cy.get('input[type="submit"]')
          .filter('[value="Accept"]')
          .should('be.visible')
          .click();
      })

    cy.wait('@request').its('response.statusCode').should('eq', 201)
  })

  it('test delete subscriber', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('DELETE', 'http://localhost:8000/api/delete-subscriber?user_id=7').as('request')

    cy.visit('/profile/admin', {timeout: 3000})

    cy.get('img[alt=profileSettings]').click()
    cy.contains('div', 'Delete subscriber').click()

    cy.wait('@request').its('response.statusCode').should('eq', 200)
  })


  it('test accept sub request', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321',
      })
    })

    //cy.request('POST','http://localhost:8000/api/subscribe', {user_id: 2})
    cy.visit('/profile/user2', {timeout: 5000})
    cy.get('div.bg-btn_back-secondary')
      .should('have.text', 'Subscribe')
      .should('have.class', 'bg-btn_back-secondary')
      .click()
    cy.wait(1000)

    cy.get('div.me-3').find('img[alt="closeSidebar"]').parent().click()
    cy.get('img[alt="Dropdown"]').click()
    cy.contains('Logout').click()

    cy.visit('/', {timeout: 5000})
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('DELETE', '**/api/decline-request*').as('request')

    cy.visit('/sub-requests', {timeout: 3000})

    cy.contains('div.w-full', 'admin')
      .within(() => {
        cy.get('input[type="submit"]')
          .filter('[value="Decline"]')
          .should('be.visible')
          .click()
      })

    cy.wait('@request').its('response.statusCode').should('eq', 200)
  })

})

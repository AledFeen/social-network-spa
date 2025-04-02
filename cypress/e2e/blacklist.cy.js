describe('Blacklist system test', () => {
  it('load blacklist', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      });
    });

    cy.intercept('GET', '**/api/blocked-users?page_id=1').as('users')

    cy.visit('/blocked-list', { timeout: 10000 })

    cy.wait('@users')
      .its('response')
      .should((response) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body, 'Тело ответа должно существовать').to.exist

        const users = response.body.data
        expect(users, 'users должен быть массивом').to.be.an('array')
        expect(users).to.have.length(1)

        let user = users[0]
        expect(user).to.have.all.keys(['id', 'name', 'image'])
        expect(user.id).to.eq(4)
        expect(user.name).to.eq('user4')
        expect(user.image).to.eq('default_avatar')

        expect(response.body).to.have.property('last_page').that.equals(1)
        expect(response.body).to.have.property('current_page').that.equals(1)
        expect(response.body).to.have.property('total').that.equals(1)
      })
  })


  it('test block user', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321',
      })
    })

    cy.visit('/profile/user2', {timeout: 5000})

    cy.intercept('POST', '**/api/block-user').as('request')

    cy.get('img[alt=profileSettings]').click()
    cy.contains('div', 'Ban user').click()

    cy.wait('@request').its('response.statusCode').should('eq', 200)

  })

  it('test unblock user', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321',
      })
    })

    cy.visit('/blocked-list', {timeout: 5000})

    cy.intercept('DELETE', 'http://localhost:8000/api/unblock-user?user_id=2').as('request')

    cy.contains('div.w-full', 'user2')
      .within(() => {
        cy.get('input[type="submit"]')
          .filter('[value="Decline"]')
          .should('be.visible')
          .click();
      })

    cy.wait('@request').its('response.statusCode').should('eq', 200)
  })

})

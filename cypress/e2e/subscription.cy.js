describe('Subscribe system test', () => {

  it('load subscriptions myself', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/subscriptions?user_id=2&page_id=1').as('subscription')

    cy.visit('/subscriptions/2', {timeout: 10000})

    cy.wait('@subscription')
      .its('response')
      .should((response) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body, 'Тело ответа должно существовать').to.exist

        const users = response.body.data
        expect(users, 'users должен быть массивом').to.be.an('array')
        expect(users).to.have.length(1)

        const user = users[0]
        expect(user).to.have.all.keys(['id', 'name', 'image'])
        expect(user.id).to.eq(1)
        expect(user.name).to.eq('user1')
        expect(user.image).to.eq('default_avatar')

        expect(response.body).to.have.property('last_page').that.equals(1)
        expect(response.body).to.have.property('current_page').that.equals(1)
        expect(response.body).to.have.property('total').that.equals(1)
      })
  })

  it('load subscriptions by another user', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/subscriptions?user_id=2&page_id=1').as('subscription')

    cy.visit('/subscriptions/2', {timeout: 10000})

    cy.wait('@subscription')
      .its('response')
      .should((response) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body, 'Тело ответа должно существовать').to.exist

        const users = response.body.data
        expect(users, 'users должен быть массивом').to.be.an('array')
        expect(users).to.have.length(1)

        const user = users[0]
        expect(user).to.have.all.keys(['id', 'name', 'image'])
        expect(user.id).to.eq(1)
        expect(user.name).to.eq('user1')
        expect(user.image).to.eq('default_avatar')

        expect(response.body).to.have.property('last_page').that.equals(1)
        expect(response.body).to.have.property('current_page').that.equals(1)
        expect(response.body).to.have.property('total').that.equals(1)
      })
  })

  it('load subscribers myself', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/subscribers?user_id=2&page_id=1').as('subscribers')

    cy.visit('/subscribers/2', {timeout: 10000})

    cy.wait('@subscribers')
      .its('response')
      .should((response) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body, 'Тело ответа должно существовать').to.exist

        const users = response.body.data
        expect(users, 'users должен быть массивом').to.be.an('array')
        expect(users).to.have.length(2)

        let user = users[0]
        expect(user).to.have.all.keys(['id', 'name', 'image'])
        expect(user.id).to.eq(1)
        expect(user.name).to.eq('user1')
        expect(user.image).to.eq('default_avatar')

        user = users[1]
        expect(user).to.have.all.keys(['id', 'name', 'image'])
        expect(user.id).to.eq(3)
        expect(user.name).to.eq('user3')
        expect(user.image).to.eq('default_avatar')

        expect(response.body).to.have.property('last_page').that.equals(1)
        expect(response.body).to.have.property('current_page').that.equals(1)
        expect(response.body).to.have.property('total').that.equals(2)
      })
  })

  it('load subscribers by another user', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/subscribers?user_id=2&page_id=1').as('subscribers')

    cy.visit('/subscribers/2', {timeout: 10000})

    cy.wait('@subscribers')
      .its('response')
      .should((response) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body, 'Тело ответа должно существовать').to.exist

        const users = response.body.data
        expect(users, 'users должен быть массивом').to.be.an('array')
        expect(users).to.have.length(2)

        let user = users[0]
        expect(user).to.have.all.keys(['id', 'name', 'image'])
        expect(user.id).to.eq(1)
        expect(user.name).to.eq('user1')
        expect(user.image).to.eq('default_avatar')

        user = users[1]
        expect(user).to.have.all.keys(['id', 'name', 'image'])
        expect(user.id).to.eq(3)
        expect(user.name).to.eq('user3')
        expect(user.image).to.eq('default_avatar')

        expect(response.body).to.have.property('last_page').that.equals(1)
        expect(response.body).to.have.property('current_page').that.equals(1)
        expect(response.body).to.have.property('total').that.equals(2)
      })
  })


  ///sub requests

  it('load sub requests', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/subscription-requests?page_id=1').as('request')

    cy.visit('/sub-requests', {timeout: 10000})

    cy.wait('@request')
      .its('response')
      .should((response) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body, 'Тело ответа должно существовать').to.exist

        const users = response.body.data
        expect(users, 'users должен быть массивом').to.be.an('array')
        expect(users).to.have.length(1)

        let user = users[0]
        expect(user).to.have.all.keys(['id', 'user', 'created_at'])
        user = users[0].user
        expect(user).to.have.all.keys(['id', 'name', 'image'])
        expect(user.id).to.eq(4)
        expect(user.name).to.eq('user4')
        expect(user.image).to.eq('default_avatar')

        expect(response.body).to.have.property('last_page').that.equals(1)
        expect(response.body).to.have.property('current_page').that.equals(1)
        expect(response.body).to.have.property('total').that.equals(1)
      })
  })

  it('test subscribe', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('POST', '**/api/subscribe').as('subscribe')

    cy.visit('/profile/user1', {timeout: 10000})

    cy.wait(2000)

    cy.get('div.bg-btn_back-secondary')
      .should('have.text', 'Subscribe')
      .should('have.class', 'bg-btn_back-secondary')
      .click();

    cy.wait('@subscribe').its('response.statusCode').should('eq', 201)
  })

  it('test unsubscribe', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('DELETE', '**/api/unsubscribe*').as('subscribe')

    cy.visit('/profile/user1', {timeout: 10000})

    cy.wait(2000)

    cy.get('div.bg-btn_back-secondary')
      .should('have.text', 'Unsubscribe')
      .should('have.class', 'bg-btn_back-secondary')
      .click();

    cy.wait('@subscribe').its('response.statusCode').should('eq', 200)
  })

  it('test make sub request', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('POST', '**/api/subscribe-request').as('subscribe')

    cy.visit('/profile/user2', {timeout: 10000})

    cy.get('div.bg-btn_back-secondary')
      .should('have.text', 'Subscribe')
      .should('have.class', 'bg-btn_back-secondary')
      .click();

    cy.wait('@subscribe').its('response.statusCode').should('eq', 201)
  })

  it('test decline sub request by myself', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('DELETE', '**/api/unsubscribe*').as('subscribe')

    cy.visit('/profile/user2', {timeout: 10000})

    cy.get('div.bg-btn_back-secondary')
      .should('have.text', 'Decline request')
      .should('have.class', 'bg-btn_back-secondary')
      .click();

    cy.wait('@subscribe').its('response.statusCode').should('eq', 200)
  })

})

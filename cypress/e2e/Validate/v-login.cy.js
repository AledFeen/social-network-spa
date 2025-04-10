describe('Validate login', () => {

  it('login in successfully and redirects to home', () => {
    cy.visit('/login', { timeout: 1000 });
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]').type('user1@gmail.com')
    cy.get('input[type="password"]').type('12344321')
    cy.get('input[type="submit"]').click()
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 204)
  })

  it('login unncorrect email', () => {
    cy.visit('/login', { timeout: 1000 });
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]').type('us@gmail.com')
    cy.get('input[type="password"]').type('12344321')
    cy.get('input[type="submit"]').click()
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "These credentials do not match our records.",
        errors: {
          "email": [
            "These credentials do not match our records."
          ]
        }
      })
    })
  })

  it('login unncorrect pass', () => {
    cy.visit('/login', { timeout: 1000 });
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]').type('user1@gmail.com')
    cy.get('input[type="password"]').type('1234')
    cy.get('input[type="submit"]').click()
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "These credentials do not match our records.",
        errors: {
          email: [
            "These credentials do not match our records."
          ]
        }
      })
    })
  })

  it('login null email', () => {
    cy.visit('/login', { timeout: 1000 });
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]')
    cy.get('input[type="password"]').type('12344321')
    cy.get('input[type="submit"]').click()
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The email field is required.",
        errors: {
          "email": [
            "The email field is required."
          ]
        }
      })
    })
  })

  it('login unncorrect format email', () => {
    cy.visit('/login', { timeout: 1000 });
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]').type('user@.com')
    cy.get('input[type="password"]').type('12344321')
    cy.get('input[type="submit"]').click()
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "These credentials do not match our records.",
        errors: {
          email: [
            "These credentials do not match our records."
          ]
        }
      })
    })
  })

  it('login nullable field', () => {
    cy.visit('/login', {timeout: 1000});
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]')
    cy.get('input[type="password"]')
    cy.get('input[type="submit"]').click()
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The email field is required. (and 1 more error)",
        errors: {
          email: [
            "The email field is required."
          ],
          password: [
            "The password field is required."
          ]
        }
      })
    })
  })

  it('login unncorrect email', () => {
    cy.visit('/login', { timeout: 1000 });
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]').type(' user@gmail.com')
    cy.get('input[type="password"]').type('12344321')
    cy.get('input[type="submit"]').click()
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "These credentials do not match our records.",
        errors: {
          "email": [
            "These credentials do not match our records."
          ]
        }
      })
    })
  })

})

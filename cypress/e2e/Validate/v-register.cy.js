describe('Validate register', () => {

  //добавить корректный тест

  it('register uncorrect email', () => {
    cy.intercept('POST', '**/register').as('registerRequest')
    cy.visit('/register', {timeout: 1000});

    cy.get('input[type="text"]').type('Test User')
    cy.get('input[type="email"]').type('user@.com')
    cy.get('input[placeholder="Password"]').type('Password123')
    cy.get('input[placeholder="Confirm password"]').type('Password123')
    cy.get('input[type="submit"]').click()

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The email field must be a valid email address.",
        errors: {
          email: [
            "The email field must be a valid email address."
          ]
        }
      })
    })
  })

  it('register short pass', () => {
    cy.intercept('POST', '**/register').as('registerRequest')
    cy.visit('/register', {timeout: 1000});

    cy.get('input[type="text"]').type('Test User')
    cy.get('input[type="email"]').type('user@example.com')
    cy.get('input[placeholder="Password"]').type('pass')
    cy.get('input[placeholder="Confirm password"]').type('pass')
    cy.get('input[type="submit"]').click()

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The password field must be at least 8 characters.",
        errors: {
          password: [
            "The password field must be at least 8 characters."
          ]
        }
      })
    })
  })

  it('register null name', () => {
    cy.intercept('POST', '**/register').as('registerRequest')
    cy.visit('/register', {timeout: 1000});

    cy.get('input[type="text"]')
    cy.get('input[type="email"]').type('user@example.com')
    cy.get('input[placeholder="Password"]').type('pass1234')
    cy.get('input[placeholder="Confirm password"]').type('pass1234')
    cy.get('input[type="submit"]').click()

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The name field is required.",
        errors: {
          name: [
            "The name field is required."
          ]
        }
      })
    })
  })

  it('register taken email', () => {
    cy.intercept('POST', '**/register').as('registerRequest')
    cy.visit('/register', {timeout: 1000});

    cy.get('input[type="text"]').type('admin')
    cy.get('input[type="email"]').type('admin@gmail.com')
    cy.get('input[placeholder="Password"]').type('pass1234')
    cy.get('input[placeholder="Confirm password"]').type('pass1234')
    cy.get('input[type="submit"]').click()

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The email has already been taken.",
        errors: {
          email: [
            "The email has already been taken."
          ],
        }
      })
    })
  })

  it('register name with different pass', () => {
    cy.intercept('POST', '**/register').as('registerRequest')
    cy.visit('/register', {timeout: 1000});

    cy.get('input[type="text"]').type('user')
    cy.get('input[type="email"]').type('user14@gmail.com')
    cy.get('input[placeholder="Password"]').type('pass1234')
    cy.get('input[placeholder="Confirm password"]').type('pass12345')
    cy.get('input[type="submit"]').click()

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The password field confirmation does not match.",
        errors: {
          password: [
            "The password field confirmation does not match."
          ],
        }
      })
    })
  })

  it('register null email', () => {
    cy.intercept('POST', '**/register').as('registerRequest')
    cy.visit('/register', {timeout: 1000});

    cy.get('input[type="text"]').type('user')
    cy.get('input[type="email"]')
    cy.get('input[placeholder="Password"]').type('pass1234')
    cy.get('input[placeholder="Confirm password"]').type('pass1234')
    cy.get('input[type="submit"]').click()

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The email field is required.",
        errors: {
          email: [
            "The email field is required."
          ],
        }
      })
    })
  })

  it('register multi error email', () => {
    cy.intercept('POST', '**/register').as('registerRequest')
    cy.visit('/register', {timeout: 1000});

    cy.get('input[type="text"]').type('user')
    cy.get('input[type="email"]')
    cy.get('input[placeholder="Password"]').type('pass1234')
    cy.get('input[placeholder="Confirm password"]').type('pass12345')
    cy.get('input[type="submit"]').click()

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        "message": "The email field is required. (and 1 more error)",
        errors: {
          "email": [
            "The email field is required."
          ],
          password: [
            "The password field confirmation does not match."
          ]
        }
      })
    })
  })

  it('register correct user', () => {
    cy.intercept('POST', '**/register').as('registerRequest')
    cy.visit('/register', { timeout: 1000 });

    const shuffle = str => str.split('').sort(() => Math.random() - 0.5).join('');
    const str = shuffle('qwertyuiopasd')

    cy.get('input[type="text"]').type(str)
    cy.get('input[type="email"]').type(str + '@gmail.com')
    cy.get('input[placeholder="Password"]').type('12344321')
    cy.get('input[placeholder="Confirm password"]').type('12344321')
    cy.get('input[type="submit"]').click()

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201)
    cy.url().should('eq', 'http://localhost:5173/', { timeout: 1000 })
  })


})

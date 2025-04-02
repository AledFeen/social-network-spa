describe('Login and Logout Test with Real Server', () => {
  beforeEach(() => {
    cy.clearCookies()
  })

  it('shows connection error when server is unavailable', () => {
    cy.intercept('GET', '/api/checkAuth', {
      forceNetworkError: true, // Симулируем сбой сети
    }).as('checkAuth');

    cy.visit('/');

    cy.wait('@checkAuth')

    cy.get('.text-btn_back-primary')
      .should('be.visible')
      .and('contain', 'Connection error. Server does not respond.');
  });

  it('logs in failed login', () => {
    cy.visit('/login', { timeout: 1000 });
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]').type('user1@gmail.com')
    cy.get('input[type="password"]').type('1234')
    cy.get('input[type="submit"]').click()

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 422)
  })

  it('login in successfully and redirects to home', () => {
    cy.visit('/login', { timeout: 1000 });
    cy.intercept('POST', '**/login').as('loginRequest')
    cy.get('input[type="email"]').type('user1@gmail.com')
    cy.get('input[type="password"]').type('12344321')
    cy.get('input[type="submit"]').click()
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 204)
    cy.url().should('eq', 'http://localhost:5173/', { timeout: 1000 })
  })

  it('login in successfully by non-verified user', () => {
    cy.visit('/login', { timeout: 10000 });

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.intercept('POST', '**/login').as('loginRequest');
    cy.get('input[type="email"]').type('usernoverified@gmail.com');
    cy.get('input[type="password"]').type('12344321');
    cy.get('input[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 204);
    cy.url().should('eq', 'http://localhost:5173/', { timeout: 10000 });

    cy.intercept('GET', '**/my-avatar').as('avatar');
    cy.wait('@avatar').its('response.statusCode').should('eq', 403);

    cy.get('@alertStub').should('have.been.calledWith', 'Your email does not verified. Most features will not work. Check your email or resend letter.');
  });

  it('login in successfully by banned user', () => {
    cy.visit('/login', { timeout: 10000 });

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.intercept('POST', '**/login').as('loginRequest');
    cy.get('input[type="email"]').type('userbanned@gmail.com');
    cy.get('input[type="password"]').type('12344321');
    cy.get('input[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 204);
    cy.url().should('eq', 'http://localhost:5173/', { timeout: 10000 });

    cy.get('@alertStub').should('have.been.calledWith', 'Your account has been blocked');
  });

  it('logout in successfully and redirects to login', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8000/sanctum/csrf-cookie',
    }).then(() => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8000/login',
        body: {
          email: 'user1@gmail.com',
          password: '12344321',
        },
      });
    });

    cy.visit('/', { timeout: 1000 });
    cy.intercept('POST', '**/logout').as('logoutRequest')
    cy.get('div.me-3').find('img[alt="closeSidebar"]').parent().click()
    cy.get('img[alt="Dropdown"]').click()
    cy.contains('Logout').click()
    cy.wait('@logoutRequest').its('response.statusCode').should('eq', 204)
    cy.url().should('eq', 'http://localhost:5173/login', { timeout: 1000 })
  })

  it('register user', () => {
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

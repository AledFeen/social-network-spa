describe('Complaint', () => {
  it('complaint message', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321'
      })
    })
    cy.intercept('POST', '**/api/complaint*').as('createComplaint')

    cy.visit('/chat/2', { timeout: 10000 })

    cy.get('img[alt="Options third message"]').click()
    cy.contains('Complain').click()
    cy.get('textarea[placeholder="Describe reason for complaint"]').type('New message complaint')
    cy.get('input[id="send-complaint"]').click()

    cy.wait('@createComplaint').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send complaint profile', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('POST', '**/api/complaint*').as('createComplaint')

    cy.visit('/profile/user1', {timeout: 10000})
    cy.get('img[alt="profileSettings"]').click()
    cy.contains('Complain').click()

    cy.get('textarea[placeholder="Describe reason for complaint"]').type('New profile complaint')
    cy.get('input[id="send-complaint"]').click()

    cy.wait('@createComplaint').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send complaint post', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('POST', '**/api/complaint*').as('createComplaint')

    cy.visit('/post/1', {timeout: 10000})

    cy.get('img[alt="openPostDropdown"]').click()
    cy.contains('Complain').click()

    cy.get('textarea[placeholder="Describe reason for complaint"]').type('New post complaint')
    cy.get('input[id="send-complaint"]').click()

    cy.wait('@createComplaint').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send complaint comment', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('POST', '**/api/complaint*').as('createComplaint')

    cy.visit('/post/1', {timeout: 10000})

    cy.get('img[alt="openCommentMenu"]').click()
    cy.get('div[id="openComplaint"]').click()

    cy.get('textarea[placeholder="Describe reason for complaint"]').type('New comment complaint')
    cy.get('input[id="send-complaint"]').click()

    cy.wait('@createComplaint').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })


})

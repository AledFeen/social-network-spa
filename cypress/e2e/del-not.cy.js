describe('Del notifications', () => {
  it('delete notification subscribers', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('DELETE', '**/notification/followers*').as('deleteNotificationSubscribers')
    cy.visit('/notifications', { timeout: 10000 })

    cy.contains('You have new subscribers 1').click()
    cy.contains('Clear').click()

    cy.wait('@deleteNotificationSubscribers').its('response').then((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('delete notification comment replies', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('DELETE', '**/notification/comment-replies*').as('deleteNotificationReplies')

    cy.visit('/notifications', { timeout: 10000 })

    cy.contains('1 new comment replies').click()
    cy.contains('Clear').click()

    cy.wait('@deleteNotificationReplies').its('response').then((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })
})

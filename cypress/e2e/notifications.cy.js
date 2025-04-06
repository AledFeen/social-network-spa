describe('Notifications', () => {
  it('get notification comment replies', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/notification/comment-replies').as('getNotificationCommentReplies')

    cy.visit('/notifications', { timeout: 10000 })

    cy.wait('@getNotificationCommentReplies').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar"
            },
            post_id: 1,
            text: "reply to first comment"
          }
        ]
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((reply) => {
        delete reply.created_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get notification reposts', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/notification/reposts').as('getNotificationReposts')

    cy.visit('/notifications', { timeout: 10000 })

    cy.wait('@getNotificationReposts').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            user: {
              id: 8,
              name: "userDefault",
              image: "default_avatar"
            },
            post_id: 4,
            repost_id: 3
          }
        ]
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((repost) => {
        delete repost.created_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get subscription requests count', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/subscription-requests-count').as('getSubscriptionRequestsCount')

    cy.visit('/notifications', { timeout: 10000 })

    cy.wait('@getSubscriptionRequestsCount').its('response').then((response) => {
      const expectedResponse = {
        requestCount: 1
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get notification followers', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/notification/followers').as('getNotificationFollowers')

    cy.visit('/notifications', { timeout: 10000 })

    cy.wait('@getNotificationFollowers').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 2,
            follower: {
              id: 1,
              name: "user1",
              image: "default_avatar"
            }
          },
          {
            id: 3,
            follower: {
              id: 3,
              name: "user3",
              image: "default_avatar"
            }
          }
        ]
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((follower) => {
        delete follower.created_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get notification likes', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/notification/likes').as('getNotificationLikes')

    cy.visit('/notifications', { timeout: 10000 })

    cy.wait('@getNotificationLikes').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            user: {
              id: 1,
              name: "user1",
              image: "default_avatar"
            },
            post_id: 1
          }
        ]
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((like) => {
        delete like.created_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get notification comments', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/notification/comments').as('getNotificationComments')

    cy.visit('/notifications', { timeout: 10000 })

    cy.wait('@getNotificationComments').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            user: {
              id: 1,
              name: "user1",
              image: "default_avatar"
            },
            post_id: 1,
            text: "first comment to post"
          }
        ]
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((comment) => {
        delete comment.created_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })
})

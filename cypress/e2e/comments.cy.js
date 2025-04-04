describe('comments', () => {
  it('get comments for post', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('GET', '**/api/comments?post_id=1&page_id=1').as('getComments')

    cy.visit('/post/1', {timeout: 10000})

    cy.wait('@getComments').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            post_id: 1,
            user: {
              id: 1,
              name: "user1",
              image: "default_avatar"
            },
            text: "first comment to post",
            hasReplies: 1,
            files: []
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 1
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((comment) => {
        delete comment.created_at
        delete comment.updated_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get comments for admin', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('GET', '**/api/comments?post_id=1&page_id=1').as('getComments')

    cy.visit('/post/1', {timeout: 10000})

    cy.wait('@getComments').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            post_id: 1,
            user: {
              id: 1,
              name: "user1",
              image: "default_avatar"
            },
            text: "first comment to post",
            hasReplies: 1,
            files: []
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 1
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((comment) => {
        delete comment.created_at
        delete comment.updated_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get comments for admin', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('GET', '**/api/comments?post_id=1&page_id=1').as('getComments')

    cy.visit('/post/1', {timeout: 10000})

    cy.wait('@getComments').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            post_id: 1,
            user: {
              id: 1,
              name: "user1",
              image: "default_avatar"
            },
            text: "first comment to post",
            hasReplies: 1,
            files: []
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 1
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((comment) => {
        delete comment.created_at
        delete comment.updated_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get comment replies', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('GET', '**/api/comment-replies?reply_id=1&page_id=1').as('getCommentReplies')

    cy.visit('/post/1', {timeout: 10000})

    cy.contains('Count of answers 1').click()

    cy.wait('@getCommentReplies').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 2,
            post_id: 1,
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar"
            },
            text: "reply to first comment",
            hasReplies: 0,
            files: []
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 1
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((reply) => {
        delete reply.created_at
        delete reply.updated_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('should create comment', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.visit('/post/2', {timeout: 10000})

    cy.get('textarea').type('new comment')

    cy.contains('Leave comment').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('should create reply comment', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.visit('/post/2', {timeout: 10000})

    cy.contains('Make answer').click()

    cy.get('textarea[placeholder="Leave a reply"]').type('new reply')

    cy.contains('Leave a reply').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('should delete reply', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('DELETE', '**/api/comment*').as('deleteComment')

    cy.visit('/post/2', {timeout: 10000})

    cy.contains('Count of answers 1').click()

    cy.get('img[alt="openReplyMenu"]').click()
    cy.wait(200)
    cy.get('div[id="delete-reply-btn"]').click()

    cy.wait('@deleteComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('should delete comment', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('DELETE', '**/api/comment*').as('deleteComment')

    cy.visit('/post/2', {timeout: 10000})

    cy.get('img[alt="openCommentMenu"]').click()

    cy.contains('Delete').click()

    cy.wait('@deleteComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

})

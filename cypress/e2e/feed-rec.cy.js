describe('Test', () => {
  it('get feed posts', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'feed@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/feed-posts?page_id=1').as('getFeedPosts')

    cy.visit('/', {timeout: 10000})

    cy.wait('@getFeedPosts').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 5,
            user: {
              id: 10,
              name: "feeduser1",
              image: "default_avatar"
            },
            repost_id: null,
            location: "location2",
            text: "feed test post",
            repost_count: 0,
            like_count: 0,
            comment_count: 0,
            tags: [],
            files: [],
            main_post: null,
            is_liked: false
          },
          {
            id: 6,
            user: {
              id: 11,
              name: "feeduser2",
              image: "default_avatar"
            },
            repost_id: null,
            location: "location1",
            text: "second feed test post",
            repost_count: 0,
            like_count: 0,
            comment_count: 0,
            tags: [],
            files: [],
            main_post: null,
            is_liked: false
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 2
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((post) => {
        delete post.created_at
        delete post.updated_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })


  it('get req posts', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'req@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/recommended-posts?page_id=1').as('getRecommendedPosts')

    cy.visit('/', {timeout: 10000})

    cy.contains('Recommendations').click()

    cy.wait('@getRecommendedPosts').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 7,
            user: {
              id: 14,
              name: "requser2",
              image: "default_avatar"
            },
            repost_id: null,
            location: "location2",
            text: "req test post",
            repost_count: 0,
            like_count: 1,
            comment_count: 0,
            tags: [],
            files: [],
            main_post: null,
            is_liked: false
          },
          {
            id: 8,
            user: {
              id: 14,
              name: "requser2",
              image: "default_avatar"
            },
            repost_id: null,
            location: "location1",
            text: "second req test post",
            repost_count: 0,
            like_count: 0,
            comment_count: 0,
            tags: [
              {
                name: "rectag"
              }
            ],
            files: [],
            main_post: null,
            is_liked: false
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 2
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((post) => {
        delete post.created_at
        delete post.updated_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

})

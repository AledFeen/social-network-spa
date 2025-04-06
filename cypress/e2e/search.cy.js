describe('Search', () => {
  it('search profile', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/search-profile?search_request=feed&page_id=1').as('searchProfile')

    cy.visit('/search', { timeout: 10000 })

    cy.get('input[placeholder="Enter username"]').type('feed')
    cy.contains('Search').click()

    cy.wait('@searchProfile').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 9,
            name: "feeduser",
            image: "default_avatar"
          },
          {
            id: 10,
            name: "feeduser1",
            image: "default_avatar"
          },
          {
            id: 11,
            name: "feeduser2",
            image: "default_avatar"
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 3
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('search posts by text', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/search-posts?page_id=1&user=&text=second&location=').as('searchPosts')

    cy.visit('/search', { timeout: 10000 })

    cy.get('input[value="Post"]').click()
    cy.get('input[placeholder="Search by post text"]').type('second')
    cy.contains('Search').click()

    cy.wait('@searchPosts').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 5,
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
          },
          {
            id: 7,
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

  it('search posts with all filters', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/search-posts?page_id=1&user=requser2&text=second&location=location1&tags[]=rectag').as('searchPostsWithFilters')

    cy.visit('/search', { timeout: 10000 })

    cy.get('input[value="Post"]').click()
    cy.get('input[placeholder="Search by post text"]').type('second')
    cy.get('input[placeholder="Enter username"]').type('requser2')
    cy.get('input[placeholder="Enter location"]').type('location1')
    cy.contains('Save').click()
    cy.get('input[placeholder="Enter tag"]').type('rectag')
    cy.contains('Add').click()
    cy.contains('Search').click()

    cy.wait('@searchPostsWithFilters').its('response').then((response) => {
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
        total: 1
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

  it('search posts by user', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/search-posts?page_id=1&user=feeduser&text=&location=').as('searchPostsByUser')

    cy.visit('/search', { timeout: 10000 })

    cy.get('input[value="Post"]').click()
    cy.get('input[placeholder="Enter username"]').type('feeduser')
    cy.contains('Search').click()

    cy.wait('@searchPostsByUser').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 4,
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
            id: 5,
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


  it('search posts by location', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/search-posts?page_id=1&user=&text=&location=location2').as('searchPostsByLocation')

    cy.visit('/search', { timeout: 10000 })

    cy.get('input[value="Post"]').click()
    cy.get('input[placeholder="Enter location"]').type('location2')
    cy.contains('Save').click()
    cy.contains('Search').click()

    cy.wait('@searchPostsByLocation').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 4,
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

  it('search posts by tags', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/search-posts?page_id=1&user=&text=&location=&tags[]=rectag').as('searchPostsByTags')

    cy.visit('/search', { timeout: 10000 })

    cy.get('input[value="Post"]').click()
    cy.get('input[placeholder="Enter tag"]').type('rectag')
    cy.contains('Add').click()
    cy.contains('Search').click()

    cy.wait('@searchPostsByTags').its('response').then((response) => {
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
        total: 1
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

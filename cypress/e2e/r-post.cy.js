describe('post', () => {
  it('test edit post by non author', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('PUT', '**/api/post-location').as('location')
    cy.intercept('PUT', '**/api/post').as('post')
    cy.intercept('PUT', '**/api/post-tags').as('tags')
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.visit('/edit-post/1', {timeout: 10000})
    cy.contains('Post').click()

    cy.wait('@location').its('response').should((response) => {
      expect(response.statusCode).to.eq(400)
    })

    cy.wait('@post').its('response').should((response) => {
      expect(response.statusCode).to.eq(400)
    })

    cy.wait('@tags').its('response').should((response) => {
      expect(response.statusCode).to.eq(400)
    })

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(400)
    })
  })

  it('get profile posts by author', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/posts?user_id=2&page_id=1').as('getPosts');

    cy.visit('/profile/user2', {timeout: 10000})

    cy.wait('@getPosts').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar",
            },
            repost_id: null,
            location: "location",
            text: "solo test post",
            repost_count: 1,
            like_count: 2,
            comment_count: 2,
            tags: [],
            files: [],
            main_post: null,
            is_liked: true,
          },
          {
            id: 2,
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar",
            },
            repost_id: 1,
            location: "location1",
            text: "second test post",
            repost_count: 0,
            like_count: 0,
            comment_count: 0,
            tags: [],
            files: [],
            main_post: {
              id: 1,
              user: {
                id: 2,
                name: "user2",
                image: "default_avatar",
              },
              location: "location",
              text: "solo test post",
              tags: [],
              files: [],
            },
            is_liked: false,
          },
        ],
        current_page: 1,
        last_page: 1,
        total: 2,
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((post) => {
        delete post.created_at
        delete post.updated_at
        if (post.main_post) {
          delete post.main_post.created_at
          delete post.main_post.updated_at
        }
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get profile posts by subscriber', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/posts?user_id=2&page_id=1').as('getPosts');

    cy.visit('/profile/user2', {timeout: 10000})

    cy.wait('@getPosts').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar",
            },
            repost_id: null,
            location: "location",
            text: "solo test post",
            repost_count: 1,
            like_count: 2,
            comment_count: 2,
            tags: [],
            files: [],
            main_post: null,
            is_liked: true,
          },
          {
            id: 2,
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar",
            },
            repost_id: 1,
            location: "location1",
            text: "second test post",
            repost_count: 0,
            like_count: 0,
            comment_count: 0,
            tags: [],
            files: [],
            main_post: {
              id: 1,
              user: {
                id: 2,
                name: "user2",
                image: "default_avatar",
              },
              location: "location",
              text: "solo test post",
              tags: [],
              files: [],
            },
            is_liked: false,
          },
        ],
        current_page: 1,
        last_page: 1,
        total: 2,
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((post) => {
        delete post.created_at
        delete post.updated_at
        if (post.main_post) {
          delete post.main_post.created_at
          delete post.main_post.updated_at
        }
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get profile posts with no rights', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/posts?user_id=2&page_id=1').as('getPosts');

    cy.visit('/profile/user2', {timeout: 10000})

    cy.wait(2000).then(() => {
      cy.get('@getPosts.all').then((interceptions) => {
        expect(interceptions).to.have.length(0, 'Ожидалось, что запрос не отправится');
      })
    })
  })

  it('get post by author', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/post?post_id=1').as('getPost')

    cy.visit('/post/1', {timeout: 10000})

    cy.wait('@getPost').its('response').then((response) => {
      const expectedResponse = {
          data: {
            id: 1,
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar",
            },
            repost_id: null,
            location: "location",
            text: "solo test post",
            repost_count: 1,
            like_count: 2,
            comment_count: 2,
            tags: [],
            files: [],
            main_post: null,
            is_liked: true,
          },
      }

      const cleanResponse = Cypress._.cloneDeep(response.body);
      delete cleanResponse.data.created_at
      delete cleanResponse.data.updated_at

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get post by admin', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'admin@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/post?post_id=1').as('getPost')

    cy.visit('/post/1', {timeout: 10000})

    cy.wait('@getPost').its('response').then((response) => {
      const expectedResponse = {
        data: {
          id: 1,
          user: {
            id: 2,
            name: "user2",
            image: "default_avatar",
          },
          repost_id: null,
          location: "location",
          text: "solo test post",
          repost_count: 1,
          like_count: 2,
          comment_count: 2,
          tags: [],
          files: [],
          main_post: null,
          is_liked: false,
        },
      }

      const cleanResponse = Cypress._.cloneDeep(response.body);
      delete cleanResponse.data.created_at
      delete cleanResponse.data.updated_at

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get post by subscriber', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/post?post_id=1').as('getPost')

    cy.visit('/post/1', {timeout: 10000})

    cy.wait('@getPost').its('response').then((response) => {
      const expectedResponse = {
        data: {
          id: 1,
          user: {
            id: 2,
            name: "user2",
            image: "default_avatar",
          },
          repost_id: null,
          location: "location",
          text: "solo test post",
          repost_count: 1,
          like_count: 2,
          comment_count: 2,
          tags: [],
          files: [],
          main_post: null,
          is_liked: false,
        },
      }

      const cleanResponse = Cypress._.cloneDeep(response.body);
      delete cleanResponse.data.created_at
      delete cleanResponse.data.updated_at

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get post with no rights', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user4@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/post?post_id=1').as('getPost')

    cy.visit('/post/1', {timeout: 10000})

    cy.wait('@getPost').its('response').then((response) => {
      expect(response.statusCode).to.eq(403)
    })
  })

  it('get likes for post', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      }).then((response) => {
        expect(response.status).to.eq(200);
      })
    })

    cy.intercept('GET', '**/api/likes?post_id=1&page_id=1').as('getLikes');

    cy.visit('/post-likes/1', {timeout: 10000});

    cy.wait('@getLikes').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            name: "user1",
            image: "default_avatar",
          },
          {
            id: 2,
            name: "user2",
            image: "default_avatar",
          },
        ],
        current_page: 1,
        last_page: 1,
        total: 2,
      };

      const cleanResponse = Cypress._.cloneDeep(response.body);

      console.log('Фактический ответ:', JSON.stringify(cleanResponse))
      console.log('Ожидаемый ответ:', JSON.stringify(expectedResponse))

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get likes post with no rights', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user4@gmail.com',
        password: '12344321',
      }).then((response) => {
        expect(response.status).to.eq(200);
      })
    })

    cy.intercept('GET', '**/api/likes?post_id=1&page_id=1').as('getLikes');

    cy.visit('/post-likes/1', {timeout: 10000});

    cy.wait('@getLikes').its('response').then((response) => {
      expect(response.statusCode).to.eq(403)
    })
  })

  it('get reposts for post', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('GET', '**/api/reposts?post_id=1&page_id=1').as('getReposts')

    cy.visit('/reposts/1', { timeout: 10000 })

    cy.wait('@getReposts').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 2,
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar"
            },
            repost_id: 1,
            location: "location1",
            text: "second test post",
            repost_count: 0,
            like_count: 0,
            comment_count: 0,
            tags: [],
            files: [],
            main_post: {
              id: 1,
              user: {
                id: 2,
                name: "user2",
                image: "default_avatar"
              },
              location: "location",
              text: "solo test post",
              tags: [],
              files: []
            },
            is_liked: false
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 1
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((repost) => {
        delete repost.created_at
        delete repost.updated_at
        if (repost.main_post) {
          delete repost.main_post.created_at
          delete repost.main_post.updated_at
        }
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get reposts with no rights', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'userdefault@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('GET', '**/api/reposts?post_id=1&page_id=1').as('getReposts')

    cy.visit('/reposts/1', { timeout: 10000 })

    cy.wait('@getReposts').its('response').then((response) => {
      expect(response.statusCode).to.eq(403)
    })
  })

  it('dislike post ', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('POST', '**/api/like').as('likeRequest')

    cy.visit('/post/2', { timeout: 10000 })

    cy.get('img[alt="Like"]').click()

    cy.wait('@likeRequest').its('response').then((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('like post', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.intercept('POST', '**/api/like').as('likeRequest')

    cy.visit('/post/2', { timeout: 10000 })

    cy.get('img[alt="Like"]').click()

    cy.wait('@likeRequest').its('response').then((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })


})

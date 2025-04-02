describe('post', () => {
  it('test create post', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('POST', '**/api/post').as('request')

    cy.visit('/profile/user1', {timeout: 10000})

    cy.get('textarea').type('new post text')

    cy.get('img[alt="Emoji"]').click()
    cy.contains('😀').click()
    cy.get('img[alt="Emoji"]').click()

    cy.get('img[alt="Tag"]').click()
    cy.get('input[placeholder="Enter tag"]').type('tag1')
    cy.contains('Add').click()
    cy.get('img[alt="Tag"]').click()

    cy.get('img[alt="Location"]').click()
    cy.get('input[placeholder="Enter location"]').type('location')
    cy.contains('Save').click()
    cy.get('img[alt="Location"]').click()

    cy.get('input[type="file"]').attachFile({
      filePath: 'avatar.jpg',
      fileName: 'avatar.jpg',
      mimeType: 'image/jpeg',
    })

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('test edit post by non author', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
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

  it('test edit post by author', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })

    cy.visit('/profile/user1', {timeout: 10000})
    cy.wait(1000)

    cy.contains('div', 'new post text😀')
      .parents('div.flex.flex-row')
      .within(() => {
        cy.get('img[alt="DropdownPostMenu-location"]')
          .should('be.visible')
          .click()
      })
    cy.contains('Edit post').click()
    cy.wait(1000)

    cy.intercept('PUT', '**/api/post-location').as('location')
    cy.intercept('PUT', '**/api/post').as('post')
    cy.intercept('PUT', '**/api/post-tags').as('tags')
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.contains('location').click()
    cy.contains('Delete').click()

    cy.get('img[alt="Location"]').click()
    cy.get('input[placeholder="Enter location"]').type('location1')
    cy.contains('Save').click()
    cy.get('img[alt="Location"]').click()

    cy.contains('tag1').click()
    cy.contains('Delete').click()

    cy.get('img[alt="Tag"]').click()
    cy.get('input[placeholder="Enter tag"]').type('tag2')
    cy.contains('Add').click()
    cy.get('img[alt="Tag"]').click()

    cy.get('textarea')
      .clear()
      .type('new text')

    cy.contains('Post').click()

    cy.wait('@location').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.wait('@post').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.wait('@tags').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('delete post by author', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })

    cy.visit('/profile/user1', {timeout: 10000})
    cy.wait(1000)

    cy.intercept('DELETE', '**/api/post*').as('request')

    cy.contains('div', 'new text')
      .parents('div.flex.flex-row')
      .within(() => {
        cy.get('img[alt="DropdownPostMenu-location1"]')
          .should('be.visible')
          .click()
      })
    cy.contains('Delete').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })
})

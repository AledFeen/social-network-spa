describe('Edit Account Page Tests', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/edit-account', { timeout: 10000 });
  });

  it('loads account data with getAccount', () => {
    cy.intercept('GET', '**/api/my-account').as('getAccount');

    cy.wait('@getAccount').its('response').should((response) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.data).to.include.all.keys([
        'real_name',
        'location',
        'date_of_birth',
        'about_me',
        'image',
      ])
    })
  })

  it('updates account data with updateAccount', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/my-account').as('updateAccount')

    cy.get('input[id="updateAccountBtn"]').click()

    cy.wait('@updateAccount').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
      expect(response.body.success).to.eq(true)
    })
  })

  it('updates account image test', () => {
    cy.wait(1000)
    cy.intercept('POST', '**/api/profile-image').as('updateImage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'avatar.jpg',
      fileName: 'avatar.jpg',
      mimeType: 'image/jpeg',
    });

    cy.get('input[id="updateImageBtn"]').click()

    cy.wait('@updateImage').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.get('img[src="/src/assets/default_avatar.jpg"]').should('not.exist')
  })

  it('delete account image test', () => {
    cy.wait(1000)
    cy.intercept('DELETE', '**/api/profile-image').as('deleteImage')

    cy.get('input[id="deleteImageBtn"]').click()

    cy.wait('@deleteImage').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.get('img[src="/src/assets/default_avatar.jpg"]').should('exist')
  })


})

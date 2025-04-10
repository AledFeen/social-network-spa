describe('Validate account', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'validate@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/edit-account', { timeout: 10000 });
  })

  it('updates account image uncorrected', () => {
    cy.wait(1000)
    cy.intercept('POST', '**/api/profile-image').as('updateImage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'txt.txt',
      fileName: 'txt.txt',
    });

    cy.get('input[id="updateImageBtn"]').click()

    cy.wait('@updateImage').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The image field must be a file of type: jpeg, png, jpg, gif, svg.",
        errors: {
          image: [
            "The image field must be a file of type: jpeg, png, jpg, gif, svg."
          ]
        }
      })
    })

    cy.get('img[src="/src/assets/default_avatar.jpg"]').should('not.exist')
  })

  it('updates account image jpeg', () => {
    cy.wait(1000)
    cy.intercept('POST', '**/api/profile-image').as('updateImage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpeg.jpeg',
      fileName: 'jpeg.jpeg',
      mimeType: 'image/jpeg',
    });

    cy.get('input[id="updateImageBtn"]').click()

    cy.wait('@updateImage').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.get('img[src="/src/assets/default_avatar.jpg"]').should('not.exist')
  })

  it('updates account image jpg', () => {
    cy.wait(1000)
    cy.intercept('POST', '**/api/profile-image').as('updateImage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpg.jpg',
      fileName: 'jpg.jpg',
      mimeType: 'image/jpg',
    })

    cy.get('input[id="updateImageBtn"]').click()

    cy.wait('@updateImage').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.get('img[src="/src/assets/default_avatar.jpg"]').should('not.exist')
  })

  it('updates account image png', () => {
    cy.wait(1000)
    cy.intercept('POST', '**/api/profile-image').as('updateImage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'png.png',
      fileName: 'png.png',
      mimeType: 'image/png',
    })

    cy.get('input[id="updateImageBtn"]').click()

    cy.wait('@updateImage').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.get('img[src="/src/assets/default_avatar.jpg"]').should('not.exist')
  })

  it('updates account image gif', () => {
    cy.wait(1000)
    cy.intercept('POST', '**/api/profile-image').as('updateImage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'gif.gif',
      fileName: 'gif.gif',
      mimeType: 'image/gif',
    })

    cy.get('input[id="updateImageBtn"]').click()

    cy.wait('@updateImage').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.get('img[src="/src/assets/default_avatar.jpg"]').should('not.exist')
  })

  it('updates account image svg', () => {
    cy.wait(1000)
    cy.intercept('POST', '**/api/profile-image').as('updateImage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'svg.svg',
      fileName: 'svg.svg',
      mimeType: 'image/svg',
    })

    cy.get('input[id="updateImageBtn"]').click()

    cy.wait('@updateImage').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })

    cy.get('img[src="/src/assets/default_avatar.jpg"]').should('not.exist')
  })

  it('updates account data with same values', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/my-account').as('updateAccount')
    cy.get('input[id="updateAccountBtn"]').click()

    cy.wait('@updateAccount').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
      expect(response.body.success).to.eq(true)
    })
  })

  it('updates account data with real name 64', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/my-account').as('updateAccount')

    cy.get('input[id="real_name"]').type('gfsaThisNameIsExactlySixtyFourCharactersLongToTestTheMaxLimit1234')
    cy.get('input[id="date"]').clear()
    cy.get('input[id="location"]').clear()
    cy.get('textarea[id="about_me"]').clear()

    cy.get('input[id="updateAccountBtn"]').click()

    cy.wait('@updateAccount').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The real name field must not be greater than 64 characters.",
        errors: {
          real_name: [
            "The real name field must not be greater than 64 characters."
          ]
        }
      })
    })
  })

  it('updates account data with real name 63', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/my-account').as('updateAccount')

    cy.get('input[id="real_name"]').clear().type('ThisNameIsExactlySixtyFourCharactersLongToTestTheMaxLimit123')
    cy.get('input[id="date"]').clear()
    cy.get('input[id="location"]').clear()
    cy.get('textarea[id="about_me"]').clear()

    cy.get('input[id="updateAccountBtn"]').click()

    cy.wait('@updateAccount').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
  })

  it('updates account data with about 254', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/my-account').as('updateAccount')

    cy.get('input[id="real_name"]').clear()
    cy.get('input[id="date"]').clear()
    cy.get('input[id="location"]').clear()
    cy.get('textarea[id="about_me"]').clear().type('LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrurDolorInReprehenderitInVoluptateVelitEsseCillumDolasd')

    cy.get('input[id="updateAccountBtn"]').click()

    cy.wait('@updateAccount').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
  })

  it('updates account data with about 255', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/my-account').as('updateAccount')

    cy.get('input[id="real_name"]').clear()
    cy.get('input[id="date"]').clear()
    cy.get('input[id="location"]').clear()
    cy.get('textarea[id="about_me"]').clear().type('LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrurDolorInReprehenderitInVoluptateVelitEsseCillumDolasds')

    cy.get('input[id="updateAccountBtn"]').click()

    cy.wait('@updateAccount').then((interception) => {
      expect(interception.response.statusCode).to.eq(422)
      expect(interception.response.body).to.deep.equal({
        message: "The about me field must not be greater than 255 characters.",
        errors: {
          about_me: [
            "The about me field must not be greater than 255 characters."
          ]
        }
      })
    })
  })

  it('updates account data with location', () => {
    cy.wait(1000)
    cy.intercept('PUT', '**/api/my-account').as('updateAccount')

    cy.get('input[id="real_name"]').clear()
    cy.get('input[id="date"]').clear()
    cy.get('input[id="location"]').clear().type('location1')
    cy.get('textarea[id="about_me"]').clear()

    cy.get('input[id="updateAccountBtn"]').click()

    cy.wait('@updateAccount').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
  })


})

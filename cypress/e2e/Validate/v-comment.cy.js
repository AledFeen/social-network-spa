describe('validate comment', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'validate@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/post/10', {timeout: 10000});
  })


  it('should create comment 255', () => {

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.get('textarea').type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each .')

    cy.contains('Leave comment').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('should create comment 254', () => {

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.get('textarea').type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each.')

    cy.contains('Leave comment').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('should create comment with jpeg file', () => {

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.get('textarea').type('new')

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpeg.jpeg',
      fileName: 'jpeg.jpeg',
      mimeType: 'image/jpeg',
    })

    cy.contains('Leave comment').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('should create comment with jpg file', () => {

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.get('textarea').type('new')

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpg.jpg',
      fileName: 'jpg.jpg',
      mimeType: 'image/jpg',
    })

    cy.contains('Leave comment').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('should create comment with png file', () => {

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.get('textarea').type('new')

    cy.get('input[type="file"]').attachFile({
      filePath: 'png.png',
      fileName: 'png.png',
      mimeType: 'image/png',
    })

    cy.contains('Leave comment').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('should create comment with gif file', () => {

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.get('textarea').type('new')

    cy.get('input[type="file"]').attachFile({
      filePath: 'gif.gif',
      fileName: 'gif.gif',
      mimeType: 'image/gif',
    })

    cy.contains('Leave comment').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('should create comment with svg file', () => {

    cy.intercept('POST', '**/api/comment').as('addComment')

    cy.get('textarea').type('new')

    cy.get('input[type="file"]').attachFile({
      filePath: 'svg.svg',
      fileName: 'svg.svg',
      mimeType: 'image/svg+xml',
    })

    cy.contains('Leave comment').click()

    cy.wait('@addComment').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

})

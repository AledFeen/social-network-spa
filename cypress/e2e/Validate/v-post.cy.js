describe('Validate account', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'validate@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/profile/validateuser', {timeout: 10000});
  })

  it('create post all data', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')

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

  it('create post full nullable', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(400)
    })
  })

  it('create post only text 511', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility.')

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post only text 512', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .')

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('create post text 1 symbol', () => {

    cy.intercept('POST', '**/api/post').as('request')
    cy.get('textarea').type('1')
    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post text with symbols', () => {

    cy.intercept('POST', '**/api/post').as('request')
    cy.get('textarea').type('!@#$%^&*(_+_::"LLP><>M')
    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post location 64', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')
    cy.get('img[alt="Location"]').click()
    cy.get('input[placeholder="Enter location"]').type('ThequickckThequickckThequickckThequickckThequickckThequickckddddd')
    cy.contains('Save').click()
    cy.get('img[alt="Location"]').click()

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('create post location 63', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')
    cy.get('img[alt="Location"]').click()
    cy.get('input[placeholder="Enter location"]').type('ThequickckThequickckThequickckThequickckThequickckThequickckdddd')
    cy.contains('Save').click()
    cy.get('img[alt="Location"]').click()

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post location null', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')
    cy.get('img[alt="Location"]').click()
    cy.get('input[placeholder="Enter location"]')
    cy.contains('Save').click()
    cy.get('img[alt="Location"]').click()

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post location 1', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')
    cy.get('img[alt="Location"]').click()
    cy.get('input[placeholder="Enter location"]').type('1')
    cy.contains('Save').click()
    cy.get('img[alt="Location"]').click()

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post tag 32', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')
    cy.get('img[alt="Tag"]').click()
    cy.get('input[placeholder="Enter tag"]').type('ThequickckThequickckThequickckThe')
    cy.contains('Add').click()
    cy.get('img[alt="Tag"]').click()

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('create post tag 31', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')
    cy.get('img[alt="Tag"]').click()
    cy.get('input[placeholder="Enter tag"]').type('ThequickckThequickckThequickckTh')
    cy.contains('Add').click()
    cy.get('img[alt="Tag"]').click()

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post tag null', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')
    cy.get('img[alt="Tag"]').click()
    cy.get('input[placeholder="Enter tag"]')
    cy.contains('Add').click()
    cy.get('img[alt="Tag"]').click()

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post tag 1 symbol', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('textarea').type('new post text')
    cy.get('img[alt="Tag"]').click()
    cy.get('input[placeholder="Enter tag"]').type('1')
    cy.contains('Add').click()
    cy.get('img[alt="Tag"]').click()

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post file jpeg', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpeg.jpeg',
      fileName: 'jpeg.jpeg',
      mimeType: 'image/jpeg',
    })

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post file jpg', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpg.jpg',
      fileName: 'jpg.jpg',
      mimeType: 'image/jpg',
    })

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post file png', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('input[type="file"]').attachFile({
      filePath: 'png.png',
      fileName: 'png.png',
      mimeType: 'image/png',
    });

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post file gif', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('input[type="file"]').attachFile({
      filePath: 'gif.gif',
      fileName: 'gif.gif',
      mimeType: 'image/gif',
    })

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post file svg', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('input[type="file"]').attachFile({
      filePath: 'svg.svg',
      fileName: 'svg.svg',
      mimeType: 'image/svg+xml'
    })

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })


  it('create post file mp4', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('input[type="file"]').attachFile({
      filePath: 'mp4.mp4',
      fileName: 'mp4.mp4',
      mimeType: 'video/mp4'
    })

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('create post file uncorrect', () => {

    cy.intercept('POST', '**/api/post').as('request')

    cy.get('input[type="file"]').attachFile({
      filePath: 'txt.txt',
      fileName: 'txt.txt',
      mimeType: 'text/plain',
    })

    cy.contains('Post').click()

    cy.wait('@request').its('response').should((response) => {
      expect(response.statusCode).to.eq(400)
    })
  })

})

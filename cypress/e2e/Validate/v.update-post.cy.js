describe('Test', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'validate@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/edit-post/10', {timeout: 10000});
  })

  it('test edit post text 511', () => {
    cy.intercept('PUT', '**/api/post').as('post')

    cy.get('textarea').clear()
      .type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility.')


    cy.contains('Post').click()

    cy.wait('@post').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post text 512', () => {
    cy.intercept('PUT', '**/api/post').as('post')

    cy.get('textarea').clear()
      .type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .')

    cy.contains('Post').click()

    cy.wait('@post').its('response').should((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('test edit post location 63', () => {

    cy.intercept('PUT', '**/api/post-location').as('location')

    cy.get('div[id="select-location"]').click()
    cy.contains('Delete').click()


    cy.get('img[alt="Location"]').click()
    cy.get('input[placeholder="Enter location"]').type('ThequickckThequickckThequickckThequickckThequickckThequickckdddd')
    cy.contains('Save').click()
    cy.get('img[alt="Location"]').click()

    cy.contains('Post').click()

    cy.wait('@location').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post location 64', () => {

    cy.intercept('PUT', '**/api/post-location').as('location')

    cy.get('div[id="select-location"]').click()
    cy.contains('Delete').click()


    cy.get('img[alt="Location"]').click()
    cy.get('input[placeholder="Enter location"]').type('ThequickckThequickckThequickckThequickckThequickckThequickckddddd')
    cy.contains('Save').click()
    cy.get('img[alt="Location"]').click()

    cy.contains('Post').click()

    cy.wait('@location').its('response').should((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('test edit post tag 32', () => {
    cy.intercept('PUT', '**/api/post-tags').as('tags')

    cy.get('div[id="tag0"]').click()
    cy.contains('Delete').click()

    cy.get('img[alt="Tag"]').click()
    cy.get('input[placeholder="Enter tag"]').type('ThequickckThequickckThequickckThe')
    cy.contains('Add').click()
    cy.get('img[alt="Tag"]').click()

    cy.contains('Post').click()

    cy.wait('@tags').its('response').should((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('test edit post tag 31', () => {
    cy.intercept('PUT', '**/api/post-tags').as('tags')

    cy.get('div[id="tag0"]').click()
    cy.contains('Delete').click()

    cy.get('img[alt="Tag"]').click()
    cy.get('input[placeholder="Enter tag"]').type('ThequickckThequickckThequickckTh')
    cy.contains('Add').click()
    cy.get('img[alt="Tag"]').click()

    cy.contains('Post').click()

    cy.wait('@tags').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post file jpeg', () => {
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.get('body').then(($body) => {
      if ($body.find('div[id="file0"]')) {
        cy.get('div[id="file0"]').click()
        cy.contains('Delete').click()
      }
    })

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpeg.jpeg',
      fileName: 'jpeg.jpeg',
      mimeType: 'image/jpeg',
    })

    cy.contains('Post').click()

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post file jpg', () => {
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.get('body').then(($body) => {
      if ($body.find('div[id="file0"]')) {
        cy.get('div[id="file0"]').click()
        cy.contains('Delete').click()
      }
    })

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpg.jpg',
      fileName: 'jpg.jpg',
      mimeType: 'image/jpg',
    })

    cy.contains('Post').click()

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post file png', () => {
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.get('body').then(($body) => {
      if ($body.find('div[id="file0"]')) {
        cy.get('div[id="file0"]').click()
        cy.contains('Delete').click()
      }
    })

    cy.get('input[type="file"]').attachFile({
      filePath: 'png.png',
      fileName: 'png.png',
      mimeType: 'image/png',
    });

    cy.contains('Post').click()

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post file svg', () => {
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.get('body').then(($body) => {
      if ($body.find('div[id="file0"]')) {
        cy.get('div[id="file0"]').click()
        cy.contains('Delete').click()
      }
    })

    cy.get('input[type="file"]').attachFile({
      filePath: 'svg.svg',
      fileName: 'svg.svg',
      mimeType: 'image/svg+xml'
    })

    cy.contains('Post').click()

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post file mp4', () => {
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.get('body').then(($body) => {
      if ($body.find('div[id="file0"]')) {
        cy.get('div[id="file0"]').click()
        cy.contains('Delete').click()
      }
    })

    cy.get('input[type="file"]').attachFile({
      filePath: 'mp4.mp4',
      fileName: 'mp4.mp4',
      mimeType: 'video/mp4'
    })

    cy.contains('Post').click()

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post file webm', () => {
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.get('body').then(($body) => {
      if ($body.find('div[id="file0"]')) {
        cy.get('div[id="file0"]').click()
        cy.contains('Delete').click()
      }
    })

    cy.get('input[type="file"]').attachFile({
      filePath: 'video.webm',
      fileName: 'video.webm',
      mimeType: 'video/webm'
    })

    cy.contains('Post').click()

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('test edit post file txt ', () => {
    cy.intercept('POST', '**/api/post-files').as('files')

    cy.get('body').then(($body) => {
      if ($body.find('div[id="file0"]')) {
        cy.get('div[id="file0"]').click()
        cy.contains('Delete').click()
      }
    })

    cy.get('input[type="file"]').attachFile({
      filePath: 'txt.txt',
      fileName: 'txt.txt',
      mimeType: 'plain/text'
    })

    cy.contains('Post').click()

    cy.wait('@files').its('response').should((response) => {
      expect(response.statusCode).to.eq(400)
    })
  })



})

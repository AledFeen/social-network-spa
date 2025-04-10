describe('Validate message', () => {

  beforeEach(() => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'validate@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/chat/3', { timeout: 10000 })
  })

  it('send message null', () => {
    cy.intercept('POST', '**/api/message').as('sendMessage')
    cy.get('img[alt="Send"]').click()
    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(400)
    })
  })

  it('send message 1 symbol text', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('textarea[placeholder="Enter something new"]').type('I')
    cy.get('img[alt="Send"]').click()
    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message 1024', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('textarea[placeholder="Enter something new"]').type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, ' +
      'a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .')
    cy.get('img[alt="Send"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('send message 1023', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('textarea[placeholder="Enter something new"]').type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, ' +
      'gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .')
    cy.get('img[alt="Send"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message jpeg', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpeg.jpeg',
      fileName: 'jpeg.jpeg',
      mimeType: 'image/jpeg',
    })
    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })


  it('send message jpg', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'jpg.jpg',
      fileName: 'jpg.jpg',
      mimeType: 'image/jpg',
    })
    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message png', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'png.png',
      fileName: 'png.png',
      mimeType: 'image/png',
    })
    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message gif', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'gif.gif',
      fileName: 'gif.gif',
      mimeType: 'image/gif',
    })
    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })



  it('send message svg', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'svg.svg',
      fileName: 'svg.svg',
      mimeType: 'image/svg+xml',
    })
    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message webm', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'video.webm',
      fileName: 'video.webm',
      mimeType: 'video/webm'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message mp4', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'mp4.mp4',
      fileName: 'mp4.mp4',
      mimeType: 'video/mp4'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message mp3', () => {
    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'mp3.mp3',
      fileName: 'mp3.mp3',
      mimeType: 'audio/mpeg'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message ogg', () => {
    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'ogg.ogg',
      fileName: 'ogg.ogg',
      mimeType: 'audio/ogg'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message wav', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'wav.wav',
      fileName: 'wav.wav',
      mimeType: 'audio/wav'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message pdf', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'pdf.pdf',
      fileName: 'pdf.pdf',
      mimeType: 'application/pdf'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message txt', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'txt.txt',
      fileName: 'txt.txt',
      mimeType: 'text/plain'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message xml', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'xml.xml',
      fileName: 'xml.xml',
      mimeType: 'application/xml'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message json', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'json.json',
      fileName: 'json.json',
      mimeType: 'application/json'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message zip', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'zip.zip',
      fileName: 'zip.zip',
      mimeType: 'application/zip'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message rar', () => {

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('input[type="file"]').attachFile({
      filePath: 'rar.rar',
      fileName: 'rar.rar',
      mimeType: 'application/x-rar-compressed'
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('send message uncorrected file', () => {
    cy.get('input[type="file"]').attachFile({
      filePath: 'webp.webp',
      fileName: 'webp.webp',
      mimeType: 'image/webp'
    })

    cy.get('img[alt="Send-cover"]').should('not.exist')
  })
})

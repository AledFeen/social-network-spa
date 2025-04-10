describe('Test', () => {
  beforeEach(() => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'validate@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/chat/4', { timeout: 10000 })
  })

  it('edit message null', () => {
    cy.intercept('PUT', '**/api/message').as('editMessage')

    cy.get('img[id="msg5"]').click()
    cy.contains('Edit').click()
    cy.get('textarea[id="edited-textarea"]').clear()

    cy.contains('Save').click()

    cy.wait('@editMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('edit message 1 symbol', () => {
    cy.intercept('PUT', '**/api/message').as('editMessage')

    cy.get('img[id="msg5"]').click()
    cy.contains('Edit').click()
    cy.get('textarea[id="edited-textarea"]').clear().type('1')
    cy.contains('Save').click()

    cy.wait('@editMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('edit message 1024', () => {
    cy.intercept('PUT', '**/api/message').as('editMessage')

    cy.get('img[id="msg5"]').click()
    cy.contains('Edit').click()
    cy.get('textarea[id="edited-textarea"]').clear().type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, ' +
      'a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .')
    cy.contains('Save').click()

    cy.wait('@editMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('edit message 1023', () => {
    cy.intercept('PUT', '**/api/message').as('editMessage')

    cy.get('img[id="msg5"]').click()
    cy.contains('Edit').click()
    cy.get('textarea[id="edited-textarea"]').clear().type('In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, a gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .In the quiet moments before dawn, when the world still sleeps and the stars begin to fade, ' +
      'gentle breeze whispers through the trees, carrying with it the dreams of the night and the hopes of a new day. Each leaf shivers with the promise of change, each shadow stretches with longing for light, and every heart beats a little faster with anticipation. Time pauses briefly, as if holding its breath, savoring the balance between what was and what could be, between memory and possibility possibility possibility .')
    cy.contains('Save').click()

    cy.wait('@editMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })
})

describe('Test', () => {

  it('complaint message null', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321'
      })
    })

    cy.visit('/chat/2', {timeout: 10000})

    cy.get('img[alt="Options third message"]').click()
    cy.contains('Complain').click()
    cy.get('textarea[placeholder="Describe reason for complaint"]')
    cy.get('input[id="send-complaint"]').click()

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Text must have more 10 symbols')
    })
  })

  it('complaint message 10', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321'
      })
    })
    cy.intercept('POST', '**/api/complaint*').as('createComplaint')

    cy.visit('/chat/2', {timeout: 10000})

    cy.get('img[alt="Options third message"]').click()
    cy.contains('Complain').click()
    cy.get('textarea[placeholder="Describe reason for complaint"]').type('1234567890')
    cy.get('input[id="send-complaint"]').click()

    cy.wait('@createComplaint').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })


  it('complaint message 9', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321'
      })
    })

    cy.visit('/chat/2', {timeout: 10000})

    cy.get('img[alt="Options third message"]').click()
    cy.contains('Complain').click()
    cy.get('textarea[placeholder="Describe reason for complaint"]').type('123456789')
    cy.get('input[id="send-complaint"]').click()

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Text must have more 10 symbols')
    })
  })

  it('complaint message 255', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321'
      })
    })
    cy.intercept('POST', '**/api/complaint*').as('createComplaint')

    cy.visit('/chat/2', {timeout: 10000})

    cy.get('img[alt="Options third message"]').click()
    cy.contains('Complain').click()
    cy.get('textarea[placeholder="Describe reason for complaint"]').type('LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrurDolorInReprehenderitInVoluptateVelitEsseCillumDolasds')
    cy.get('input[id="send-complaint"]').click()

    cy.wait('@createComplaint').its('response').then((response) => {
      expect(response.statusCode).to.eq(422)
    })
  })

  it('complaint message 254', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321'
      })
    })
    cy.intercept('POST', '**/api/complaint*').as('createComplaint')

    cy.visit('/chat/2', {timeout: 10000})

    cy.get('img[alt="Options third message"]').click()
    cy.contains('Complain').click()
    cy.get('textarea[placeholder="Describe reason for complaint"]').type('LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrurDolorInReprehenderitInVoluptateVelitEsseCillumDolass')
    cy.get('input[id="send-complaint"]').click()

    cy.wait('@createComplaint').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('complaint message 254', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user3@gmail.com',
        password: '12344321'
      })
    })
    cy.intercept('POST', '**/api/complaint*').as('createComplaint')

    cy.visit('/chat/2', {timeout: 10000})

    cy.get('img[alt="Options third message"]').click()
    cy.contains('Complain').click()
    cy.get('textarea[placeholder="Describe reason for complaint"]').type('LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrurDolorInReprehenderitInVoluptateVelitEsseCillumDolass')
    cy.get('input[id="send-complaint"]').click()

    cy.wait('@createComplaint').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

})

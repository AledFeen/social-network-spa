describe('Profile Page Tests', () => {

  it('load relations myself', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', 'http://localhost:8000/api/check-relations?user_id=1').as('checkRelations')

    cy.visit('/profile/user1', {timeout: 10000})

    cy.wait('@checkRelations')
      .its('response')
      .then((response) => {
        cy.log('Ответ:', JSON.stringify(response.body))
        expect(response.statusCode).to.eq(200);
        const data = response.body;
        expect(data).to.have.all.keys([
          'subscription',
          'subscriber',
          'request',
          'banned',
          'isBanned',
        ]);
        expect(data.subscription).to.eq(false)
        expect(data.subscriber).to.eq(false)
        expect(data.request).to.eq(false)
        expect(data.banned).to.eq(false)
        expect(data.isBanned).to.eq(false)
      })
  })

  it('load relations by subscriber and subscription', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', 'http://localhost:8000/api/check-relations?user_id=1').as('checkRelations')

    cy.visit('/profile/user1', {timeout: 10000})

    cy.wait('@checkRelations')
      .its('response')
      .then((response) => {
        cy.log('Ответ:', JSON.stringify(response.body))
        expect(response.statusCode).to.eq(200);
        const data = response.body;
        expect(data).to.have.all.keys([
          'subscription',
          'subscriber',
          'request',
          'banned',
          'isBanned',
        ]);
        expect(data.subscription).to.eq(true)
        expect(data.subscriber).to.eq(true)
        expect(data.request).to.eq(false)
        expect(data.banned).to.eq(false)
        expect(data.isBanned).to.eq(false)
      })
  })

  it('load relations with sub request', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user4@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/check-relations?user_id=*').as('checkRelations')

    cy.visit('/profile/user2', {timeout: 10000})

    cy.wait('@checkRelations')
      .its('response')
      .then((response) => {
        cy.log('Ответ:', JSON.stringify(response.body))
        expect(response.statusCode).to.eq(200);
        const data = response.body;
        expect(data).to.have.all.keys([
          'subscription',
          'subscriber',
          'request',
          'banned',
          'isBanned',
        ]);
        expect(data.subscription).to.eq(false)
        expect(data.subscriber).to.eq(false)
        expect(data.request).to.eq(true)
        expect(data.banned).to.eq(false)
        expect(data.isBanned).to.eq(false)
      })
  })

  it('load relations by blocked user', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user4@gmail.com',
        password: '12344321',
      })
    })

    cy.intercept('GET', '**/api/check-relations?user_id=*').as('checkRelations')

    cy.visit('/profile/user1', {timeout: 10000})

    cy.wait(2000, { log: false })
      .then(() => {
        cy.get('@checkRelations.all').then((interceptions) => {
          expect(interceptions.length).to.eq(0, 'Запрос не должен был отправиться');
        });
      });
  })

  it('loads myself profile data', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/profile/user1', {timeout: 10000});

    cy.intercept('GET', '**/api/profile?username=user1').as('getProfile')
    cy.wait('@getProfile').its('response').should((response) => {
      expect(response.statusCode).to.eq(200)
      const profileData = response.body.data;
      expect(profileData).to.have.all.keys([
        'id',
        'name',
        'image',
        'birthday',
        'about',
        'realName',
        'location',
        'accountType',
        'whoCanMessage',
        'countFollowers',
        'countFollowings',
      ])

      expect(profileData.id).to.eq(1);
      expect(profileData.name).to.eq('user1');
      expect(profileData.image).to.eq('default_avatar')
      expect(profileData.birthday).to.eq('2010-10-10')
      expect(profileData.about).to.eq('The first user')
      expect(profileData.realName).to.eq('user1')
      expect(profileData.location).to.eq('location')
      expect(profileData.accountType).to.eq('public')
      expect(profileData.whoCanMessage).to.eq('all')
      expect(profileData.countFollowers).to.eq(1)
      expect(profileData.countFollowings).to.eq(1)
    })
  })

  it('load other user data', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user2@gmail.com',
        password: '12344321',
      })
    })
    cy.visit('/profile/user1', {timeout: 10000})

    cy.intercept('GET', '**/api/profile?username=user1').as('getProfile')
    cy.wait('@getProfile').its('response').should((response) => {
      expect(response.statusCode).to.eq(200);
      const profileData = response.body.data
      expect(profileData).to.have.all.keys([
        'id',
        'name',
        'image',
        'birthday',
        'about',
        'realName',
        'location',
        'accountType',
        'whoCanMessage',
        'countFollowers',
        'countFollowings',
      ])

      expect(profileData.id).to.eq(1);
      expect(profileData.name).to.eq('user1');
      expect(profileData.image).to.eq('default_avatar')
      expect(profileData.birthday).to.eq('2010-10-10')
      expect(profileData.about).to.eq('The first user')
      expect(profileData.realName).to.eq('user1')
      expect(profileData.location).to.eq('location')
      expect(profileData.accountType).to.eq('public')
      expect(profileData.whoCanMessage).to.eq('all')
      expect(profileData.countFollowers).to.eq(1)
      expect(profileData.countFollowings).to.eq(1)
    })
  })

  it('load user profile who blocked current user', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user4@gmail.com',
        password: '12344321',
      })
    })

    cy.visit('/profile/user1', {timeout: 10000})

    cy.intercept('GET', '**/api/profile?username=user1').as('getProfile')
    cy.wait('@getProfile').its('response').should((response) => {
      expect(response.statusCode).to.eq(404)
    })
  })




})

describe('chat tests', () => {

  it('get chats', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/chats').as('getChats')

    cy.visit('/messenger', { timeout: 10000 })

    cy.wait('@getChats').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 1,
            type: "personal",
            user: {
              id: 2,
              name: "user2",
              image: "default_avatar"
            },
            count_unread: 0,
            last_message: {
              id: 2,
              link_id: 2,
              is_read: true,
              text: "second message",
              user: {
                id: 2,
                name: "user2",
                image: "default_avatar"
              }
            }
          },
          {
            id: 2,
            type: "personal",
            user: {
              id: 3,
              name: "user3",
              image: "default_avatar"
            },
            count_unread: 0,
            last_message: {
              id: 3,
              link_id: 3,
              is_read: false,
              text: "third message",
              user: {
                id: 1,
                name: "user1",
                image: "default_avatar"
              }
            }
          }
        ]
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((chat) => {
        if (chat.last_message) {
          delete chat.last_message.created_at
          delete chat.last_message.updated_at
        }
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('get messages for chat', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('GET', '**/api/messages?chat_id=1&page_id=1').as('getMessages')

    cy.visit('/chat/1', { timeout: 10000 })

    cy.wait('@getMessages').its('response').then((response) => {
      const expectedResponse = {
        data: [
          {
            id: 2,
            link_id: 2,
            is_read: true,
            text: "second message",
            files: []
          },
          {
            id: 1,
            link_id: 1,
            is_read: false,
            text: "first message",
            files: []
          }
        ],
        current_page: 1,
        last_page: 1,
        total: 2
      }

      const cleanResponse = Cypress._.cloneDeep(response.body)
      cleanResponse.data.forEach((message) => {
        delete message.created_at
        delete message.updated_at
      })

      expect(response.statusCode).to.eq(200)
      expect(cleanResponse).to.deep.equal(expectedResponse)
    })
  })

  it('send message', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      })
    })

    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.visit('/chat/2', { timeout: 10000 })


    cy.get('textarea[placeholder="Enter something new"]').type('new message')
    cy.get('img[alt="Emoji"]').click()
    cy.contains('😀').click()
    cy.get('img[alt="Emoji"]').click()
    cy.get('input[type="file"]').attachFile({
      filePath: 'avatar.jpg',
      fileName: 'avatar.jpg',
      mimeType: 'image/jpeg',
    })

    cy.get('img[alt="Send-cover"]').click()

    cy.wait('@sendMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(201)
    })
  })

  it('edit message', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      })
    })
    cy.intercept('PUT', '**/api/message*').as('editMessage')

    cy.visit('/chat/2', { timeout: 10000 })



    cy.get('img[alt="Options new message😀"]').click()
    cy.contains('Edit').click()
    cy.get('textarea[id="edited-textarea"]').clear().type('new')

    cy.contains('Save').click()


    cy.wait('@editMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('delete message', () => {
    cy.request('GET', 'http://localhost:8000/sanctum/csrf-cookie').then(() => {
      cy.request('POST', 'http://localhost:8000/login', {
        email: 'user1@gmail.com',
        password: '12344321'
      })
    })
    cy.intercept('DELETE', '**/api/message*').as('deleteMessage')

    cy.visit('/chat/2', { timeout: 10000 })

    cy.get('img[alt="Options new"]').click()
    cy.contains('Delete').click()


    cy.wait('@deleteMessage').its('response').then((response) => {
      expect(response.statusCode).to.eq(200)
    })
  })
})

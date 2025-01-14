const state = {
  serverPath: 'http://localhost:8000',
  token: undefined,
  user: undefined
}

const getters = {
  serverPath: (state) => state.serverPath,
  token: (state) => state.token,
  user: (state) => state.user
}

const mutations = {  // это сеттеры
  setToken(state, newToken) {
    state.token = newToken
  },
  setUser(state, newUser) {
    state.user = newUser
  }
}

const actions = { //сюда можно вынести методы

}

export default {
  state,
  getters,
  mutations,
  actions
}

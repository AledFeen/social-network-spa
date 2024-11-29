const state = {
  serverPath: 'http://localhost:8000',
  token: undefined
}

const getters = {
  serverPath: (state) => state.serverPath,
  token: (state) => state.token,
}

const mutations = {  // это сеттеры
  setToken(state, newToken) {
    state.token = newToken;
  },
}

const actions = { //сюда можно вынести методы

}

export default {
  state,
  getters,
  mutations,
  actions
}

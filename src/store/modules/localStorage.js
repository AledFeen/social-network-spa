const state = {
  serverPath: 'http://localhost:8000',
  token: undefined,
  user: undefined,
  avatar: undefined
}

const getters = {
  serverPath: (state) => state.serverPath,
  token: (state) => state.token,
  user: (state) => state.user,
  avatar: (state) => state.avatar,
}

const mutations = {  // это сеттеры
  setToken(state, newToken) {
    state.token = newToken
  },
  setUser(state, newUser) {
    state.user = newUser
  },
  setAvatar(state, newAvatar) {
    state.avatar = newAvatar
  },
}

const actions = { //сюда можно вынести методы
  updateProfileImage({ commit }, avatar) {
    commit('setAvatar', avatar);
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}

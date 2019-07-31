import { login, logoff} from '@/api/user'
import Util from '@/util'
import defaultAvatar from '@/assets/img/img.jpg'

const state = {
  name: '',
  avatar: defaultAvatar,
  token: Util.getToken(),
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAE: (state, avatar) => {
    state.avatar = avatar
  },
}

const actions = {
  login({ commit }, userInfo) {
    const { name, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ name: name.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.data)
        commit('SET_NAME', name.trim())
        Util.setToken(data.data)
        Util.setStore('name', name.trim())
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  logoff ({ commit }) {
    return new Promise((resolve, reject) => {
        logoff().then(() => {
            commit('SET_TOKEN', '')
            Util.removeToken()
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
},
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
import { routers } from "@/router/router";

const state = {
  routes: routers,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routers
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROUTES', routers)
      resolve(routers)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
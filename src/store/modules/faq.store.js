/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

const state = {
  content: null,
}

const getters = {
  endpoint: (state, getters, rootState) => `${rootState.host}/faq/content`,
}

const mutations = {
  UPDATE_FAQ: (state, newContent) => {
    state.content = JSON.parse(JSON.stringify(newContent))
  },
}

const actions = {
  async GET_FAQ({ getters, commit }) {
    const response = await (
      await fetch(getters.endpoint).catch(err => commit('ERROR_HANDLER', err, { root: true }))
    ).json()
    const [polygons, points] = await Promise.all((await Promise.all([
      fetch(getters.polygonsEndpoint),
      fetch(getters.pointsEndpoint),
    ])).map(response => response.json()))
    commit('MAP_POINTS', points)
    commit('MAP_POLYGONS', polygons)
    return true
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

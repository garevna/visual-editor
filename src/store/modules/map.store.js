
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

const state = {
  points: null,
  polygons: null,
}

const getters = {
  pointsEndpoint: (state, getters, rootState, rootGetters) => `${rootState.host}/map/points`,
  polygonsEndpoint: (state, getters, rootState, rootGetters) => `${rootState.host}/map/polygons`,
}

const mutations = {
  MAP_POINTS: (state, points) => { state.points = JSON.parse(JSON.stringify(points)) },
  MAP_POLYGONS: (state, polygons) => { state.polygons = JSON.parse(JSON.stringify(polygons)) },
}

const actions = {
  async GET_MAP_DATA({ getters, commit }) {
    const [polygons, points] = await Promise.all((await Promise.all([
      fetch(getters.polygonsEndpoint),
      fetch(getters.pointsEndpoint),
    ])).map(response => response.json()))
    commit('MAP_POINTS', points)
    commit('MAP_POLYGONS', polygons)
    return true
  },
  async SAVE_POLYGONS({ getters, commit }, polygons) {
    const response = await fetch(getters.polygonsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(polygons),
    })
    /* eslint-disable-next-line */
    console.log(response)
    return response
  },

  async GET_POINTS({ state, getters, commit }) {
    commit('MAP_POINTS', await (await fetch(getters.pointsEndpoint)).json())
    return state.points
  },

  async SAVE_POINTS({ getters, commit }, points) {
    const response = await fetch(getters.pointsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(points),
    })
    /* eslint-disable-next-line */
    console.log(response)
    return response
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}


/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

const state = {
  points: null,
  polygons: null,
}

const getters = {
  pointsEndpoint: (state, getters, rootState, rootGetters) => `${rootState.host}/map/points`,
  polygonsEndpoint: (state, getters, rootState, rootGetters) => `${rootState.host}/map/polygons`,
  markersEndpoint: (state, getters, rootState, rootGetters) => `${rootState.host}/map/markers`,
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
  /* eslint-disable no-console */
  async WRITE_FILE({ getters, commit }, { filePath, fileContent }) {
    const formData = new FormData()
    formData.set('content', JSON.stringify(fileContent))
    const response = await (
      fetch(filePath, {
        method: 'POST',
        body: formData,
      }).catch(err => console.warn(err))
    )
    return response
  },

  async WRITE_POINTS({ state, getters, dispatch }) {
    const response = await dispatch('WRITE_FILE', {
      filePath: `${getters.markersEndpoint}/points.json`,
      fileContent: state.points,
    })
    console.log(response)
  },

  async WRITE_POLYGONS({ state, getters, dispatch }) {
    const response = await dispatch('WRITE_FILE', {
      filePath: `${getters.markersEndpoint}/polygons.json`,
      fileContent: state.polygons,
    })
    console.log(response)
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

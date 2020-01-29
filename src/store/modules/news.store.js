/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

const state = {
  news: null,
  startTime: new Date().getTime(),
  contentChanged: false,
}

const getters = {
  newsEndpoint: (state, getters, rootState) => `${rootState.host}/news`,
  logosEndpoint: (state, getters, rootState) => `${rootState.host}/news/logos`,
}

const mutations = {
  UPDATE_NEWS: (state, news) => {
    state.news = JSON.parse(JSON.stringify(news))
  },

  UPDATE_ARTICLE: (state, payload) => {
    if (!state.news) return
    if (!payload || !payload.id || !payload.article) return
    setProperty(state.news, payload.id, payload.article)
    state.contentChanged = true
  },

  REMOVE_ARTICLE: (state, id) => {
    if (!state.news) return
    deleteProperty(state.news, id)
    state.contentChanged = true
  },

}

const actions = {

  async GET_NEWS({ state, getters, commit }) {
    commit(
      'UPDATE_NEWS',
      await (await fetch(getters.newsEndpoint)).json(),
    )
    return state.news
  },

  async SAVE_NEWS({
    state, getters, commit, rootState, rootAct,
  }) {
    fetch(getters.newsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state.news),
    }).then(
      () => {},
      err => commit('ERROR_HANDLER', err, { root: true }),
    )
  },

  async GET_ARTICLE_BY_ID({ state, dispatch }, id) {
    if (!state.news) await dispatch('GET_NEWS')
    return state.news[id]
  },

  async SAVE_LOGO({ dispatch }, fileObject) {
    const fileName = `img${new Date().getTime()}.${fileObject.type.split('/')[1]}`
    const formData = new FormData()
    formData.set('logo', fileObject)
    let logoPath
    try {
      logoPath = await (
        await fetch(`${getters.logosEndpoint}/${fileName}`, {
          method: 'POST',
          body: formData,
        })
      ).text()
    } catch (err) {
      dispatch('TRACE_ERROR', err, { root: true })
      return null
    }
    return logoPath.split('/').slice(-1)[0]
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

const state = {
  mediaContent: null,
}

const getters = {
  newsEndpoint: (state, getters, rootState) => `${rootState.host}/news`,
  staticLogoEndpoint: (state, getters, rootState) => `${rootState.host}/logos`,
  logosEndpoint: (state, getters, rootState) => `${rootState.host}/news/logos`,
  uploadLogoEndpoint: (state, getters, rootState) => `${rootState.host}/news/logo`,
}

const mutations = {

  SET_MEDIA_CONTENT: (state, content) => {
    state.mediaContent = content
  },
}

const actions = {

  async GET_NEWS({
    state,
    getters,
    commit,
    dispatch,
  }) {
    try {
      commit('SET_MEDIA_CONTENT', await (await fetch(getters.newsEndpoint)).json())
      return state.mediaContent.data
    } catch (error) {
      dispatch('LOG_ERROR', error)
      return null
    }
  },

  async SAVE_NEWS({ getters, dispatch }, newsContent) {
    try {
      await fetch(getters.newsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsContent),
      })
    } catch (error) { dispatch('LOG_ERROR', error) }
  },

  async GET_ARTICLE_BY_ID({ state, dispatch }, id) {
    try {
      const article = await (await fetch(`${getters.newsEndpoint}/${id}`)).json()
      return Object.assign(article, { pictureFile: null, avatarFile: null })
    } catch (error) {
      dispatch('LOG_ERROR', error)
      return null
    }
  },

  async SAVE_LOGO(context, article) {
    const formData = new FormData()
    formData.set('logo', article.logoFile)
    try {
      const response = await (await fetch(getters.uploadLogoEndpoint, {
        method: 'POST',
        body: formData,
      })).text()
      commit('SET_PROPERTY', { object: article, propertyName: 'logo', value: response }, { root: true })
      return response
    } catch (error) {
      dispatch('LOG_ERROR', error)
      return null
    }
  },

  LOG_ERROR({ commit }, error) {
    commit('ERROR_HANDLER', { moduleName: 'news', error }, { root: true })
    return null
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

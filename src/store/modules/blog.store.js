/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */

const state = {
  content: null,
  contentChanged: false,
  startTime: new Date().getTime(),
}

const getters = {
  contentEndpoint: (state, getters, rootState) => `${rootState.host}/blog/content`,
  imagesEndpoint: (state, getters, rootState) => `${rootState.host}/blog/images`,
  avatarsEndpoint: (state, getters, rootState) => `${rootState.host}/blog/avatars`,
}

const mutations = {

  UPDATE_CONTENT: (state, content) => {
    state.content = JSON.parse(JSON.stringify(content))
  },

  UPDATE_ARTICLE: (state, commit, payload) => {
    if (!state.content) return
    if (!payload || !payload.id || !payload.article) return
    setProperty(state.content, payload.id, payload.article)
    state.contentChanged = true
  },

}

const actions = {

  async GET_ARTICLE_CONTENT({ getters, commit }, file) {
    const result = await (await fetch(`${getters.contentEndpoint}/${file}`)).text()
    return result
  },

  REMOVE_ARTICLE({ state, commit }, id) {
    commit('DELETE_PROPERTY', {
      moduleName: 'blog',
      object: state.content,
      propertyName: id,
    }, { root: true })
  },

  async REMOVE_FILE({
    state,
    getters,
    commit,
    dispatch,
  }, file) {
    const selected = state.content.find(item => item.file === file)
    if (!selected) return
    commit('UPDATE_CONTENT', state.content.filter(item => item.file !== file))
    await dispatch('SAVE_CONTENT')
      .catch(error => dispatch('TRACE_ERROR', error, { root: true }))
    fetch(`${getters.contentEndpoint}/${file}`, {
      method: 'DELETE',
    })
  },

  async GET_CONTENT({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const content = await (await fetch(getters.contentEndpoint)).json()
    commit('UPDATE_CONTENT', content)
    return state.content
  },

  async SAVE_CONTENT({
    state,
    getters,
    commit,
    dispatch,
  }) {
    await fetch(getters.contentEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state.content),
    }).catch(error => dispatch('TRACE_ERROR', error, { root: true }))

    state.contentChanged = false
    state.startTime = new Date().getTime()
    return state.content
  },

  async GET_ARTICLE_BY_ID({ state, dispatch }, id) {
    if (!state.content) await dispatch('GET_CONTENT')
    return state.content[id]
  },

  async SAVE_ARTICLE_CONTENT({ getters, dispatch }, payload) {
    if (!payload.content || typeof payload.content !== 'string') {
      return dispatch('TRACE_ERRORS', 'Invalid article content', { root: true })
    }
    if (!payload.fileName) {
      return dispatch('TRACE_ERRORS', 'Invalid article content file name', { root: true })
    }
    const ret = await fetch(`${getters.contentEndpoint}/${payload.fileName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html',
      },
      body: payload.content,
    }).catch(err => dispatch('TRACE_ERRORS', err, { root: true }))
    return ret
  },

  async SAVE_IMAGE({ dispatch }, payload) {
    const fileName = `img${new Date().getTime()}.${payload.fileObject.type.split('/')[1]}`
    const formData = new FormData()
    formData.set('img', payload.fileObject)
    let imagePath
    try {
      imagePath = await (
        await fetch(`${payload.filePath}/${fileName}`, {
          method: 'POST',
          body: formData,
        })
      ).text()
    } catch (err) {
      dispatch('TRACE_ERROR', err, { root: true })
      return null
    }
    return imagePath.split('/').slice(-1)[0]
  },

  async SAVE_PICTURE({ getters, dispatch }, file) {
    const newPathToFile = await dispatch('SAVE_IMAGE', {
      filePath: getters.imagesEndpoint,
      fileObject: file,
    })
    return newPathToFile
  },

  async SAVE_AVATAR({ getters, dispatch }, file) {
    const newPathToFile = await dispatch('SAVE_IMAGE', {
      filePath: getters.avatarsEndpoint,
      fileObject: file,
    })
    return newPathToFile
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

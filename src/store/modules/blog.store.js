/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */

const state = {
  blogContent: null,
  contentChanged: false,
  startTime: new Date().getTime(),
  defaultPicture: 'default.jpg',
  defaultAvatar: 'default.png',
}

const getters = {
  contentEndpoint: (state, getters, rootState) => `${rootState.host}/blog/content`,
  imagesEndpoint: (state, getters, rootState) => `${rootState.host}/blog/images`,
  avatarsEndpoint: (state, getters, rootState) => `${rootState.host}/blog/avatars`,
  pictureURL: (state, getters) => id => `${getters.imagesEndpoint}/${state.blogContent[id].picture || state.defaultPicture}`,
  avatarURL: (state, getters) => id => `${getters.avatarsEndpoint}/${state.blogContent[id].author_ava || state.defaultAvatar}`,
}

const mutations = {

  UPDATE_CONTENT: (state, content) => {
    state.blogContent = JSON.parse(JSON.stringify(content))
  },

}

const actions = {

  async GET_ARTICLE_CONTENT({ getters, commit }, file) {
    const result = await (await fetch(`${getters.contentEndpoint}/${file}`)).text()
    return result
  },

  async REMOVE_ARTICLE({
    state,
    getters,
    commit,
    dispatch,
  }, id) {
    /* eslint-disable camelcase */
    const { file, picture, author_ava } = state.blogContent[id]

    if (file) await dispatch('REMOVE_FILE', `${getters.contentEndpoint}/${file}`)
    // if (picture) await dispatch('REMOVE_FILE', `${getters.imagesEndpoint}/${picture}`)
    // if (author_ava) await dispatch('REMOVE_FILE', `${getters.avatarsEndpoint}/${author_ava}`)

    commit('DELETE_PROPERTY', {
      object: state.blogContent,
      propertyName: id,
    }, { root: true })

    dispatch('SAVE_BLOG_CONTENT', state.blogContent)
    return true
  },

  async REMOVE_FILE({ dispatch }, filePath) {
    await dispatch(
      'REMOVE_FILE',
      {
        moduleName: 'blog',
        filePath,
      },
      { root: true },
    )
  },

  async GET_BLOG_CONTENT({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const content = await (await fetch(getters.contentEndpoint)).json()
    commit('UPDATE_CONTENT', content)
    return state.blogContent
  },

  async SAVE_BLOG_CONTENT({
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
      body: JSON.stringify(state.blogContent),
    }).catch(error => dispatch('TRACE_ERROR', error, { root: true }))

    state.contentChanged = false
    state.startTime = new Date().getTime()
    return state.blogContent
  },

  async GET_ARTICLE_BY_ID({ state, dispatch }, id) {
    if (!state.content) await dispatch('GET_CONTENT')
    return state.blogContent[id]
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

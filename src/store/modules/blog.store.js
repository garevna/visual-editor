/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */

const state = {
  articleFields: ['id', 'file', 'title', 'text', 'published_at', 'author', 'logo_user', 'logo', 'slug'],
}

const getters = {
  hostEndpoint: (state, getters, rootState) => `${rootState.host}`,
  contentEndpoint: (state, getters, rootState) => `${rootState.host}/blog/content`,
  articleEndpoint: (state, getters, rootState) => `${rootState.host}/blog/article`,
  uploadPictureEndpoint: (state, getters, rootState) => `${rootState.host}/blog/picture`,
  uploadAvatarEndpoint: (state, getters, rootState) => `${rootState.host}/blog/avatar`,
  staticPictureEndpoint: (state, getters, rootState) => `${rootState.host}/images`,
  staticAvatarEndpoint: (state, getters, rootState) => `${rootState.host}/avatars`,
  picturesEndpoint: (state, getters, rootState) => `${rootState.host}/blog/images`,
  avatarsEndpoint: (state, getters, rootState) => `${rootState.host}/blog/avatars`,
  imageSrc: (folderName, fileName) => (state, getters, rootState) => `${rootState.host}/${folderName}/${fileName}`,
}

const actions = {

  async GET_BLOG_CONTENT({ getters, dispatch }) {
    let blogContent = null
    try {
      const response = await (await fetch(getters.contentEndpoint)).json()
      blogContent = response.data
    } catch (error) { dispatch('LOG_ERROR', response) }

    return blogContent
  },

  async GET_ARTICLE_BY_ID({ getters, dispatch }, id) {
    if (!id) { return dispatch('LOG_ERROR', 'Article id required') }
    try {
      const article = await (await fetch(`${getters.articleEndpoint}/${id}`)).json()
      return Object.assign(article, { pictureFile: null, avatarFile: null })
    } catch (error) { return dispatch('LOG_ERROR', error) }
  },

  async SAVE_IMAGE(context, { imageName, imageFile, endpoint }) {
    const formData = new FormData()
    formData.set(imageName, imageFile)
    try {
      const response = await (await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })).text()
      return response
    } catch (error) {
      dispatch('LOG_ERROR', error)
      return null
    }
  },

  async SAVE_ARTICLE_BY_ID({ getters, commit, dispatch }, { id, article }) {
    const requestBody = Object.assign({}, ...state.articleFields.map(key => ({ [key]: article[key] })))

    if (article.pictureFile) {
      const response = await dispatch('SAVE_IMAGE', {
        imageName: 'picture',
        imageFile: article.pictureFile,
        endpoint: getters.uploadPictureEndpoint,
      })
      commit('SET_PROPERTY', { object: requestBody, propertyName: 'logo', value: response }, { root: true })
    }

    if (article.avatarFile) {
      const response = await dispatch('SAVE_IMAGE', {
        imageName: 'avatar',
        imageFile: article.avatarFile,
        endpoint: getters.uploadAvatarEndpoint,
      })
      commit('SET_PROPERTY', { object: requestBody, propertyName: 'logo_user', value: response }, { root: true })
    }

    try {
      const response = await fetch(`${getters.articleEndpoint}/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
    } catch (error) { dispatch('LOG_ERROR', error) }
  },

  async CREATE_NEW_ARTICLE({ getters, dispatch }) {
    try {
      const response = await (await fetch(`${getters.articleEndpoint}/new`, { method: 'POST' })).json()
      return response
    } catch (error) {
      dispatch('LOG_ERROR', error)
      return null
    }
  },

  async REMOVE_ARTICLE_BY_ID({ getters, commit, dispatch }, id) {
    try {
      const { status, message } = await fetch(`${getters.articleEndpoint}/${id}`, {
        method: 'DELETE',
      })
      return JSON.parse(message).data
    } catch (error) {
      dispatch('LOG_ERROR', error)
      return false
    }
  },

  async GET_ALL_PICTURES({ getters, dispatch }) {
    const pictures = await (await fetch(getters.picturesEndpoint)).json()
    const result = pictures.filter(img => !(img.match(/default/) || img.match(/.gitkeep/)))
    return result
  },

  async GET_ALL_AVATARS({ getters, dispatch }) {
    const pictures = await (await fetch(getters.avatarsEndpoint)).json()
    const result = pictures.filter(img => !img.match(/.gitkeep/) && !img.match(/default/))
    return result
  },

  async GET_IMAGES(context, endpoint) {
    const pictures = await (await fetch(endpoint)).json()
    const result = pictures.filter(img => !img.match(/.gitkeep/) && !img.match(/default/))
    return result
  },

  async REMOVE_IMAGE({ dispatch }, file) {
    const { status, result } = await fetch(file, { method: 'DELETE' })
    if (status !== 200) dispatch('LOG_ERROR', result)
    return status === 200
  },

  LOG_ERROR({ commit }, error) {
    commit('ERROR_HANDLER', { moduleName: 'blog', error }, { root: true })
    return null
  },
}

export default {
  namespaced: true,
  getters,
  actions,
}

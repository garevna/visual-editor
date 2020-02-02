/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

const state = {
  content: null,
  keywords: {},
  contentChanged: false,
  startTime: new Date().getTime(),
}

const getters = {
  endpoint: (state, getters, rootState) => `${rootState.host}/faq`,
}

const mutations = {
  UPDATE_FAQ: (state, content) => {
    state.content = JSON.parse(JSON.stringify(content))
  },
  NEW_QUESTION: (state, newQuestion) => {
    state.content.push(JSON.parse(JSON.stringify(newQuestion)))
  },
  UPDATE_KEYWORDS: (state, payload) => {
    state.content[payload.index].keywords.push(
      JSON.parse(JSON.stringify(payload.keywords.filter(item => item))),
    )
  },
}

const actions = {

  async GET_ANSWER({ getters, commit }, file) {
    const result = await (await fetch(`${getters.endpoint}/${file}`)).text()
    return result
  },

  async SAVE_ANSWER({ getters, dispatch }, payload) {
    if (!payload.content || typeof payload.content !== 'string') {
      return dispatch('TRACE_ERRORS', 'Invalid answer content', { root: true })
    }
    if (!payload.fileName) {
      return dispatch('TRACE_ERRORS', 'Invalid answer content file name', { root: true })
    }
    const ret = await fetch(`${getters.endpoint}/${payload.fileName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html',
      },
      body: payload.content,
    }).catch(err => dispatch('TRACE_ERRORS', err, { root: true }))
    return ret
  },

  async REMOVE_QUESTION({
    state,
    getters,
    commit,
    dispatch,
  }, id) {
    const { file } = state.content[id]

    if (file) await dispatch('REMOVE_FILE', `${getters.endpoint}/${file}`)

    commit('DELETE_PROPERTY', {
      object: state.content,
      propertyName: id,
    }, { root: true })

    await dispatch('SAVE_CONTENT')
    return true
  },

  async REMOVE_FILE({ dispatch }, filePath) {
    await dispatch(
      'REMOVE_FILE',
      {
        moduleName: 'faq',
        filePath,
      },
      { root: true },
    )
  },

  async GET_CONTENT({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const content = await (await fetch(getters.endpoint)).json()
    commit('UPDATE_FAQ', content)
    return state.content
  },

  async SAVE_CONTENT({
    state,
    getters,
    commit,
    dispatch,
  }) {
    await fetch(getters.endpoint, {
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

  async GET_ANSWER_BY_KEYWORD({ state, dispatch }, keyword) {
    if (!state.content) await dispatch('GET_CONTENT')
    const result = state.content.filter(
      item => item.keywords.indexOf(keyword) !== -1,
    )
    return result
  },

  async GET_ANSWER_BY_INDEX({ state, dispatch }, index) {
    if (!state.content) await dispatch('GET_CONTENT')
    return state.content[index]
  },

  async NEW_QUESTION({
    state, commit, getters, dispatch,
  }, payload) {
    const id = new Date().getTime().toString()
    const fileName = `faq${id}.html`
    await dispatch('SAVE_ANSWER', {
      fileName,
      content: '<p>Empty...</p>',
    })
    commit('NEW_QUESTION', {
      question: 'New Question...',
      file: fileName,
      keywords: [],
    })
    return state.content.length - 1
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

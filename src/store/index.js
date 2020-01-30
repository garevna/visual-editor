import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    host: 'https://dgtek-server.glitch.me',
    socket: 'wss://ws-with-routes.glitch.me',
    mail: 'https://api.dgtek.net/mail',
    errorsLog: [],
    startTime: new Date().getTime(),

  },
  modules,

  getters: {
    errorsLogEndpoint(state) {
      return `${state.host}/log/errors.json`
    },
  },

  mutations: {

    ERROR_HANDLER: (state, { moduleName, error }) => {
      state.errorsLog.push({
        module: moduleName,
        error,
        time: new Date().getTime(),
      })
    },
    ERRORS_CLEAR: (state) => {
      state.errorsLog = []
    },
    SET_PROPERTY: (state, payload) => {
      Vue.set(payload.object, payload.propertyName, payload.value)
    },
    DELETE_PROPERTY: (state, payload) => {
      Vue.delete(payload.object, payload.propertyName)
    },

  },

  actions: {

    async REMOVE_FILE({ dispatch }, { moduleName, filePath }) {
      if (!filePath) {
        dispatch(
          'TRACE_ERROR',
          {
            moduleName: 'blog',
            error: `Error deleting the file: ${filePath}`,
          },
          { root: true },
        )
        return false
      }
      try {
        await fetch(filePath, { method: 'DELETE' })
        return true
      } catch (error) {
        dispatch('TRACE_ERROR', { moduleName, error })
        return false
      }
    },


    TRACE_ERROR({ state, getters, commit }, { moduleName, error }) {
      commit('ERROR_HANDLER', { moduleName, error })
      if (new Date().getTime() - state.startTime > 360000) {
        state.startTime = new Date().getTime()
        fetch(getters.errorsLogEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(state.errorsLog),
        }).then(
          () => commit('ERRORS_CLEAR'),
          err => commit('ERROR_HANDLER', {
            moduleName: 'Errors Handler',
            err,
          }),
        )
      }
      /* eslint-disable-next-line */
      console.warn(state.errorsLog)
    },
  },
})

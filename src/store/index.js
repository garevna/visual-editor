import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    host: 'https://garevna-server.glitch.me',
    socket: 'wss://ws-with-routes.glitch.me',
    mail: 'https://garevna-server.glitch.me',
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

    async REMOVE_FILE({ commit }, { moduleName, filePath }) {
      if (!filePath) {
        commit('ERROR_HANDLER', {
          moduleName,
          error: `File to be deleted is not defined: ${filePath}`,
        }, { root: true })
        return false
      }
      try {
        await fetch(filePath, { method: 'DELETE' })
        return true
      } catch (error) {
        commit('ERROR_HANDLER', { moduleName, error })
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

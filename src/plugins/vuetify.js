import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#263238',
        secondary: '#aaa',
        accent: '#4527A0',
        error: '#D32F2F',
        info: '#09b',
        warning: '#FF6F00',
        success: '#1B5E20',
      },
      dark: {
        primary: '#455A64',
        secondary: '#263238',
      },
    },
  },
})

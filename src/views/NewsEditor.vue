<template>
  <v-container>
    <v-card flat
      class="mx-auto my-auto"
      width="80%"
      tile
      v-if="!close && article"
    >
      <!-- actions -->

      <v-card-actions>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn text @click="saveArticle" v-on="on">
              <v-icon large color="info">mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span>Save current article</span>
        </v-tooltip>

        <v-spacer/>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn text @click="removeArticle" v-on="on">
              <v-icon large color="error">mdi-delete-circle</v-icon>
            </v-btn>
          </template>
          <span>Delete current article</span>
        </v-tooltip>
      </v-card-actions>
      <v-divider/>

      <!-- header -->

      <v-card-title>
        <v-text-field label="News header" v-model="article.title">
          <v-icon small slot="append" color="info">mdi-pencil</v-icon>
        </v-text-field>
      </v-card-title>

      <v-card-text>
        <v-text-field label="Article URL" v-model="article.ref">
          <v-icon small slot="append" color="info">mdi-pencil</v-icon>
        </v-text-field>
      </v-card-text>

      <!-- SOURCE -->

      <v-card raized>
        <v-row>
          <v-col cols="6">
            <v-card-text>
              <v-text-field label="Article date" v-model="article.date">
                <v-icon small slot="append" color="info">mdi-pencil</v-icon>
              </v-text-field>
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-text>
              <v-text-field label="Article source" v-model="article.source">
                <v-icon small slot="append" color="info">mdi-pencil</v-icon>
              </v-text-field>
            </v-card-text>
          </v-col>
        </v-row>
        <v-card-text>
          <v-img v-if="logoSrc" :src="logoSrc" max-height="150" max-width="300" contain></v-img>
        </v-card-text>
        <v-card-text class="pl-10">
          <v-file-input
            label="Upload logo"
            prepend-icon="mdi-camera"
            @change="uploadLogo"
            v-model="logo.file"
            :hint="uploadHint"
            :error="error"
          ></v-file-input>
        </v-card-text>
      </v-card>
    </v-card>

    <RemovePopup :visibility.sync="removePopupVisible"
                 :confirm.sync="confirmRemoving"
                 removing="Media article"
                 :details="article.title"
      />
  </v-container>
</template>

<script>

import RemovePopup from '@/components/RemovePopup.vue'

export default {
  components: {
    RemovePopup,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    logoFromServer: String,
  },

  data: () => ({
    logo: {
      source: 'article',
      file: null,
      src: '',
      limit: 100000,
    },
    close: false,

    removePopupVisible: false,
    confirmRemoving: false,
  }),

  computed: {
    article() {
      if (!this.id || !this.$store.state.news.news) return null
      return this.$store.state.news.news[this.id]
    },
    logoEndpoint() {
      return this.$store.getters['news/logosEndpoint']
    },
    logoSrc() {
      if (this.logo.source === 'article' && this.article.logo) return `${this.logoEndpoint}/${this.article.logo}`
      if (this.logo.source === 'client') return this.logo.src
      if (this.logo.source === 'server') return `${this.logoEndpoint}/${this.logoFromServer}`
      return ''
    },
    uploadHint() {
      if (this.logo.source !== 'client') return ''
      if (!this.logo.file || !(this.logo.file instanceof File)) return ''
      if (this.logo.file.size > this.logo.limit) return 'File is too large'
      if (!this.logo.file.type.match(/image/)) return 'Invalid file type'
      return ''
    },
    error() { return Boolean(this.uploadHint) },
  },

  watch: {
    id() {
      this.init()
    },
    'logo.file': {
      handler(newVal) {
        if (!newVal) this.logo.src = ''
        else this.logo.source = 'client'
      },
      deep: true,
    },
    logoFromServer() {
      this.logo.source = 'server'
    },

    confirmRemoving(val) {
      if (!val) return
      this.$store.commit('DELETE_PROPERTY', {
        object: this.$store.state.news.news,
        propertyName: this.id,
      })
      this.$store.dispatch('news/SAVE_NEWS')
        .then(() => {
          this.removePopupVisible = false
          this.close = true
        })
    },
  },

  methods: {

    async init() {
      this.logo.file = null
      this.logo.src = ''
      this.logo.source = 'article'
    },

    async saveLogo() {
      try {
        return await this.$store.dispatch('news/SAVE_LOGO', this.logo.file)
      } catch (err) { return '' }
    },

    uploadLogo() {
      if (!this.logo.file || this.logo.error) return

      const reader = new FileReader()
      reader.onload = function s() {
        this.logo.src = reader.result
        this.logo.source = 'client'
      }.bind(this)
      reader.readAsDataURL(this.logo.file)
    },

    async saveArticle() {
      if (this.logo.source === 'client') this.$set(this.article, 'logo', this.logo.file ? await this.saveLogo() : '')
      if (this.logo.source === 'server') this.$set(this.article, 'logo', this.logoFromServer)
      this.$store.dispatch('news/SAVE_NEWS')
    },

    async removeArticle() {
      this.confirmRemoving = false
      this.removePopupVisible = true
    },
  },

  mounted() {
    this.init()
  },
}
</script>

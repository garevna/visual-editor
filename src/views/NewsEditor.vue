<template>
    <v-card flat
      class="mx-auto my-auto"
      width="80%"
      tile
      v-if="!close && article"
    >
      <!-- actions -->

      <v-card-actions>
        <v-btn text @click="saveArticle">
          <v-icon large color="info">mdi-content-save</v-icon>
        </v-btn>
        <v-spacer/>
        <v-btn text @click="removeArticle">
          <v-icon large color="error">mdi-delete-circle</v-icon>
        </v-btn>
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
          <v-img v-if="logoSrc" :src="logoSrc" max-height="150" max-widt="300" contain></v-img>
        </v-card-text>
        <v-card-text class="pl-10">
          <v-file-input
            label="Upload logo"
            prepend-icon="mdi-camera"
            @change="uploadLogo"
            v-model="logo.file"
            :hint="logo.uploadHint"
            :error="logo.error"
          ></v-file-input>
        </v-card-text>
      </v-card>

    </v-card>
</template>

<script>

export default {
  components: {
    //
  },

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    logo: {
      file: null,
      tmpSrc: null,
      changed: false,
      limit: 100000,
    },
    close: false,
  }),

  computed: {
    article() {
      if (!this.id || !this.$store.state.news.news) return null
      return this.$store.state.news.news[this.id]
    },
    logoSrc() {
      if (this.article.logo) {
        return `${this.$store.getters['news/logosEndpoint']}/${this.article.logo}`
      }
      return this.logo.tmpSrc
    },
    'logo.uploadHint': () => { this.setHint(this.logo.file, this.logo.limit) },
    'logo.error': () => Boolean(this.logo.uploadHint),
  },

  watch: {
    id() {
      this.init()
    },
    'logo.file': {
      handler(newVal) {
        if (!newVal) {
          this.article.logo = ''
          this.logo.tmpSrc = ''
          this.logo.changed = true
        }
      },
      deep: true,
    },
  },

  methods: {

    async init() {
      this.logo.file = new File([0], '')
      this.logo.tmpSrc = ''

      if (this.id) {
        if (this.article) {
          this.logo.file = new File([0], this.article.logo)
          this.logo.tmpSrc = this.article.logo
        }
      }
    },

    async saveLogo() {
      try {
        return await this.$store.dispatch('news/SAVE_LOGO', this.logo.file)
      } catch (err) {
        /* eslint-disable-next-line */
        console.warn(err)
        return ''
      }
    },

    uploadLogo() {
      if (!this.logo.file) {
        this.logo.tmpSrc = ''
        return false
      }
      if (!this.logo.file.type.match(/image/) || this.logo.file.size > this.logo.limit) return false

      const reader = new FileReader()
      reader.onload = function s() {
        this.logo.tmpSrc = reader.result
        this.logo.changed = true
      }.bind(this)
      reader.readAsDataURL(this.logo.file)

      return true
    },

    async saveArticle() {
      if (this.logo.changed) {
        this.$set(this.article, 'logo', this.logo.file ? await this.saveLogo() : null)
      }

      this.$store.dispatch('news/SAVE_NEWS')
    },

    async removeArticle() {
      this.$store.commit('DELETE_PROPERTY', {
        object: this.$store.state.news.news,
        propertyName: this.id,
      })
      await this.$store.dispatch('news/SAVE_NEWS')

      this.close = true
    },
  },

  mounted() {
    this.init()
  },
}
</script>

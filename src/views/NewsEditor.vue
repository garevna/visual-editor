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
        <v-row>
          <v-col cols="9">
            <v-text-field label="News header" v-model="article.title">
              <v-icon small slot="append" color="info">mdi-pencil</v-icon>
            </v-text-field>
          </v-col>
          <v-col>
            <v-card-text>
              <v-text-field label="Article date" v-model="article.data">
                <v-icon small slot="append" color="info">mdi-pencil</v-icon>
              </v-text-field>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card-title>

      <!-- SOURCE -->

      <v-card raized>
        <v-card-text>
          <v-text-field label="Article source" v-model="article.source">
            <v-icon small slot="append" color="info">mdi-pencil</v-icon>
          </v-text-field>
        </v-card-text>
        <v-card-text raised>
          <v-img v-if="logoSrc" :src="logoSrc"></v-img>
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
    article: null,
    logo: {
      file: null,
      tmpSrc: null,
      uploadHint: '',
      error: false,
      changed: false,
    },
    close: false,
  }),
  computed: {

    logoSrc() {
      if (this.article.logo) {
        return `${this.$store.getters['news/logosEndpoint']}/${this.article.logo}`
      }
      return this.logo.tmpSrc
    },
  },

  watch: {
    id() {
      this.init()
    },
    'logo.file': {
      handler(newVal) {
        if (!newVal) {
          this.article.logo = ''
          this.logo.tmpSrc = null
          this.logo.changed = true
        }
      },
      deep: true,
    },
  },

  methods: {

    async init() {
      this.article = JSON.parse(JSON.stringify(await this.$store.dispatch('news/GET_ARTICLE_BY_ID', this.id)))
      this.logo.file = new File([0], this.article.logo)
      this.logo.tmpSrc = this.article.logo
    },

    async saveLogo() {
      try {
        return await this.$store.dispatch('news/SAVE_LOGO', this.logo.file)
      } catch (err) { return this.traceError(err) }
    },

    uploadLogo() {
      if (!this.logo.file) {
        this.logo.tmpSrc = ''
        this.logo.uploadHint = ''
        this.logo.error = false
        return false
      }
      if (!this.logo.file.type.match(/image/)) {
        this.logo.uploadHint = 'Invalid file type'
        this.logo.error = true
        return false
      }
      if (this.logo.file.size > 100000) {
        this.logo.uploadHint = 'File is too large'
        this.logo.error = true
        return false
      }

      const reader = new FileReader()
      reader.onload = function s() {
        this.logo.tmpSrc = reader.result
        this.logo.changed = true
        this.logo.error = false
        this.logo.uploadHint = ''
      }.bind(this)
      reader.readAsDataURL(this.logo.file)

      return true
    },

    async saveArticle() {
      if (this.logo.changed) {
        this.$set(this.article, 'logo', this.logo.file ? await this.saveLogo() : null)
      }

      this.$set(this.$store.state.news.news, this.id, this.article)

      this.$store.dispatch('news/SAVE_CONTENT')
    },

    removeArticle() {
      this.$delete(this.$store.state.news.news, this.id)
      this.close = true
    },
  },

  mounted() {
    this.init()
  },
}
</script>

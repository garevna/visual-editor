<template>
  <v-container>
      <v-navigation-drawer
        absolute
        temporary
        width="70%"
        v-model="navigate"
      >
        <v-list v-if="keys">
          <v-subheader>
            <h3 color="primary">DGTek in media</h3>
            <v-spacer/>
            <v-icon large color="#09b" @click="newArticle">
              mdi-new-box
            </v-icon>
          </v-subheader>
          <v-list-item-group v-model="articleId" color="primary">
            <v-list-item
              v-for="id in keys"
              :key="id"
              :value="id"
            >
              <v-list-item-icon>
                <v-icon color="info">{{ 'mdi-link-box-variant' }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="newsContent[id].title"></v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <NewsEditor v-if="articleId && article" :id="articleId" :sourceArticle="article" :logoFromServer="logo"/>

      <ImageGallery v-if="logosEndpoint"
                    :endpoint="logosEndpoint"
                    :maxWidth="logoMaxWidth"
                    :maxHeight="logoMaxHeight"
                    :dialog.sync="dialog"
                    :logo.sync="logo"
      />

      <v-bottom-navigation
        v-model="bottomNav"
        app
        fixed
      >
        <v-btn disabled><h3>DGTek in media</h3></v-btn>
        <v-spacer/>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn @click="navigate=true" v-on="on">
              <v-icon large color="info">mdi-file-search</v-icon>
            </v-btn>
          </template>
          <span>List of news</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
          <v-btn text @click="newArticle" v-on="on">
            <v-icon large color="info">
              mdi-new-box
            </v-icon>
          </v-btn>
          </template>
          <span>Add new media article</span>
        </v-tooltip>

        <v-tooltip top v-if="articleId">
          <template v-slot:activator="{ on }">
            <v-btn @click="dialog=true" v-on="on">
              <v-icon large color="warning">mdi-image</v-icon>
            </v-btn>
          </template>
          <span>Select logo from server</span>
        </v-tooltip>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
/* import Popup from '@/components/RemovePopup.vue' */

import NewsEditor from '@/views/NewsEditor.vue'
import ImageGallery from '@/components/ImageGallery.vue'

export default {
  components: {
    NewsEditor,
    ImageGallery,
  },

  data: () => ({
    articleId: null,
    article: null,
    bottomNav: 0,
    navigate: false,
    logosEndpoint: null,
    logoMaxWidth: 150,
    logoMaxHeight: 80,
    dialog: false,
    logo: null,
  }),

  computed: {
    newsContent() {
      return this.$store.state.news.news
    },
    keys() {
      if (!this.newsContent) return null
      return Object.keys(this.newsContent)
    },
  },

  watch: {
    articleId(val) {
      if (!val) return
      this.$store.dispatch('news/GET_ARTICLE_BY_ID', val)
        .then((response) => { this.article = response })
      this.navigate = false
    },
    logo(val) {
      this.dialog = !val
    },
  },

  methods: {
    async newArticle() {
      const id = new Date().getTime().toString()

      this.$store.commit('SET_PROPERTY', {
        object: this.$store.state.news.news,
        propertyName: id,
        value: {
          title: 'DGTek in media...',
          source: '',
          date: new Date().toLocaleDateString(),
          logo: '',
          ref: '',
        },
      })

      this.saveNewsContent()
      this.articleId = id
    },

    removeArticle() {
      this.removePopupShow = true
    },

    saveNewsContent() {
      this.$store.dispatch('news/SAVE_NEWS', this.newsContent)
        .then(
          () => {},
          error => this.$store.dispatch('TRACE_ERROR', { moduleName: 'news', error }),
        )
    },

  },
  updated() {
    //
  },

  mounted() {
    this.$store.dispatch('news/GET_NEWS')
      .then(() => { this.logosEndpoint = this.$store.getters['news/logosEndpoint'] })
  },
}
</script>

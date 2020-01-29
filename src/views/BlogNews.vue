<template>
  <v-container>
      <v-navigation-drawer
        absolute
        temporary
        min-width="80"
        width="70%"
        v-model="navigate"
      >
        <v-list v-if="keys">
          <v-subheader>
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
                <v-icon color="success">{{ 'mdi-link-box-variant' }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="newsContent[id].title">
                  <v-avatar v-if="newsContent[id].logo">
                    <v-img :src="getLogo(id)" max-width="50"/>
                  </v-avatar>
                </v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <NewsEditor v-if="articleId && article" :id="articleId" :sourceArticle="article"/>

      <v-bottom-navigation
        v-model="bottomNav"
        fixed
        shift
      >
        <v-btn @click="navigate = true">
          <v-icon large color="info">mdi-cards-variant</v-icon>
        </v-btn>

        <v-btn>
          <v-icon color="secondary">mdi-image</v-icon>
        </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
/* import Popup from '@/components/RemovePopup.vue' */

import NewsEditor from '@/views/NewsEditor.vue'

export default {
  components: {
    NewsEditor,
  },

  data: () => ({
    articleId: null,
    article: null,
    bottomNav: 0,
    navigate: false,
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
  },

  methods: {
    getLogo(id) {
      return `${this.$store.getters['news/logosEndpoint']}/${this.newsContent[id].logo}`
    },
    async newArticle() {
      const id = new Date().getTime().toString()

      this.$set(this.newsContent, id, {
        title: 'DGTek in media...',
        source: '',
        data: new Date().toLocaleDateString(),
        logo: '',
        ref: '',
      })

      this.$store.commit('news/UPDATE_ARTICLE')
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
          err => this.$store.dispatch('ERROR_HANDLER', err),
        )
    },

  },
  updated() {
    //
  },

  mounted() {
    this.$store.dispatch('news/GET_NEWS')
  },
}
</script>

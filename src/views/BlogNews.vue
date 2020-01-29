<template>
  <v-container>
      <v-navigation-drawer
        app
        permanent
        expand-on-hover
        min-width="80"
        width="70%"
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
                <v-icon color="success">{{ 'mdi-pencil' }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="newsContent[id].title">
                </v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <NewsEditor v-if="article" :id="articleId" :sourceArticle="article"/>
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
    newsContent: null,
    keys: null,
    articleId: null,
    article: null,
  }),

  computed: {

  },

  watch: {
    articleId(val) {
      this.$store.dispatch('news/GET_ARTICLE_BY_ID', val)
        .then((response) => { this.article = response })
    },
  },

  methods: {

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

      this.articleId = id
    },

    removeArticle() {
      this.removePopupShow = true
    },

    async init() {
      this.newsContent = await this.$store.dispatch('news/GET_NEWS')
      this.keys = Object.keys(this.newsContent)
    },

  },
  updated() {
    // this.init()
  },

  mounted() {
    this.init()
  },
}
</script>

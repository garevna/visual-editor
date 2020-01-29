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
              <v-icon large color="#09b" @click="createNewArticle">
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
              <v-list-item-content v-if="blogContent[id]">
                <v-list-item-title v-text="blogContent[id].title">
                </v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <BlogArticle v-if="articleId && article" :id="articleId" :sourceArticle="article"/>

  </v-container>
</template>

<script>
/* import Popup from '@/components/RemovePopup.vue' */

import BlogArticle from '@/views/BlogArticle.vue'

export default {
  components: {
    BlogArticle,
  },

  data: () => ({
    articleId: null,
    article: null,
  }),

  computed: {
    blogContent() {
      return this.$store.state.blog.content
    },
    keys() {
      if (!this.blogContent) return null
      return Object.keys(this.blogContent)
    },
  },

  watch: {
    articleId(val) {
      if (!val) return
      this.$store.dispatch('blog/GET_ARTICLE_BY_ID', val)
        .then((response) => { this.article = response })
    },
  },

  methods: {

    async createNewArticle() {
      const id = new Date().getTime().toString()
      const fileName = `article${id}.html`

      await this.$store.dispatch('blog/SAVE_ARTICLE_CONTENT', {
        fileName,
        content: '<p>Empty...</p>',
      })
      this.$store.commit('SET_PROPERTY', {
        object: this.$store.state.blog.content,
        propertyName: id,
        value: {
          title: 'New Article...',
          type: 'file',
          file: fileName,
          author: '',
          author_ava: '',
          data: new Date().toLocaleDateString(),
          picture: '',
        },
      })
      this.saveBlogContent()
      this.articleId = id
    },

    saveBlogContent() {
      this.$store.dispatch('blog/SAVE_CONTENT', this.blogContent)
        .then(
          () => {},
          err => this.$store.dispatch('ERROR_HANDLER', err),
        )
    },

  },
  mounted() {
    this.$store.dispatch('blog/GET_CONTENT')
  },
}
</script>

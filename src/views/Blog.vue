<template>
  <v-container>
    <BlogCards v-if="blogContent" :articles="blogContent"/>
    <v-bottom-navigation app fixed>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
        <v-btn text @click="createNewArticle" v-on="on">
          <v-icon large> mdi-new-box </v-icon>
        </v-btn>
        </template>
        <span>Add new article</span>
      </v-tooltip>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import BlogCards from '@/components/BlogCards.vue'

export default {
  components: {
    BlogCards,
  },

  data: () => ({
    bottomNav: 0,
  }),

  computed: {
    ...mapState('blog', ['blogContent', 'defaultPicture', 'defaultAvatar']),
    ...mapGetters('blog', ['imagesEndpoint', 'avatarsEndpoint']),
    keys() {
      if (this.blogContent) return Object.keys(this.blogContent)
      return null
    },
  },

  watch: {
    //
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
        object: this.blogContent,
        propertyName: id,
        value: {
          title: 'New Article...',
          type: 'file',
          file: fileName,
          author: '',
          author_ava: this.defaultAvatar,
          data: new Date().toLocaleDateString(),
          picture: this.defaultPicture,
        },
      })
      this.saveBlogContent()
      this.articleId = id
    },

    saveBlogContent() {
      this.$store.dispatch('blog/SAVE_BLOG_CONTENT', this.blogContent)
        .then(
          () => {},
          err => this.$store.dispatch('ERROR_HANDLER', err),
        )
    },

  },
  mounted() {
    this.$store.dispatch('blog/GET_BLOG_CONTENT')
  },
}
</script>

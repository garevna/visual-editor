<template>
  <v-container>
    <v-row class="mx-6">
      <BlogCard
          v-for="article in articles"
          :key="article.id"
          :id="article.id"
          :selected.sync="selected"
          :operation.sync="operation"
          :picture="article.logo"
          :title="article.title"
          @click="editArticle(article.id)"/>
    </v-row>
    <RemovePopup
        :confirm.sync="confirm"
        :visibility.sync="dialog"
        :removing="removed"
        :details="details"
    />
    <v-bottom-navigation app fixed dark class="primary">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
        <v-btn text @click="createNewArticle()" v-on="on">
          <v-icon> mdi-new-box </v-icon>
        </v-btn>
        </template>
        <span>Add new article</span>
      </v-tooltip>
    </v-bottom-navigation>
  </v-container>
</template>

<script>

import BlogCard from '@/components/BlogCard.vue'
import RemovePopup from '@/components/RemovePopup.vue'
/* eslint-disable no-console */
export default {
  components: {
    BlogCard,
    RemovePopup,
  },
  data: () => ({
    selected: null,
    operation: null,
    dialog: false,
    confirm: false,
    bottomNav: 0,
    articles: null,
    removed: '',
    details: '',
  }),

  watch: {
    selected() {
      if (this.operation === 'edit') this.editArticle()
      if (this.operation === 'remove') this.dialog = true
    },
    confirm(val) {
      console.log('removing: ', val, this.selected)
      if (!val) return
      this.$store.dispatch('blog/REMOVE_ARTICLE_BY_ID', this.selected)
      this.articles.splice(this.articles.findIndex(item => item.id === this.selected))
      this.selected = null
      this.dialog = false
    },
  },
  methods: {

    async createNewArticle() {
      console.log('Create article...')
      const response = await this.$store.dispatch('blog/CREATE_NEW_ARTICLE')
      if (!response) return
      this.articles = response.content.data
      this.selected = response.id
    },

    editArticle() {
      this.$router.push({ name: 'article', params: { article: this.selected } })
    },

    removeArticle() {
      const deleted = this.articles.find(item => item.id === this.selected)
      this.removed = deleted.title
      this.details = `<img src='${deleted.logo}' width="200"/>`
      this.dialog = true
    },
  },

  mounted() {
    this.$store.dispatch('blog/GET_BLOG_CONTENT')
      .then((response) => { this.articles = response })
  },
}
</script>

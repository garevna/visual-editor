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
        :removing="toRemove"
        :details="details"
    />
    <v-bottom-navigation app fixed dark class="primary">
      <v-tooltip top color="info">
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
  }),

  computed: {
    selectedArticle() {
      if (!this.selected) return null
      return this.articles.find(item => item.id === this.selected)
    },
    selectedIndex() {
      if (!this.selected) return null
      return this.articles.findIndex(item => item.id === this.selected)
    },
    toRemove() {
      if (!this.selectedArticle) return ''
      return `<h3>${this.selectedArticle.title}</h3>`
    },
    details() {
      if (!this.selectedArticle) return ''
      return `<img src="${this.selectedArticle.logo}" width="200"/>`
    },
  },

  watch: {
    selected() {
      if (this.operation === 'edit') this.editArticle()
      if (this.operation === 'remove') this.dialog = true
    },
    confirm(val) {
      if (!val) return
      this.$store.dispatch('blog/REMOVE_ARTICLE_BY_ID', this.selected)
      this.articles.splice(this.selectedIndex, 1)
      this.selected = null
      this.operation = null
      this.dialog = false
      this.confirm = false
    },
  },
  methods: {

    async createNewArticle() {
      const response = await this.$store.dispatch('blog/CREATE_NEW_ARTICLE')
      if (!response) return
      this.articles = response.content.data
      this.selected = response.id
      this.operation = 'edit'
    },

    editArticle() {
      this.$router.push({ name: 'article', params: { article: this.selected } })
    },

    removeArticle() {
      this.operation = null
      this.confirm = false
      this.dialog = true
    },
  },

  mounted() {
    this.$store.dispatch('blog/GET_BLOG_CONTENT')
      .then((response) => { this.articles = response })
  },
}
</script>

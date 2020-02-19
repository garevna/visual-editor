<template>
  <v-container>
    <v-container>
      <v-row class="mx-6">
        <NewsCard
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
  </v-container>
</template>

<script>
/* import Popup from '@/components/RemovePopup.vue' */

/* eslint-disable no-console */

import { mapGetters } from 'vuex'

import RemovePopup from '@/components/RemovePopup.vue'
import NewsCard from '@/components/NewsCard.vue'

export default {
  components: {
    RemovePopup,
    NewsCard,
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
    ...mapGetters('news', ['logosEndpoint']),
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
      this.$store.dispatch('news/REMOVE_ARTICLE_BY_ID', this.selected)
      this.articles.splice(this.selectedIndex, 1)
      this.selected = null
      this.operation = null
      this.dialog = false
      this.confirm = false
    },
    editArticle() {
      this.$router.push({ name: 'newsArticle', params: { article: this.selected } })
    },
  },

  methods: {

    async getData() {
      const result = await this.$store.dispatch('news/GET_NEWS')
      this.articles = result.data
      console.log(this.articles)
    },

    async createNewArticle() {
      const response = await this.$store.dispatch('news/CREATE_NEW_ARTICLE')
      if (!response) return
      this.articles = response.content.data
      this.selected = response.id
      this.operation = 'edit'
    },

    editArticle() {
      this.$router.push({ name: 'newsArticle', params: { article: this.selected } })
    },

    removeArticle() {
      this.operation = null
      this.confirm = false
      this.dialog = true
    },
  },

  mounted() {
    this.getData()
  },
}
</script>

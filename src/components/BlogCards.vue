<template>
  <v-container>
    <v-row class="mx-6">
      <BlogCard
          v-for="id in keys"
          :key="id"
          :id="id"
          :selected.sync="selected"
          :operation.sync="operation"
          :picture="pictureURL(id)"
          :title="blogContent[id].title"
          @click="editArticle(id)"/>
    </v-row>
    <RemovePopup :confirm.sync="confirm" :visibility.sync="dialog"/>
  </v-container>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
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
  }),
  watch: {
    selected() {
      if (this.operation === 'edit') this.editArticle()
      if (this.operation === 'remove') this.dialog = true
    },
    confirm(val) {
      if (!val) return
      this.$store.dispatch('blog/REMOVE_ARTICLE', this.selected)
    },
  },
  computed: {
    ...mapState('blog', ['blogContent']),
    ...mapGetters('blog', ['pictureURL', 'avatarURL']),
    keys() {
      return Object.keys(this.blogContent)
    },
  },
  methods: {
    editArticle() {
      this.$router.push({ name: 'article', params: { article: this.selected } })
    },
    removeArticle() {
      this.dialog = true
    },
  },
}
</script>

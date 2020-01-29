<template>
  <v-container>
    <v-card flat>
      <v-card-text class="pt-4">
        Map addresses Editor
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    files: null,
    currentFile: '',
    container: null,
    content: null,
  }),
  computed: {

  },
  mounted() {
    this.$store.dispatch('blog/GET_BLOG_CONTENT')
      .then((response) => { this.content = response })
  },
}
</script>

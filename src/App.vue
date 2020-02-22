<template>
  <v-app>
    <v-app-bar app color="white" hide-on-scroll>
      <v-toolbar-title>Visual editors</v-toolbar-title>
        <v-card class="ml-10" flat>
          <v-tabs v-model="tab">
            <v-tab @click="blog()">Posts</v-tab>
            <v-tab @click="news()">News</v-tab>
          </v-tabs>
        </v-card>

      <v-spacer></v-spacer>

      <v-btn :href="href" text>
        <span class="mr-2">DKA PANEL</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    tab: 0,
  }),
  computed: {
    route() {
      return this.$route.name
    },
    href() {
      if (this.route) {
        const routePath = this.route.name === 'blog' || this.route.name === 'article' ? 'posts' : 'dgtek-in-media'
        return `https://dka.dgtek.net/${routePath}`
      }
      return 'https://dka.dgtek.net'
    },
  },

  methods: {
    blog() {
      if (this.route.name === 'blog') return
      this.$router.push({ name: 'blog' })
    },
    news() {
      if (this.route.name === 'news') return
      this.$router.push({ name: 'news' })
    },
  },
  mounted() {
    this.$router.push({ name: 'blog' })
  },
}
</script>

<template>
  <v-app>
    <v-app-bar app color="secondary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="DGTek Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="50"
        />

        <v-btn @click="goHome" text>
          <span class="mr-2">Admin</span>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://dgtek.net/" target="_blank" text>
        <span class="mr-2">View result</span>
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

  components: {
    //
  },

  data: () => ({
    //
  }),
  methods: {
    goHome() {
      this.$router.push({ path: '/' })
    },
  },
  mounted() {
    // this.$router.push({ path: 'home' })
  },
}
</script>

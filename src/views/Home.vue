<template>
<v-container class="fill-height" fluid>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card
        class="mx-auto my-auto"
        max-width="300"
        tile
      >
        <v-list>
          <v-subheader>Visual Editors</v-subheader>
          <v-list-item-group v-model="route" color="info">
            <v-list-item
              v-for="item in items"
              :key="item.route"
              :to="{ name: item.route }"
              @click="clickHandler"
              exact
            >
              <v-list-item-icon>
                <v-icon color="info" v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>

export default {
  name: 'Home',
  data: () => ({
    route: '/',
    items: [
      { text: 'Blog posts', icon: 'mdi-file', route: 'blog' },
      { text: 'DGTek in media', icon: 'mdi-newspaper', route: 'news' },
      { text: 'FAQ', icon: 'mdi-frequently-asked-questions', route: 'faq' },
      { text: 'Site content', icon: 'mdi-file-edit', route: 'content' },
    ],
  }),
  methods: {
    clickHandler() {
      //
    },
  },
}
</script>

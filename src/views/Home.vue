<template>
  <v-card
    class="mx-auto my-auto"
    max-width="300"
    tile
  >
    <v-list>
      <v-subheader>Editors</v-subheader>
      <v-list-item-group v-model="route" color="primary">
        <v-list-item
          v-for="item in items"
          :key="item.route"
          :to="{ name: item.route }"
          @click="clickHandler"
          exact
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>

export default {
  name: 'Home',
  data: () => ({
    route: '/',
    items: [
      { text: 'Blog posts', icon: 'mdi-file', route: 'blog' },
      { text: 'DGTek in media', icon: 'mdi-newspaper', route: 'news' },
      { text: 'Address list for map', icon: 'mdi-map-search', route: 'addresses' },
      { text: 'Polygons for map', icon: 'mdi-map-marker', route: 'polygons' },
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

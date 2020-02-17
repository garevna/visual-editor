<template>
<v-row>
  <v-bottom-navigation app fixed dark class="primary">
    <v-tooltip top color="info">
      <template v-slot:activator="{ on }">
        <v-btn @click="$router.push({ name: 'news' })" v-on="on">
          <v-icon>mdi-file-search</v-icon>
        </v-btn>
      </template>
      <span>All blog articles</span>
    </v-tooltip>

    <v-tooltip top color="info">
      <template v-slot:activator="{ on }">
        <v-btn text @click="$emit('update:save', true)" v-on="on">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </template>
      <span>Save article info</span>
    </v-tooltip>

    <v-tooltip top color="info">
      <template v-slot:activator="{ on }">
        <v-btn @click="logoDialog=true" v-on="on">
          <v-icon>mdi-image-search</v-icon>
        </v-btn>
      </template>
      <span>Select logo from server</span>
    </v-tooltip>

  </v-bottom-navigation>

  <ImageGallery
        moduleName="news"
        :staticEndpoint="staticLogoEndpoint"
        :removeEndpoint="logosEndpoint"
        maxWidth="120"
        maxHeight="80"
        :dialog.sync="logoDialog"
        :image.sync="logoURL"
  />
</v-row>
</template>

<script>

import { mapGetters } from 'vuex'

import ImageGallery from '@/components/ImageGallery.vue'

export default {
  components: {
    ImageGallery,
  },
  props: ['save', 'logoSrc'],
  data: () => ({
    logoDialog: false,
    logoURL: '',
  }),
  computed: {
    ...mapGetters('news', [
      'staticLogoEndpoint',
      'logosEndpoint',
    ]),
  },
  watch: {
    logoURL(val) {
      this.$emit('update:logoSrc', val)
      this.$emit('update:logoDialog', false)
    },
  },
}
</script>

<template>
<v-row>
  <v-bottom-navigation app fixed dark class="secondary">
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn @click="$router.push({ name: 'blog' })" v-on="on">
          <v-icon large>mdi-file-search</v-icon>
        </v-btn>
      </template>
      <span>All blog articles</span>
    </v-tooltip>

    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn text @click="$emit('update:save', true)" v-on="on">
          <v-icon large>mdi-content-save</v-icon>
        </v-btn>
      </template>
      <span>Save article</span>
    </v-tooltip>

    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn @click="imageDialog=true" v-on="on">
          <v-icon large>mdi-image-search</v-icon>
        </v-btn>
      </template>
      <span>Select article picture from server</span>
    </v-tooltip>

    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn @click="avatarDialog=true" v-on="on">
          <v-icon large>mdi-account-box</v-icon>
        </v-btn>
      </template>
      <span>Select author avatar from server</span>
    </v-tooltip>

  </v-bottom-navigation>

  <ImageGallery
        :endpoint="imagesEndpoint"
        maxWidth="700"
        maxHeight="400"
        :dialog.sync="imageDialog"
        :image.sync="pictureURL"
  />
  <ImageGallery
        :endpoint="avatarsEndpoint"
        maxWidth="70"
        maxHeight="70"
        :dialog.sync="avatarDialog"
        :image.sync="avatarURL"
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
  props: ['save', 'pictureSource', 'avatarSource', 'pictureSrc', 'avatarSrc'],
  data: () => ({
    imageDialog: false,
    avatarDialog: false,
    pictureURL: '',
    avatarURL: '',
  }),
  watch: {
    pictureURL(val) {
      this.$emit('update:pictureSrc', val)
      this.$emit('update:pictureSource', 'server')
      this.$emit('update:imageDialog', false)
    },
    avatarURL(val) {
      this.$emit('update:avatarSrc', val)
      this.$emit('update:avatarSource', 'server')
      this.$emit('update:avatarDialog', false)
    },
  },
  computed: {
    ...mapGetters('blog', ['imagesEndpoint', 'avatarsEndpoint']),
  },
  methods: {
    //
  },
}
</script>

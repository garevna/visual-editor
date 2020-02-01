<template>
<v-row justify="center">
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card v-if="pictures" class="pa-4" v-resize="onResize">
      <v-toolbar dark color="secondary">
        <v-toolbar-title>Select logo picture from below</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="$emit('update:dialog', false)">Close</v-btn>
          </v-toolbar-items>
      </v-toolbar>
      <v-row>
        <v-col
          v-for="(file, index) in pictures"
          :key="index"
          cols="12"
          :sm="sm"
        >
          <v-card hover class="pa-0" tile>
          <v-fab-transition>
            <v-btn fab icon @click="removePicture(index)">
              <v-icon color="red darken-2">mdi-delete</v-icon>
            </v-btn>
          </v-fab-transition>
            <v-card-text>
            <v-img :src="getPath(file)"
                   :max-height="maxHeight"
                   :max-width="maxWidth"
                   contain
                   @click="$emit('update:logo', pictures[index])"
            />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</v-row>
</template>

<script>
export default {
  name: 'ImageGallery',
  props: {
    dialog: Boolean,
    logo: String,
    endpoint: {
      type: String,
      required: true,
    },
    maxWidth: {
      type: Number,
      default: 150,
    },
    maxHeight: {
      type: Number,
      default: 100,
    },
  },
  data: () => ({
    pictures: null,
    sm: 4,
  }),

  watch: {
    //
  },

  methods: {
    async getImages() {
      const images = await (await fetch(this.endpoint)).json()
      this.pictures = images.filter(img => img.match(/upload_/))
    },
    getPath(file) {
      return `${this.endpoint}/${file}`
    },
    onResize() {
      this.sm = Math.round(32 / Math.round(window.innerWidth / this.maxWidth))
    },
    async removePicture(index) {
      try {
        await fetch(`${this.endpoint}/${this.pictures[index]}`, {
          method: 'DELETE',
        })
        /* eslint-disable-next-line */
        console.log(this.pictures)
        this.pictures.splice(index, 1)
        /* eslint-disable-next-line */
        console.log(this.pictures)
      } catch (error) {
        const moduleName = this.endpoint.match('news') ? 'news' : 'blog'
        this.$store.dispatch('TRACE_ERROR', { moduleName, error })
      }
    },
    selectPicture(index) {
      this.$store.commit('SET_SELECTED_LOGO', this.pictures[index])
      this.dialog = false
    },
  },
  mounted() {
    this.getImages()
    this.sm = Math.round(32 / Math.round(window.innerWidth / this.maxWidth))
  },
}
</script>

<template>
<v-row justify="center">
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card v-if="pictures" class="pa-4" v-resize="onResize">
      <v-toolbar dark color="secondary">
        <v-toolbar-items>
          <v-btn icon @click="getImages()">
            <v-icon large color="#555">mdi-reload</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-title>Select image from below</v-toolbar-title>
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
          :lg="lg"
        >
          <v-card hover class="pa-0" tile>
            <v-fab-transition>
              <v-btn fab icon @click="removePicture(index)">
                <v-icon color="red darken-2">mdi-delete</v-icon>
              </v-btn>
            </v-fab-transition>
            <v-card-text>
              <v-img :src="`${staticEndpoint}/${file}`"
                     max-height="300"
                     v-model="img"
                     @click="select(index)"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>

  <RemovePopup :visibility.sync="removePopupVisible"
               :confirm.sync="confirmRemoving"
               removing="Image"
               :details="details"
  />
</v-row>
</template>

<script>

import RemovePopup from '@/components/RemovePopup.vue'

export default {
  name: 'ImageGallery',

  components: {
    RemovePopup,
  },

  props: {
    moduleName: {
      type: String,
      required: true,
    },
    dialog: Boolean,
    image: String,
    staticEndpoint: {
      type: String,
      required: true,
    },
    removeEndpoint: {
      type: String,
      required: true,
    },
    maxWidth: {
      type: [Number, String],
      default: 150,
    },
    maxHeight: {
      type: [Number, String],
      default: 100,
    },
  },

  data: () => ({
    img: null,
    pictures: null,
    sm: 12,
    lg: 6,
    removePopupVisible: false,
    confirmRemoving: false,
    details: null,
    removing: null,
  }),

  watch: {
    confirmRemoving(val) {
      if (!val) return
      this.$store.dispatch(`${this.moduleName}/REMOVE_IMAGE`, `${this.removeEndpoint}/${this.pictures[this.removing]}`)
        .then(result => (result && this.pictures.splice(this.removing, 1)))
      this.removePopupVisible = false
    },
  },

  methods: {
    select(index) {
      this.$emit('update:image', `${this.staticEndpoint}/${this.pictures[index]}`)
      this.$emit('update:dialog', false)
    },
    async getImages() {
      this.pictures = await this.$store
        .dispatch(`${this.moduleName}/GET_IMAGES`, this.removeEndpoint)
    },
    onResize() {
      this.sm = Math.round(32 / Math.round(window.innerWidth / this.maxWidth))
      this.lg = Math.round(18 / Math.round(window.innerWidth / this.maxWidth))
    },
    removePicture(index) {
      this.confirmRemoving = false
      this.removing = index
      this.details = `<img src="${this.staticEndpoint}/${this.pictures[index]}" width="100"/>`
      this.removePopupVisible = true
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

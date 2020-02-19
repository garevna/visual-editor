<template>
<!--<v-card flat class="ma-0 pa-0">
  <v-card-text class="transparent" dark>-->
    <v-file-input dark
          :label="label"
          prepend-icon="mdi-camera"
          @change="upload"
          v-model="img"
          :hint="setHint()"
          :error="error"
    >
    </v-file-input>
<!--  </v-card-text>
</v-card>-->
</template>

<script>

export default {
  props: {
    id: String,
    file: File,
    label: String,
    source: String,
    src: String,
  },
  data: () => ({
    img: null,
  }),
  computed: {
    error() {
      return Boolean(this.setHint())
    },
  },
  methods: {
    async upload() {
      if (!this.img || this.error) return
      this.$emit('update:file', this.img)
      this.$emit('update:source', 'client')
      this.$emit('update:src', URL.createObjectURL(this.img))
    },
    setHint() {
      if (this.source !== 'client') return ''
      if (!this.file || !(this.file instanceof File)) return ''
      if (this.file.size > this.limit) return 'File is too large'
      if (!this.file.type.match(/image/)) return 'Invalid file type'
      return ''
    },
  },
}
</script>

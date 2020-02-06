<template>
<v-card flat>
  <v-card-text class="pl-10">
    <v-file-input
          :label="label"
          prepend-icon="mdi-camera"
          @change="upload"
          v-model="img"
          :hint="setHint()"
          :error="error"
    >
    </v-file-input>
  </v-card-text>
</v-card>
</template>

<script>
/* eslint-disable no-console */

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
      try {
        const image = await this.readFile()
        this.$emit('update:file', this.img)
        this.$emit('update:source', 'client')
        this.$emit('update:src', image)
      } catch (error) { console.warn(error) }
    },
    readFile() {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(this.img)
      })
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

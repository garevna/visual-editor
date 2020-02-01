<template>
    <v-card flat
      class="mx-auto my-auto"
      width="80%"
      tile
      v-if="!close && article"
    >
      <!-- actions -->

      <v-card-actions>
        <v-btn text @click="saveArticle">
          <v-icon large color="info">mdi-content-save</v-icon>
        </v-btn>
        <v-spacer/>
        <v-btn text @click="removeArticle">
          <v-icon large color="error">mdi-delete-circle</v-icon>
        </v-btn>
      </v-card-actions>
      <v-divider/>
      <!-- header -->

      <v-card-title>
        <v-text-field label="Article header" v-model="article.title">
          <v-icon small slot="append" color="info">mdi-pencil</v-icon>
        </v-text-field>
      </v-card-title>

      <!-- content -->

      <v-row>
        <v-col cols="3">
          <v-card-text>
            <v-text-field label="Article date" v-model="article.data">
              <v-icon small slot="append" color="info">mdi-pencil</v-icon>
            </v-text-field>
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-text v-if="article.type === 'file'">
            <v-icon small color="warning">mdi-file-document-outline</v-icon> <small>{{article.file}}</small>
          </v-card-text>
          <v-card-text v-else>
            <v-text-field label="Article url" v-model="article.url">
              <v-icon small slot="append" color="info">mdi-pencil</v-icon>
            </v-text-field>
          </v-card-text>
        </v-col>
      </v-row>

      <!--  AUTHOR -->
      <v-card raized>
        <v-row>
          <v-col cols="5">
            <v-card-text>
              <v-text-field label="Article author" v-model="article.author">
                <v-icon small slot="append" color="info">mdi-pencil</v-icon>
              </v-text-field>
            </v-card-text>
          </v-col>
          <v-col cols="2">
            <v-card-text raised>
              <v-avatar>
                <v-img v-if="avatarSrc" :src="avatarSrc"></v-img>
              </v-avatar>
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-text class="pl-10">
              <v-file-input
                label="Upload author avatar"
                prepend-icon="mdi-camera"
                @change="uploadAvatar"
                v-model="avatar.file"
                :hint="avatarUploadHint"
                :error="avatarError"
              ></v-file-input>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>

      <!--  PICTURE  -->
      <v-card raized>
        <v-row v-if="article.type === 'file'">
          <v-col cols="6">
            <v-card-text class="pr-10">
              <v-img v-if="pictureSrc" :src="pictureSrc"></v-img>
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-text class="pl-10">
              <v-file-input
                label="Upload picture"
                prepend-icon="mdi-camera"
                @change="uploadPicture"
                v-model="picture.file"
                :hint="pictureUploadHint"
                :error="pictureError"
              >
              </v-file-input>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>

      <VueEditor v-if="article.type === 'file'" v-model="content.text"/>
      <!--
        <Popup v-model="remove"
          :confirm.sync="confirmRemoving"
          :removePopupVisible="removePopupShow"
          :removing="blogContent[article].title"
        />
      -->
    </v-card>
</template>

<script>

import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    imageFromServer: String,
    avatarFromServer: String,
  },

  data: () => ({
    picture: {
      source: 'article',
      file: null,
      src: null,
      limit: 500000,
    },
    avatar: {
      source: 'article',
      file: null,
      src: null,
      limit: 50000,
    },
    content: {
      file: null,
      text: '',
      changed: false,
    },
    close: false,
  }),
  computed: {
    article() {
      if (!this.id || !this.$store.state.blog.content) return null
      return this.$store.state.blog.content[this.id]
    },
    imageEndpoint() {
      return this.$store.getters['blog/imagesEndpoint']
    },
    avatarEndpoint() {
      return this.$store.getters['blog/avatarsEndpoint']
    },

    pictureSrc() {
      if (this.picture.source === 'article' && this.article.picture) return `${this.imageEndpoint}/${this.article.picture}`
      if (this.picture.source === 'client' && !this.pictureError) return this.picture.src
      if (this.picture.source === 'server') return `${this.imageEndpoint}/${this.imageFromServer}`
      return ''
    },
    avatarSrc() {
      if (this.avatar.source === 'article' && this.article.author_ava) return `${this.avatarEndpoint}/${this.article.author_ava}`
      if (this.avatar.source === 'client' && !this.avatarError) return this.avatar.src
      if (this.avatar.source === 'server') return `${this.avatarEndpoint}/${this.avatarFromServer}`
      return ''
    },
    pictureUploadHint() {
      return this.setHint('picture')
    },
    avatarUploadHint() {
      return this.setHint('avatar')
    },
    pictureError() { return Boolean(this.pictureUploadHint) },
    avatarError() { return Boolean(this.avatarUploadHint) },

  },

  watch: {
    id() {
      this.init()
    },
    'picture.file': {
      handler(newVal) {
        if (this.picture.error) return
        if (!newVal) this.logo.src = ''
        else this.picture.source = 'client'
      },
      deep: true,
    },
    'avatar.file': {
      handler(newVal) {
        if (this.avatar.error) return
        if (!newVal) this.avatar.src = ''
        else this.avatar.source = 'client'
      },
      deep: true,
    },
    imageFromServer() {
      this.picture.source = 'server'
    },
    avatarFromServer() {
      this.avatar.source = 'server'
    },
  },

  methods: {
    setPicture(newVal) {
      this.$set(this.$store.state.blog.content[this.id], 'picture', newVal)
    },
    setAvatar(newVal) {
      this.$set(this.$store.state.blog.content[this.id], 'author_ava', newVal)
    },

    setHint(param) {
      if (this[param].source !== 'client') return ''
      if (!this[param].file || !(this[param].file instanceof File)) return ''
      if (this[param].file.size > this[param].limit) return 'File is too large'
      if (!this[param].file.type.match(/image/)) return 'Invalid file type'
      return ''
    },

    async init() {
      this.picture.file = null
      this.picture.src = ''
      this.picture.source = 'article'

      this.avatar.file = null
      this.avatar.src = ''
      this.avatar.source = 'article'

      if (this.id) {
        if (this.article && this.article.type === 'file') {
          this.content.file = this.article.file
          this.content.text = await this.$store.dispatch('blog/GET_ARTICLE_CONTENT', this.article.file)
        }
      }
    },

    saveContent() {
      this.$store.dispatch('blog/SAVE_ARTICLE_CONTENT', {
        fileName: this.content.file,
        content: this.content.text,
      })
        .then(
          () => { this.content.changed = false },
          err => this.$store.dispatch('TRACE_ERROR', err),
        )
    },

    async savePicture() {
      try {
        return await this.$store.dispatch('blog/SAVE_PICTURE', this.picture.file)
      } catch (err) { return '' }
    },

    async saveAvatar() {
      try {
        return await this.$store.dispatch('blog/SAVE_AVATAR', this.avatar.file)
      } catch (err) { return '' }
    },

    uploadImage(param) {
      if (!this[param].file || this[`${param}Error`]) return

      const reader = new FileReader()
      reader.onload = function s() {
        this[param].src = reader.result
        this[param].source = 'client'
      }.bind(this)
      reader.readAsDataURL(this[param].file)
    },

    uploadPicture() {
      this.uploadImage('picture')
    },

    uploadAvatar() {
      this.uploadImage('avatar')
    },

    async saveArticle() {
      if (this.picture.source === 'client') this.$set(this.article, 'picture', this.picture.file ? await this.savePicture() : '')
      if (this.picture.source === 'server') this.$set(this.article, 'picture', this.imageFromServer)

      if (this.avatar.source === 'client') this.$set(this.article, 'author_ava', this.avatar.file ? await this.saveAvatar() : '')
      if (this.avatar.source === 'server') this.$set(this.article, 'author_ava', this.avatarFromServer)

      this.saveContent(this.content.text)

      this.$store.dispatch('blog/SAVE_CONTENT')
    },

    async removeArticle() {
      this.close = await this.$store.dispatch('blog/REMOVE_ARTICLE', this.id)
    },
  },

  mounted() {
    this.init()
  },
}
</script>

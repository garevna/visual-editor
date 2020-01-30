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
                :hint="avatar.uploadHint"
                :error="avatar.error"
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
                :hint="picture.uploadHint"
                :error="picture.error"
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
  },

  data: () => ({
    picture: {
      file: null,
      tmpSrc: '',
      uploadHint: '',
      error: false,
      changed: false,
      limit: 500000,
    },
    avatar: {
      file: null,
      tmpSrc: '',
      uploadHint: '',
      error: false,
      changed: false,
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
    pictureSrc() {
      if (this.article && this.article.picture) {
        return `${this.$store.getters['blog/imagesEndpoint']}/${this.article.picture}`
      }
      return this.picture.tmpSrc
    },
    avatarSrc() {
      if (this.article && this.article.author_ava) {
        return `${this.$store.getters['blog/avatarsEndpoint']}/${this.article.author_ava}`
      }
      return this.avatar.tmpSrc
    },
    'picture.uploadHint': () => { this.setHint(this.picture.file, this.picture.limit) },
    'avatar.uploadHint': () => { this.setHint(this.avatar.file, this.avatar.limit) },
    'picture.error': () => Boolean(this.picture.uploadHint),
    'avatar.error': () => Boolean(this.avatar.uploadHint),

  },

  watch: {
    id() {
      this.init()
    },
    'picture.file': {
      handler(newVal) {
        if (!newVal) {
          this.setPicture('')
          this.picture.tmpSrc = ''
          this.picture.changed = true
        }
      },
      deep: true,
    },
    'avatar.file': {
      handler(newVal) {
        if (!newVal) {
          this.setAvatar('')
          this.avatar.tmpSrc = null
          this.avatar.changed = true
        }
      },
      deep: true,
    },
  },

  methods: {
    setHint(file, limit) {
      if (!file || !(file instanceof File)) return ''
      if (!file.type.match('image')) return 'Invalid file type'
      if (file.size > limit) return 'File is too large'
      return ''
    },

    setPicture(newVal) {
      this.$set(this.$store.state.blog.content[this.id], 'picture', newVal)
    },
    setAvatar(newVal) {
      this.$set(this.$store.state.blog.content[this.id], 'author_ava', newVal)
    },

    async init() {
      this.picture.file = new File([0], '')
      this.picture.tmpSrc = null
      this.avatar.file = new File([0], '')
      this.avatar.tmpSrc = null

      if (this.id) {
        if (this.article && this.article.type === 'file') {
          this.content.file = this.article.file
          this.content.text = await this.$store.dispatch('blog/GET_ARTICLE_CONTENT', this.article.file)
          this.picture.file = new File([0], this.article.picture)
          this.picture.tmpSrc = this.article.picture
        }
        this.avatar.file = new File([0], this.article.author_ava)
        this.avatar.tmpSrc = this.article.author_ava
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

    uploadImageFile(param) {
      if (['picture', 'avatar'].indexOf(param) === -1) return false

      if (!this[param].file) {
        this[param].tmpSrc = ''
        return false
      }
      if (this[param].error) return false

      const reader = new FileReader()
      reader.onload = function s() {
        this[param].tmpSrc = reader.result
        this[param].changed = true
      }.bind(this)
      reader.readAsDataURL(this[param].file)

      return true
    },

    uploadPicture() {
      return this.uploadImageFile('picture')
    },

    uploadAvatar() {
      return this.uploadImageFile('avatar')
    },

    async saveArticle() {
      if (this.picture.changed) {
        this.$set(
          this.$store.state.blog.content[this.id],
          'picture',
          this.picture.file ? await this.savePicture() : '',
        )
      }
      if (this.avatar.changed) {
        this.$set(
          this.$store.state.blog.content[this.id],
          'author_ava',
          this.avatar.file ? await this.saveAvatar() : '',
        )
      }
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

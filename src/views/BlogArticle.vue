<template>
  <v-container v-if="article">
    <v-card class="mx-auto" max-width="1000" flat tile v-if="!close && article">

      <!-- header -->
      <v-card-title class="mx-8 mt-8 mb-0">
        <v-text-field outlined label="Article header" v-model="article.title">
          <v-icon small slot="append" color="info">mdi-pencil</v-icon>
        </v-text-field>
      </v-card-title>

      <!-- content -->

      <v-row class="mx-10">
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-card-text>
            <v-text-field outlined label="Article date" v-model="article.data">
              <v-icon small slot="append" color="info">mdi-pencil</v-icon>
            </v-text-field>
          </v-card-text>
        </v-col>

        <!--  AUTHOR -->
        <v-col cols="12" sm="6" md="4" lg="4">
          <v-card-text>
              <v-text-field outlined label="Article author" v-model="article.author">
                <v-icon small slot="append" color="info">mdi-pencil</v-icon>
              </v-text-field>
          </v-card-text>
        </v-col>
        <v-col cols="12" sm="4" md="2" lg="1">
          <v-card-text>
              <v-avatar>
                <v-img v-if="avatarSrc" :src="avatarSrc" onerror="imageError"></v-img>
              </v-avatar>
          </v-card-text>
        </v-col>
        <v-col cols="12" sm="8" md="3" lg="4">
            <UploadImage
                :file.sync="avatar.file"
                :source.sync="avatar.source"
                :src.sync="avatar.src"
                label="Upload author avatar"
                limit="avatar.limit"
                :id="id"
            />
        </v-col>
      </v-row>
    </v-card>

    <!--  PICTURE  -->

    <v-card flat class="mx-auto" max-width="1000">
      <v-row v-if="article && article.type === 'file'">
        <v-col cols="12" sm="12" md="9">
            <v-card-text class="pr-10">
              <v-img v-if="pictureSrc" :src="pictureSrc" onerror="imageError" height="200" contain class="secondary"></v-img>
            </v-card-text>
          </v-col>
          <v-col cols="12" sm="12" md="3">
            <UploadImage
                :file.sync="picture.file"
                :source.sync="picture.source"
                :src.sync="picture.src"
                limit="picture.limit"
                label='Upload picture'
                :id="id"
            />
          </v-col>
        </v-row>
      </v-card>

      <v-card flat class="mx-auto" max-width="1000">
        <v-card-text v-if="article.type === 'file'">
            <v-icon small color="warning">mdi-file-document-outline</v-icon> <small>{{article.file}}</small>
        </v-card-text>
        <v-card-text v-else>
            <v-text-field outlined label="Article url" v-model="article.url">
              <v-icon small slot="append" color="info">mdi-pencil</v-icon>
            </v-text-field>
        </v-card-text>
        <v-card flat class="mx-10">
          <VueEditor v-if="article.type === 'file'" v-model="textContent.text"/>
        </v-card>
      </v-card>

      <ArticleBottom
          :save.sync="save"
          :pictureSrc.sync="picture.src"
          :pictureSource.sync="picture.source"
          :avatarSrc.sync="avatar.src"
          :avatarSource.sync="avatar.source"/>
  </v-container>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import { VueEditor } from 'vue2-editor'

import UploadImage from '@/components/UploadImage.vue'
import ArticleBottom from '@/components/ArticleBottom.vue'
// import RemovePopup from '@/components/RemovePopup.vue'

export default {
  components: {
    VueEditor,
    // RemovePopup,
    UploadImage,
    ArticleBottom,
  },

  data: () => ({
    id: null,
    pictureSrc: '',
    avatarSrc: '',
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
    textContent: {
      file: null,
      text: '',
      changed: false,
    },
    close: false,
    save: false,
    removePopupVisible: false,
    confirmRemoving: false,
  }),
  computed: {
    ...mapState('blog', ['blogContent', 'defaultPicture', 'defaultAvatar']),
    ...mapGetters('blog', ['imagesEndpoint', 'avatarsEndpoint', 'pictureURL', 'avatarURL']),

    article() {
      if (!this.id || !this.blogContent) return null
      return this.blogContent[this.id]
    },
  },

  watch: {
    id() {
      this.init()
    },
    save(val) {
      if (!val) return
      this.saveArticle()
      this.save = false
    },
    'picture.src': {
      handler(val) {
        if (this.picture.source === 'server') this.pictureSrc = `${this.imagesEndpoint}/${val}`
        if (this.picture.source === 'client' && !this.pictureError) this.pictureSrc = this.picture.src
      },
    },
    'avatar.src': {
      handler(val) {
        if (this.avatar.source === 'server') this.avatarSrc = `${this.avatarsEndpoint}/${val}`
        if (this.avatar.source === 'client' && !this.avatarError) this.avatarSrc = this.avatar.src
      },
    },
    'picture.file': {
      handler(newVal) {
        if (this.picture.error) return
        if (!newVal) this.picture.src = ''
      },
      deep: true,
    },
    'avatar.file': {
      handler(newVal) {
        if (this.avatar.error) return
        if (!newVal) this.avatar.src = ''
      },
      deep: true,
    },

    confirmRemoving(val) {
      if (!val) return
      this.$store.dispatch('blog/REMOVE_ARTICLE', this.id)
        .then(() => {
          this.removePopupVisible = false
          this.close = true
        })
    },
  },

  methods: {
    setPicture(newVal) {
      this.$set(this.blogContent[this.id], 'picture', newVal)
    },
    setAvatar(newVal) {
      this.$set(this.blogContent[this.id], 'author_ava', newVal)
    },

    async init() {
      if (!this.blogContent) await this.$store.dispatch('blog/GET_BLOG_CONTENT')
      this.id = this.$route.params.article
      this.picture.source = 'article'
      this.avatar.source = 'article'
      this.picture.file = null
      this.avatar.file = null
      this.picture.src = this.defaultPicture
      this.avatar.src = this.defaultAvatar
      this.pictureSrc = this.pictureURL(this.id)
      this.avatarSrc = this.avatarURL(this.id)

      if (this.id) {
        if (this.article && this.article.type === 'file') {
          this.textContent.file = this.article.file
          this.textContent.text = await this.$store.dispatch('blog/GET_ARTICLE_CONTENT', this.article.file)
        }
      }
    },

    saveContent() {
      this.$store.dispatch('blog/SAVE_ARTICLE_CONTENT', {
        fileName: this.textContent.file,
        content: this.textContent.text,
      })
        .then(
          () => { this.textContent.changed = false },
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

    async saveArticle() {
      if (this.picture.source === 'client') this.$set(this.article, 'picture', this.picture.file ? await this.savePicture() : '')
      if (this.picture.source === 'server') this.$set(this.article, 'picture', this.picture.src)

      if (this.avatar.source === 'client') this.$set(this.article, 'author_ava', this.avatar.file ? await this.saveAvatar() : '')
      if (this.avatar.source === 'server') this.$set(this.article, 'author_ava', this.avatar.src)

      this.saveContent(this.textContent.text)

      await this.$store.dispatch('blog/SAVE_BLOG_CONTENT')
      this.$router.push({ name: 'blog' })
    },

    async removeArticle() {
      this.confirmRemoving = false
      this.removePopupVisible = true
    },
  },

  mounted() {
    this.init()
  },
}
</script>

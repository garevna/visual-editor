<template>
  <v-container v-if="article" fluid>
    <v-app-bar
        absolute
        extended
        color="primary"
        dark
        shrink-on-scroll
        scroll-off-screen
        :src="article.logo"
        fade-img-on-scroll
        scroll-threshold="500"
        height="300"
      >
      <v-card flat class="d-flex transparent justify-center align-center" height="100%" width="100%">
        <h3 class="header-shadow text-center mx-6" color="white" width="100%">{{article.title}}</h3>
      </v-card>
      <template v-slot:extension>
        <v-tooltip top color="info">
          <template v-slot:activator="{ on }">
            <v-btn
                color="warning"
                dark
                small
                absolute
                bottom
                right
                fab
                v-on="on"
                @click="$refs.picture.click()"
              >
                <v-icon>mdi-camera</v-icon>
            </v-btn>
          </template>
          <span>Change picture via upload</span>
        </v-tooltip>
        <input
          type="file"
          ref="picture"
          style="display: none"
          @change="uploadPicture($event.target.files[0])"
        >
      </template>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques"
      class="overflow-y-auto"
      style="margin-top: 300px"
    >
      <v-container fluid>
        <v-card
          class="mx-auto"
          max-width="1000"
          flat
          tile
          v-if="!close && article"
        >
          <v-card-title class="mx-auto">
            <v-text-field outlined label="Article header" v-model="article.title">
              <v-icon small slot="append" color="info">mdi-pencil</v-icon>
            </v-text-field>
          </v-card-title>
          <v-row class="mx-10">
            <v-col cols="12" sm="6" md="4">
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="date"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    label="Article date"
                    prepend-icon="mdi-date-range"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>

            <!--  AUTHOR -->
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-card-text>
                  <v-text-field outlined label="Article author" v-model="article.author">
                    <v-icon small slot="append" color="info">mdi-pencil</v-icon>
                  </v-text-field>
              </v-card-text>
            </v-col>
            <v-col cols="12" sm="4" md="2" lg="1" class="d-flex align-start">
              <v-card-text>
              <v-tooltip top color="info">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="$refs.avatar.click()">
                    <v-avatar color="info">
                      <v-img v-if="article.logo_user" :src="article.logo_user" onerror="imageError"></v-img>
                    </v-avatar>
                  </v-btn>
                  </template>
                  <span>Change avatar via upload</span>
              </v-tooltip>
              </v-card-text>
            </v-col>
            <input
              type="file"
              ref="avatar"
              style="display: none"
              @change="uploadAvatar($event.target.files[0])"
            >
          </v-row>
        </v-card>
        <v-card flat class="mx-auto" max-width="1000">
          <v-card-text v-if="!article.url">
              <v-icon color="info">mdi-file-document-outline</v-icon>
              <v-card flat min-height="300">
                <VueEditor v-model="article.text" class="editor"/>
              </v-card>
          </v-card-text>
          <v-card-text v-else>
              <v-text-field outlined label="Article url" v-model="article.url">
                <v-icon small slot="append" color="info">mdi-pencil</v-icon>
              </v-text-field>
          </v-card-text>

        </v-card>

        <ArticleBottom
            :save.sync="save"
            :pictureSrc.sync="article.logo"
            :avatarSrc.sync="article.logo_user"
        />

        <ErrorPopup :visibility.sync="errorPopupVisible" :errorName="errorName" :details="errorStack"/>

      </v-container>
    </v-sheet>
  </v-container>
</template>

<style>
  .header-shadow {
    text-shadow: 0px 0px 8px #000;
  }
</style>

<script>
/* eslint-disable no-console */

import { VueEditor } from 'vue2-editor'

import ArticleBottom from '@/components/ArticleBottom.vue'
import ErrorPopup from '@/components/ErrorPopup.vue'

export default {

  components: {
    VueEditor,
    ArticleBottom,
    ErrorPopup,
  },

  data: () => ({
    id: null,
    date: null,
    modal: false,
    article: null,
    pictureLimit: 700000,
    avatarLimit: 50000,
    close: false,
    save: false,
    errorPopupVisible: false,
    removePopupVisible: false,
    confirmRemoving: false,
    uploadDailog: false,
    errorName: '',
    errorStack: '',
  }),

  watch: {
    id() {
      this.init()
    },
    date(val) {
      this.article.published_at = val
    },
    save(val) {
      if (!val) return
      this.saveArticle()
      this.save = false
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

    testFile(file, limit) {
      if (!file.type.startsWith('image')) {
        this.errorName = 'Invalid file type'
        this.errorStack = 'File must be an image of any type such as: jpg, png, gif...'
        this.errorPopupVisible = true
        return false
      }
      if (file.size > limit) {
        this.errorName = 'Invalid file size'
        this.errorStack = `File is too large. Please select file up to ${Math.round(limit / 1000)}Kb`
        this.errorPopupVisible = true
        return false
      }
      return Boolean(file)
    },

    uploadPicture(file) {
      if (!this.testFile(file, this.pictureLimit)) return
      this.article.pictureFile = file
      this.article.logo = URL.createObjectURL(file)
    },
    uploadAvatar(file) {
      if (!this.testFile(file, this.avatarLimit)) return
      this.article.avatarFile = file
      this.article.logo_user = URL.createObjectURL(file)
    },

    async init() {
      this.article = await this.$store.dispatch('blog/GET_ARTICLE_BY_ID', this.id)
      this.date = this.article.published_at
    },

    async saveArticle() {
      console.log('Save article...')
      await this.$store.dispatch('blog/SAVE_ARTICLE_BY_ID', {
        id: this.id,
        article: this.article,
      })
      this.$router.push({ name: 'blog' })
    },

    async removeArticle() {
      this.confirmRemoving = false
      this.removePopupVisible = true
    },
  },

  mounted() {
    this.id = this.$route.params.article
    this.init()
  },
}
</script>

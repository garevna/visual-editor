<template>
  <v-sheet class="overflow-y-auto" style="margin-top: 300px">
    <v-container fluid>
        <v-card
          class="mx-auto"
          max-width="1000"
          flat
          tile
          v-if="!close && article"
        >
          <v-card-title class="mx-auto">
            <v-text-field outlined label="Article title" v-model="article.title">
              <v-icon small slot="append" color="info">mdi-pencil</v-icon>
            </v-text-field>
          </v-card-title>
          <v-card-title class="mx-auto">
            <v-text-field outlined label="Article url" v-model="article.ref">
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

            <!--  Source -->
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-card-text>
                  <v-text-field outlined label="Source" v-model="article.source">
                    <v-icon small slot="append" color="info">mdi-pencil</v-icon>
                  </v-text-field>
              </v-card-text>
            </v-col>
            <v-col cols="12" sm="4" md="2" lg="1" class="d-flex align-start">
              <v-card-text>
              <v-tooltip top color="info">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="$refs.logo.click()">
                    <v-avatar color="#dde">
                      <v-img v-if="article.logo" :src="article.logo" onerror="imageError"></v-img>
                    </v-avatar>
                  </v-btn>
                  </template>
                  <span>Change avatar via upload</span>
              </v-tooltip>
              </v-card-text>
            </v-col>
            <input
              type="file"
              ref="logo"
              style="display: none"
              @change="uploadLogo($event.target.files[0])"
            >
          </v-row>
        </v-card>

        <NewsBottom
            :save.sync="save"
            :pictureSrc.sync="article.logo"
            :avatarSrc.sync="article.logo_user"
        />

        <ErrorPopup :visibility.sync="errorPopupVisible" :errorName="errorName" :details="errorStack"/>

    </v-container>
  </v-sheet>
</template>

<script>

import NewsBottom from '@/components/NewsBottom.vue'
import ErrorPopup from '@/components/ErrorPopup.vue'

export default {

  components: {
    NewsBottom,
    ErrorPopup,
  },

  data: () => ({
    id: null,
    date: null,
    modal: false,
    article: null,
    logoLimit: 70000,
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
      this.$store.dispatch('news/REMOVE_ARTICLE', this.id)
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

    uploadLogo(file) {
      if (!this.testFile(file, this.logoLimit)) return
      this.article.logoFile = file
      this.article.logo = URL.createObjectURL(file)
    },

    async init() {
      this.article = await this.$store.dispatch('news/GET_ARTICLE_BY_ID', this.id)
      this.date = this.article.published_at
    },

    async saveArticle() {
      await this.$store.dispatch('news/SAVE_ARTICLE_BY_ID', {
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

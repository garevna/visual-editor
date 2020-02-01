<template>
  <v-container>
      <v-navigation-drawer
        absolute
        temporary
        width="70%"
        v-model="navigate"
      >
        <v-list v-if="keys">
          <v-subheader>
              <v-icon large color="#09b" @click="createNewArticle">
                mdi-new-box
              </v-icon>
          </v-subheader>
          <v-list-item-group v-model="articleId" color="primary">
            <v-list-item
              v-for="id in keys"
              :key="id"
              :value="id"
            >
              <v-list-item-icon>
                <v-icon color="success">{{ 'mdi-pencil' }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content v-if="blogContent[id]">
                <v-list-item-title v-text="blogContent[id].title">
                </v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <BlogArticle v-if="articleId && article" :id="articleId" :sourceArticle="article" :imageFromServer="image" :avatarFromServer="avatar"/>

      <ImageGallery v-if="imagesEndpoint"
                    :endpoint="imagesEndpoint"
                    :maxWidth="imageMaxWidth"
                    :maxHeight="imageMaxHeight"
                    :dialog.sync="imageDialog"
                    :logo.sync="image"
      />
      <ImageGallery v-if="avatarsEndpoint"
                    :endpoint="avatarsEndpoint"
                    :maxWidth="avatarMaxWidth"
                    :maxHeight="avatarMaxHeight"
                    :dialog.sync="avatarDialog"
                    :logo.sync="avatar"
      />

      <v-bottom-navigation
        v-model="bottomNav"
        app
        fixed
      >
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn @click="navigate=true" v-on="on">
              <v-icon large color="info">mdi-file-search</v-icon>
            </v-btn>
          </template>
          <span>List of blog articles</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
          <v-btn text @click="createNewArticle" v-on="on">
            <v-icon large color="info">
              mdi-new-box
            </v-icon>
          </v-btn>
          </template>
          <span>Add new article</span>
        </v-tooltip>

        <v-tooltip top v-if="articleId">
          <template v-slot:activator="{ on }">
            <v-btn @click="imageDialog=true" v-on="on">
              <v-icon large color="warning">mdi-image-search</v-icon>
            </v-btn>
          </template>
          <span>Article picture</span>
        </v-tooltip>

        <v-tooltip top v-if="articleId">
          <template v-slot:activator="{ on }">
            <v-btn @click="avatarDialog=true" v-on="on">
              <v-icon large color="warning">mdi-account-box</v-icon>
            </v-btn>
          </template>
          <span>Author avatar</span>
        </v-tooltip>
    </v-bottom-navigation>

  </v-container>
</template>

<script>
/* import Popup from '@/components/RemovePopup.vue' */
import ImageGallery from '@/components/ImageGallery.vue'
import BlogArticle from '@/views/BlogArticle.vue'

export default {
  components: {
    BlogArticle,
    ImageGallery,
  },

  data: () => ({
    articleId: null,
    article: null,
    navigate: false,
    bottomNav: 0,
    image: null,
    avatar: null,
    imageDialog: false,
    avatarDialog: false,
    imagesEndpoint: null,
    avatarsEndpoint: null,
    avatarMaxWidth: 70,
    avatarMaxHeight: 70,
    imageMaxWidth: 300,
    imageMaxHeight: 250,
  }),

  computed: {
    blogContent() {
      return this.$store.state.blog.content
    },
    keys() {
      if (!this.blogContent) return null
      return Object.keys(this.blogContent)
    },
  },

  watch: {
    articleId(val) {
      if (!val) return
      this.$store.dispatch('blog/GET_ARTICLE_BY_ID', val)
        .then((response) => { this.article = response })
      this.navigate = false
    },
    image(val) {
      this.imageDialog = !val
    },
    avatar(val) {
      this.avatarDialog = !val
    },
  },

  methods: {

    async createNewArticle() {
      const id = new Date().getTime().toString()
      const fileName = `article${id}.html`

      await this.$store.dispatch('blog/SAVE_ARTICLE_CONTENT', {
        fileName,
        content: '<p>Empty...</p>',
      })
      this.$store.commit('SET_PROPERTY', {
        object: this.$store.state.blog.content,
        propertyName: id,
        value: {
          title: 'New Article...',
          type: 'file',
          file: fileName,
          author: '',
          author_ava: '',
          data: new Date().toLocaleDateString(),
          picture: '',
        },
      })
      this.saveBlogContent()
      this.articleId = id
    },

    saveBlogContent() {
      this.$store.dispatch('blog/SAVE_CONTENT', this.blogContent)
        .then(
          () => {},
          err => this.$store.dispatch('ERROR_HANDLER', err),
        )
    },

  },
  mounted() {
    this.$store.dispatch('blog/GET_CONTENT')
    this.$store.dispatch('blog/GET_CONTENT')
      .then(() => {
        this.imagesEndpoint = this.$store.getters['blog/imagesEndpoint']
        this.avatarsEndpoint = this.$store.getters['blog/avatarsEndpoint']
      })
  },
}
</script>

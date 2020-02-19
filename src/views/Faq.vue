<template>
  <v-container>
      <v-navigation-drawer
        absolute
        temporary
        width="70%"
        v-model="navigate"
      >
        <v-list v-if="faqContent">
          <v-subheader>
            <h3>FAQ</h3>
            <v-spacer/>
            <v-icon large color="#09b" @click="createNewQuestion">
              mdi-new-box
            </v-icon>
          </v-subheader>
          <v-list-item-group v-model="questionIndex" color="primary">
            <v-list-item
              v-for="(item, index) in faqContent"
              :key="index"
            >
              <v-list-item-icon>
                <v-icon color="info">{{ 'mdi-pencil' }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content v-if="item">
                <v-list-item-title v-text="item.question">
                </v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <FaqQuestion v-if="testIndex()" :index="questionIndex"/>

      <v-bottom-navigation v-model="bottomNav" app fixed>
        <v-btn disabled><h3>FAQ</h3></v-btn>
        <v-spacer/>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn @click="navigate=true" v-on="on">
              <v-icon large color="info">mdi-file-search</v-icon>
            </v-btn>
          </template>
          <span>List of FAQ</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
          <v-btn @click="createNewQuestion()" v-on="on">
            <v-icon large color="info">
              mdi-new-box
            </v-icon>
          </v-btn>
          </template>
          <span>Add new question to FAQ</span>
        </v-tooltip>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import FaqQuestion from '@/views/FaqQuestion.vue'

export default {
  components: {
    FaqQuestion,
  },

  data: () => ({
    questionIndex: undefined,
    answer: null,
    navigate: false,
    bottomNav: 0,
    keyword: '',
  }),

  computed: {
    faqContent() {
      const content = this.keyword
        ? this.$store.state.faq.content
          .map((item, index) => (item.keywords.indexOf(this.keyword) ? index : NaN))
        : this.$store.state.faq.content
      return content
    },
  },

  watch: {

    questionIndex() {
      this.navigate = false
    },
  },

  methods: {

    async createNewQuestion() {
      this.$store.dispatch('faq/NEW_QUESTION')
        .then((index) => { this.answerIndex = index })
    },

    saveFaqContent() {
      this.$store.dispatch('faq/SAVE_CONTENT', this.faqContent)
        .then(
          () => {},
          err => this.$store.dispatch('ERROR_HANDLER', err),
        )
    },

    testIndex() {
      return this.questionIndex !== undefined
    },

    showQuestionsByKeyword() {
      //
    },

  },
  mounted() {
    this.$store.dispatch('faq/GET_CONTENT')
      .then(() => {})
  },
}
</script>

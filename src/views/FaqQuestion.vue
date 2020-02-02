<template>
    <v-card flat
      class="mx-auto my-auto"
      width="80%"
      tile
      v-if="!close && item"
    >
      <!-- actions -->

      <v-card-actions>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn text @click="saveQuestion" v-on="on">
              <v-icon large color="info">mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span>Save current FAQ question</span>
        </v-tooltip>

        <v-spacer/>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn text @click="removeQuestion" v-on="on">
              <v-icon large color="error">mdi-delete-circle</v-icon>
            </v-btn>
          </template>
          <span>Delete current FAQ question</span>
        </v-tooltip>

      </v-card-actions>
      <v-divider/>

      <!-- header -->

      <v-card-title>
        <v-text-field label="Question" v-model="item.question">
          <v-icon small slot="append" color="info">mdi-pencil</v-icon>
        </v-text-field>
      </v-card-title>

      <!-- content -->

      <v-card-text>
        <v-icon small color="warning">mdi-file-document-outline</v-icon> <small>{{item.file}}</small>
      </v-card-text>

      <VueEditor v-model="answer.text"/>

      <v-card v-if="item">
        <v-card-title>Keywords:</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" xs="12" sm="6" md="4" lg="3" v-for="(word, ind) in keywords" :key="ind">
              <v-text-field single-line outlined v-model="keywords[ind]"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <RemovePopup :visibility.sync="removePopupVisible"
                   :confirm.sync="confirmRemoving"
                   removing="<b>FAQ question</b>"
                   :details="item.question"
        />

    </v-card>
</template>

<script>

import { VueEditor } from 'vue2-editor'
import RemovePopup from '@/components/RemovePopup.vue'

export default {
  components: {
    VueEditor,
    RemovePopup,
  },

  props: {
    index: {
      type: [Number, String],
      required: true,
    },
  },

  data: () => ({
    answer: {
      file: null,
      text: '',
      changed: false,
    },
    keywords: [],
    close: false,

    removePopupVisible: false,
    confirmRemoving: false,
  }),
  computed: {
    item() {
      if (Number.isNaN(this.index) || !this.$store.state.faq.content) return null
      return this.$store.state.faq.content[this.index]
    },
  },

  watch: {
    index(val) {
      if (val) this.init()
    },

    confirmRemoving(val) {
      if (!val) return
      this.$store.dispatch('faq/REMOVE_QUESTION', this.index)
        .then(() => {
          this.removePopupVisible = false
          this.close = true
        })
    },
  },

  methods: {

    async init() {
      this.answer.file = this.item.file
      this.answer.text = await this.$store
        .dispatch('faq/GET_ANSWER', this.item.file)
      this.answer.changed = false
      this.keywords = JSON.parse(JSON.stringify(this.item.keywords))
    },

    saveAnswer() {
      this.$store.dispatch('faq/SAVE_ANSWER', {
        fileName: this.answer.file,
        content: this.answer.text,
      })
        .then(
          () => { this.answer.changed = false },
          err => this.$store.dispatch('TRACE_ERROR', err),
        )
    },

    async saveQuestion() {
      this.saveAnswer()
      this.$set(this.item, 'keywords', this.keywords)
      this.$store.dispatch('faq/SAVE_CONTENT')
    },

    async removeQuestion() {
      this.confirmRemoving = false
      this.removePopupVisible = true
    },

  },

  mounted() {
    this.init()
  },
}
</script>

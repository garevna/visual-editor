<template>
  <v-container>
    <v-card class="pa-0" width="80%" flat>
      <v-card-actions>
        <v-btn @click="$emit('text-changed', content)" text>
          SAVE
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-divider/>
    <v-card>
      <vue-editor v-model="content">
      </vue-editor>
    </v-card>
  </v-container>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  name: 'file-editor',
  components: {
    VueEditor,
  },

  props: {
    text: String,
  },

  data: () => ({
    container: null,
    content: '',
  }),
  computed: {
    //
  },
  watch: {
    text(val) {
      this.content = val
    },
  },
  methods: {

  },
  mounted() {

  },
  updated() {

  },
}
</script>

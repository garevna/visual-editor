<template>
  <v-row justify="center">
    <v-dialog v-model="visibility" persistent max-width="700">
      <v-card class="pa-8">
        <v-card-title color="info">
          <v-icon color="warning">mdi-alert</v-icon>
          <h3>&nbsp;You attempt to remove file on server</h3>
        </v-card-title>
        <v-card flat class="pa-5">
          <v-card-text color="info" v-if="removing" v-html="removing"></v-card-text>
        </v-card>
        <v-card flat class="pa-5">
          <v-card-text v-if="details" v-html="details"></v-card-text>
        </v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" text @click="$emit('update:visibility', false)">Cancel</v-btn>
          <v-btn color="error" text @click="confirmRemove()">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'RemovePopup',
  props: {
    visibility: Boolean,
    confirm: Boolean,
    removing: {
      type: String,
      default: '',
    },
    details: {
      type: [String, Object],
      default: '',
    },
  },
  methods: {
    confirmRemove() {
      this.$emit('update:confirm', true)
      this.$emit('update:visibility', false)
    },
  },
}
</script>

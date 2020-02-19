<template>
  <v-row justify="center">
    <v-dialog v-model="visibility" persistent max-width="400">
      <v-card class="pa-8">
        <v-card-title class="error--text">
          <v-icon large color="error">mdi-error</v-icon>
          {{errorName}}
        </v-card-title>
        <v-divider></v-divider>
        <v-card flat v-if="details">
          <v-card-text>{{details}}</v-card-text>
        </v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" text @click="$emit('update:visibility', false)">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'ErrorPopup',
  props: {
    visibility: Boolean,
    errorName: {
      type: String,
      default: 'Error',
    },
    details: {
      type: [String, Object],
      default: 'sorry... no comments...',
    },
  },
}
</script>

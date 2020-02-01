<template>
  <v-row justify="center">
    <v-dialog v-model="visibility" persistent max-width="700">
      <v-card class="pa-4">
        <v-card-title text-color="warning">Be careful with removing files from server</v-card-title>
        <v-card-text v-if="removing">{{removing}}</v-card-text>
        <v-card-text v-if="details">{{details}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="$emit('update:visibility', false)">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="$emit('update:confirm', true)">Remove</v-btn>
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
    removing: {
      type: [String, Object],
      default: '',
    },
    details: {
      type: [String, Object],
      default: '',
    },
  },
  data() {
    return {
      //
    }
  },
  watch: {
    //
  },
  methods: {
    //
  },
}
</script>

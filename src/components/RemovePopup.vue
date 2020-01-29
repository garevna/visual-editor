<template>
  <v-row justify="center">
    <v-dialog v-model="removePopupVisible" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Remove</v-card-title>
        <v-card-text v-if="removing">{{removing}}</v-card-text>
        <v-card-text v-if="details">{{details}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text v-model="confirm" @click="$emit('update:confirm', false)">Cancel</v-btn>
          <v-btn color="red darken-1" text v-model="confirm" @click="$emit('update:confirm', true)">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ['dialog', 'removing', 'details'],
  data() {
    return {
      //
    }
  },
  methods: {
    //
  },
}
</script>

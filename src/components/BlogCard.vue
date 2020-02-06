<template>
  <v-col cols="12" md="6" lg="4">
    <v-card>
      <v-img
        :src="picture"
        height="200"
        contain
        class="secondary"
      ></v-img>
      <v-card-title class="title">{{title}}</v-card-title>

      <v-card-actions>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn text @click="edit" v-on="on">
              <v-icon large color="info">mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit article</span>
        </v-tooltip>

        <v-spacer/>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn text @click="remove" v-on="on">
              <v-icon large color="error">mdi-delete-circle</v-icon>
            </v-btn>
          </template>
          <span>Delete article</span>
        </v-tooltip>

      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: ['id', 'selected', 'picture', 'title', 'operation'],
  methods: {
    edit() {
      this.$emit('update:selected', this.id)
      this.$emit('update:operation', 'edit')
    },
    remove() {
      this.$emit('update:selected', this.id)
      this.$emit('update:operation', 'remove')
    },
  },
}
</script>

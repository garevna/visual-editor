<template>
  <v-col cols="12" md="6" lg="4" class="d-flex align-center">
    <v-card hover width="100%">
      <v-img
        :src="picture"
        height="200"
        cover
      ></v-img>
      <v-card-text max-width="80%" class="d-inline-block text-truncate">
          {{title}}
      </v-card-text>

      <v-card-actions>
        <v-tooltip top color="info">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="edit" v-on="on">
              <v-icon color="info">mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit article</span>
        </v-tooltip>

        <v-spacer/>

        <v-tooltip top color="warning">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="remove()" v-on="on">
              <v-icon color="error">mdi-delete-circle</v-icon>
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

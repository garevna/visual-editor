<template>
  <v-text-field
    label="keyword"
    single-line
    outlined
    :value="keyword"
    @input="$emit('update:keyword', keyword)"
  >
  </v-text-field>
</template>

<script>
export default {
  name: 'KeywordInput',
  props: {
    keyword: String,
  },
}
</script>

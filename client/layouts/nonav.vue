<template>
  <v-app id="inspire">
    <nuxt/>
  </v-app>
</template>

<script>
export default {
  middleware: "guest",

  data: () => ({
    drawer: null
  })
}
</script>

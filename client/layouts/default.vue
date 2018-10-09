<template>
  <v-app>
    <sidebar/>
    <v-content>
      <v-container fluid grid-list-lg>
        <nuxt />
      </v-container>
      <Loader/>
    </v-content>
    <v-footer fixed app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import sidebar from "@/components/nav/sidebar"
import Loader from "@/components/Loader"
export default {
  middleware: "auth",
  components: { sidebar, Loader }
}
</script>

import Vue from "vue"
import * as VueGoogleMaps from "~/node_modules/vue2-google-maps"

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBwgq3zYZH257x1vWIlr45UR6NDqHrc3Uk",
    libraries: "places"
  }
})

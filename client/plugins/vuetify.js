import Vue from "vue"
import Vuetify from "vuetify"

import colors from "vuetify/es5/util/colors"

Vue.use(Vuetify, {
  theme: {
    primary: colors.green.darken3, // #E53935
    secondary: colors.blue.lighten4, // #FFCDD2
    accent: colors.indigo.base, // #3F51B5
      icons: colors.yellow.base, // #E53935
      chips: colors.orange.base,
      texts: colors.shades.white,
      headings: colors.shades.white
  }
})
<template>
  <div>
    <v-card>
      <div id="location"
           style="width: 100%; height: 60vh;">
        <gmap-map :center="location"
                  :zoom="12"
                  style="width: 100%; height: 60vh;">
          <gmap-marker :position="location"
                       :clickable="true"
                       :draggable="true"
                       @click="center=location"
                       @place_changed="setPlace"
                       @position_changed="markerDrag($event)"/>
        </gmap-map>
      </div>
      <v-card-actions>
        <Tbtn icon-color="texts" color="primary" icon="chevron_left" tooltip-text="Back to List" @onClick="toHome"/>
        <v-spacer/>
        <v-tooltip top>
          <gmap-autocomplete slot="activator" @place_changed="setPlace"/>
          <span>Type to search for locations</span>
        </v-tooltip>
        <Tbtn icon-color="texts" :flat="true" color="primary" icon="save" tooltip-text="Save Location Map" @onClick="setLocation"/>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import _ from "lodash"
import { global } from "~/mixins"
import { COMPANY_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  mixins: [global],
  data: () => ({
    location: {
      lat: -6.17511,
      lng: 106.865039
    },
    markers: [
      {
        position: {
          lat: -6.17511,
          lng: 106.865039
        }
      }
    ],
    formData: {}
  }),
  mounted() {
    this.setInitLoc()
  },
  methods: {
    toHome() {
      this.$router.push("/companies")
    },
    setPlace(place) {
      this.location.lat = place.geometry.location.lat()
      this.location.lng = place.geometry.location.lng()
    },
    markerDrag: _.debounce(function(position) {
      this.location.lat = position.lat()
      this.location.lng = position.lng()
    }, 500),
    async setLocation() {
      try {
        if (this.currentEdit) {
          for (var key in this.currentEdit) {
            if (this.currentEdit.hasOwnProperty(key)) {
              this.formData[key] = this.currentEdit[key]
            }
          }
          this.formData.lat = this.location.lat
          this.formData.lng = this.location.lng
          const resp = await axios
            .put(COMPANY_URL + "/" + this.currentEdit.id, this.formData)
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          showNoty("Map Saved", "success")
        }
      } catch (e) {
        console.log(e)
        catchError(e)
      }
    },
    setInitLoc() {
      if (this.currentEdit) {
        this.location.lat = this.currentEdit.lat
        this.location.lng = this.currentEdit.lng
      }
    }
  }
}
</script>

<style scoped>
</style>

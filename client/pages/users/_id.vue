<template>
  <div>
    <h2 class="primary--text mb-2">{{ title }} Detail</h2>
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Details
      </v-tab>
      <v-tab href="#roles">
        Roles
      </v-tab>
      <v-tab href="#companies">
        Companies
      </v-tab>
      <v-tab href="#activities">
        Activities
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail/>
      </v-tab-item>
      <v-tab-item :id="'roles'">
        <roles/>
      </v-tab-item>
      <v-tab-item :id="'companies'">
        <company/>
      </v-tab-item>
      <v-tab-item :id="'activities'">
        <activities/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { USER_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import { detail, dform, roles, activities, company } from "~/components/users"
import catchError from "~/utils/catchError"
export default {
  async fetch({ store, params }) {
    try {
      let resp = await axios.get(USER_URL + "/" + params.id)
      if (resp) store.commit("currentEdit", resp.data.data)
      // Combo / Select Data
      await store.dispatch('getRoles')
      await store.dispatch('getCompanies')

    } catch (e) {
      catchError(e)
    }
  },
  components: { detail, dform, roles, activities, company },
  data() {
    return {
      title: "User"
    }
  }
}
</script>

<style scoped>
</style>

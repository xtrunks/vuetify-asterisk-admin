<template>
    <div>
        <h2 class="primary--text mb-2">Company Detail</h2>
        <v-tabs align-with-title color="primary" class="white elevation-1" :dark="!dark">
            <v-tabs-slider color="white"/>
            <v-tab href="#detail">
                Details
            </v-tab>
            <v-tab href="#maps">
                Maps
            </v-tab>
            <v-tab href="#users">
                Users
            </v-tab>
            <v-tab-item :id="'detail'">
                <detail/>
            </v-tab-item>
            <v-tab-item :id="'maps'">
                <maps/>
            </v-tab-item>
            <v-tab-item :id="'users'">
                <users/>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
    import { COMPANY_URL } from "~/utils/apis"
    import axios from "axios"
    import { detail, dform, maps, users } from "~/components/company"
    import catchError from "~/utils/catchError"

    export default {
        async fetch({ store, params }) {
            try {
                let resp = await axios.get(COMPANY_URL + "/" + params.id)
                if (resp) store.commit("currentEdit", resp.data.data)
            } catch (e) {
                catchError(e)
            }
        },
        components: {users, detail, dform, maps },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        }
    }
</script>

<style scoped>
</style>

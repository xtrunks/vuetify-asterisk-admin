<template>
    <div>
        <h2 v-if="currentEdit" class="primary--text mb-2">Permission {{ currentEdit.name }}</h2>
        <v-tabs align-with-title color="primary" class="white elevation-1" :dark="!dark">
            <v-tabs-slider color="white"/>
            <v-tab href="#detail">
                Details
            </v-tab>
            <v-tab-item :id="'detail'">
                <detail/>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
    import { PERMISSION_URL } from "~/utils/apis"
    import axios from "axios"
    import { detail, dform } from "~/components/permissions"
    import { global } from "~/mixins"
    import catchError from "~/utils/catchError"

    export default {
        async fetch({ store, params }) {
            try {
                let resp = await axios.get(PERMISSION_URL + "/" + params.id)
                if (resp) store.commit("currentEdit", resp.data.data)
            } catch (e) {
                catchError(e)
            }
        },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        components: { detail, dform },
        mixins: [global]
    }
</script>

<style scoped>
</style>

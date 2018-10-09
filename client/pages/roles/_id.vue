<template>
    <div>
        <h2 v-if="currentEdit" class="primary--text mb-2">Role {{ currentEdit.name }}</h2>
        <v-tabs align-with-title color="primary" class="white elevation-1" :dark="!dark">
            <v-tabs-slider color="white"/>
            <v-tab href="#detail">
                Details
            </v-tab>
            <v-tab href="#permissions">
                Permissions
            </v-tab>
            <v-tab-item :id="'detail'">
                <detail/>
            </v-tab-item>
            <v-tab-item :id="'permissions'">
                <permission/>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
    import { ROLE_URL, COMBO_DATA_URL } from "~/utils/apis"
    import axios from "axios"
    import { detail, dform, permission } from "~/components/roles"
    import { global } from "~/mixins"
    import catchError from "~/utils/catchError"

    const API_URL = process.env.API_URL

    export default {
        async fetch({ store, params }) {
            try {
                let resp = await axios.get(ROLE_URL + "/" + params.id)
                if (resp) store.commit("currentEdit", resp.data.data)

                let permissions = await axios.get(COMBO_DATA_URL + "Permission")
                if (permissions) store.commit("comboData", permissions.data)

                let rolePermissions = await axios.get(
                    API_URL + "/role/" + params.id + "/permissions"
                )
                if (rolePermissions)
                    store.commit("permissions", rolePermissions.data.data)
            } catch (e) {
                catchError(e)
            }
        },
        components: { detail, dform, permission },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        mixins: [global]
    }
</script>

<style scoped>
</style>

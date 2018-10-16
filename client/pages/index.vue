<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4>
                <v-card v-if="dashboardData" light class="elevation-8 mb-2" max-height="200px">
                    <v-layout>
                        <v-flex xs4 class="flex-all-centered">
                            <v-icon color="primary" style="font-size: 4rem;">supervised_user_circle</v-icon>
                        </v-flex>
                        <v-flex xs8>
                            <v-card-title primary-title>
                                <div>
                                    <div>Active Users</div>
                                    <div class="headline primary--text"> {{ dashboardData.total_active_users }}</div>
                                </div>
                            </v-card-title>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-card v-if="dashboardData" light class="elevation-8 mb-2" max-height="200px">
                    <v-layout>
                        <v-flex xs4 class="flex-all-centered">
                            <v-icon color="primary" style="font-size: 4rem;">account_balance</v-icon>
                        </v-flex>
                        <v-flex xs8>
                            <v-card-title primary-title>
                                <div>
                                    <div>Registered Companies</div>
                                    <div class="headline primary--text"> {{ dashboardData.total_companies }}</div>
                                </div>
                            </v-card-title>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
    import { DASHBOARD_DATA_URL } from "~/utils/apis"
    import axios from "axios"
    import catchError from "~/utils/catchError"
    import { global } from "~/mixins"

    export default {
        mixins: [global],
        mounted() {
            this.seedData()
        },
        methods: {
            async seedData() {
                try {
                    this.activateLoader()
                    let resp = await axios.get(DASHBOARD_DATA_URL)
                    if (resp) this.$store.commit("dashboardData", resp.data)
                    this.deactivateLoader()
                } catch (e) {
                    this.deactivateLoader()
                    catchError(e)
                }
            }
        }
    }
</script>
<style scoped>
    .flex-all-centered {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

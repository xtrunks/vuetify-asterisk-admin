<template>
    <div>
        <h2 class="primary--text mb-2">Profile Detail</h2>
        <v-tabs align-with-title color="primary" class="white elevation-1" :dark="!dark">
            <v-tabs-slider color="white"/>
            <v-tab href="#detail">
                Info
            </v-tab>
            <v-tab href="#avatar">
                Profile Picture
            </v-tab>
            <v-tab href="#activities">
                Activities
            </v-tab>
            <v-tab-item :id="'detail'">
                <detail/>
            </v-tab-item>
            <v-tab-item :id="'avatar'">
                <avatar/>
            </v-tab-item>
            <v-tab-item :id="'activities'">
                <activities/>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
    import { detail, avatar, activities } from "~/components/profile"

    export default {
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        components: { detail, avatar, activities }
    }
</script>

<style scoped>
</style>

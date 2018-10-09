<template>
    <div>
        <v-dialog v-model="dialog" max-width="500px" persistent>
            <v-card color="primary" :dark="dark">
                <v-card-title>
                    <span class="headline">{{ text }}</span>
                </v-card-title>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="white primary--text" light @click="onClose" >No</v-btn>
                    <v-btn color="white primary--text" light @click="onConfirmed" >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            showDialog: {
                type: Boolean,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                dialog: false
            }
        },
        watch: {
            showDialog() {
                if (this.showDialog || !this.showDialog) {
                    this.dialog = this.showDialog
                }
            }
        },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        methods: {
            onClose() {
                this.$emit("onClose")
            },
            onConfirmed() {
                this.$emit("onConfirmed")
            }
        }
    }
</script>

<style scoped>
</style>

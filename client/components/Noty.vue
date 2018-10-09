<template>
    <div>
        <v-snackbar
                v-model="show"
                :color="color"
                :timeout="timeout"
                top
        >
            {{ text }}
            <v-btn flat color="white" @click.native="onClose"><v-icon>close</v-icon></v-btn>
        </v-snackbar></div>
</template>

<script>
    export default {
        props: {
            snackbar: {
                type: Boolean,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                timeout: 5000,
                show: this.snackbar
            }
        },
        watch: {
            snackbar() {
                if (this.snackbar || !this.snackbar) {
                    this.show = this.snackbar
                }
            }
        },
        methods: {
            onClose() {
                this.$emit("onClose")
            }
        }
    }
</script>

<style scoped>
</style>

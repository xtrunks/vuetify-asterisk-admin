<template>
    <div>
        <v-tooltip top>
            <v-btn slot="activator"
                   :color="color" :flat="flat" :block="block" :outline="outline" :icon="iconMode" :text="text"
                   :tooltip-text="tooltipText" @click="onClick"
            >
                <v-icon v-if="icon != ''" :color="iconColor">{{ icon }}</v-icon>
                <span v-if="text">{{ text }}</span>
            </v-btn>
            <span v-if="tooltipText" >{{ tooltipText }}</span>
        </v-tooltip>
    </div>
</template>

<script>
    export default {
        props: {
            color: {
                type: String,
                required: true
            },
            icon: {
                type: String,
                required: false,
                default: ""
            },
            tooltipText: {
                type: String,
                required: false,
                default: ""
            },
            text: {
                type: String,
                required: false,
                default: ""
            },
            flat: {
                type: Boolean,
                required: false,
                default: false
            },
            block: {
                type: Boolean,
                required: false,
                default: false
            },
            outline: {
                type: Boolean,
                required: false,
                default: false
            },
            iconMode: {
                type: Boolean,
                required: false,
                default: false
            },
            iconColor: {
                type: String,
                required: false,
                default: "icons"
            }
        },
        methods: {
            onClick() {
                this.$emit("onClick")
            }
        }
    }
</script>

<style scoped>
</style>

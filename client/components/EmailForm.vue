<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-toolbar :dark="dark" color="primary">
                    <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container grid-list-md>
                        <p class="primary--text">Please put your email address to reset your password</p>
                        <form>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <label>Your Email Address</label>
                                    <v-text-field
                                            v-validate="'required|email'"
                                            v-model="email"
                                            :error-messages="errors.collect('email')"
                                            name="email"
                                            data-vv-name="email"
                                    />
                                </v-flex>
                                <v-flex xs12>
                                    <label>Your Phone Number</label>
                                    <v-text-field
                                            v-validate="'required'"
                                            v-model="phone"
                                            :error-messages="errors.collect('phone')"
                                            name="phone"
                                            data-vv-name="phone"
                                    />
                                </v-flex>
                            </v-layout>
                        </form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" flat @click.native="onClose">Close</v-btn>
                    <v-btn color="primary" flat @click.native="submit">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>
    import { global } from "~/mixins"
    import { RESET_PASSWORD_URL } from "~/utils/apis"
    import axios from "axios"
    import catchError, { showNoty } from "~/utils/catchError"
    export default {
        $_veeValidate: {
            validator: "new"
        },
        mixins: [global],
        props: {
            show: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                dialog: false,
                formTitle: "Reset Password",
                email: "",
                phone: ""
            }
        },
        watch: {
            show() {
                this.dialog = this.show
            }
        },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        methods: {
            onClose() {
                this.dialog = false
                this.email = ""
                this.phone = ""
                this.$emit("onClose")
            },
            submit() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.sendResetPassword()
                        return
                    }
                })
            },
            async sendResetPassword() {
                try {
                    const resp = await axios
                        .post(RESET_PASSWORD_URL, { email: this.email, phone: this.phone })
                        .then(res => res.data)
                    if (resp.meta.status === 200) {
                        showNoty("Your new has been sent to you", "success")
                        this.onClose()
                    }
                } catch (e) {
                    this.onClose()
                    catchError(e)
                }
            }
        }
    }
</script>

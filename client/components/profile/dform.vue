<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card :dark="dark">
                <v-card-title>
                    <span class="headline primary--text">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <form>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <label>Old Password</label>
                                    <v-text-field
                                            v-validate="'required'"
                                            v-model="old_password"
                                            :error-messages="errors.collect('old_password')"
                                            data-vv-name="old_password"
                                            name="old_password"
                                            type="password"
                                    />
                                    <label>Password</label>
                                    <v-text-field
                                            v-validate="'required|min:6'"
                                            ref="password"
                                            v-model="password"
                                            :error-messages="errors.collect('password')"
                                            data-vv-name="password"
                                            name="password"
                                            type="password"
                                    />
                                    <label>Password Confirmation</label>
                                    <v-text-field
                                            v-validate="'required|confirmed:password'"
                                            v-model="password_confirmation"
                                            :error-messages="errors.collect('password_confirmation')"
                                            data-vv-name="password"
                                            name="password_confirmation"
                                            type="password"
                                    />
                                </v-flex>
                            </v-layout>
                        </form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" flat @click.native="onClose">Close</v-btn>
                    <v-btn color="primary" flat @click.native="submit">Submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>
    import { global } from "~/mixins"
    import { PROFILE_URL } from "~/utils/apis"
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
                formTitle: "Change Password",
                old_password: "",
                password: "",
                password_confirmation: ""
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
                this.$emit("onClose")
            },
            submit() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.saveData()
                        return
                    }
                })
            },
            async saveData() {
                try {
                    this.activateLoader()
                    if (this.user) {
                        const resp = await axios
                            .put(
                                `${PROFILE_URL}/${this.user.id}/change-password`,
                                this.getData()
                            )
                            .then(res => res.data)
                        if (resp.meta.status === 200) {
                            showNoty("Password changed", "success")
                            this.$emit("passwordChanged")
                            this.clearForm()
                        }
                    }
                    this.deactivateLoader()
                } catch (e) {
                    this.clearForm()
                    this.deactivateLoader()
                    catchError(e)
                }
            },
            getData() {
                return {
                    old_password: this.old_password,
                    password: this.password,
                    password_confirmation: this.password_confirmation
                }
            },
            clearForm() {
                this.old_password = ""
                this.password = ""
                this.password_confirmation = ""
                this.dialog = false
                this.onClose()
            }
        }
    }
</script>

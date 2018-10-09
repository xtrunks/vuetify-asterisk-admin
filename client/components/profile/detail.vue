<template>
    <div>
        <v-card :dark="dark" class="pt-3">
            <v-container grid-list-md fluid style="padding-top: 0px;">
                <v-toolbar color="transparent" card>
                    <v-spacer/>
                    <Tbtn icon-color="texts" color="primary" icon="vpn_key" icon-mode tooltip-text="Change password" @onClick="showForm = true"/>
                    <Tbtn icon-color="texts" color="primary" icon="save" icon-mode tooltip-text="Save" @onClick="submit"/>
                    <Tbtn icon-color="texts" color="primary" icon="refresh" icon-mode tooltip-text="Refresh" @onClick="setFields"/>
                </v-toolbar>
                <form>
                    <v-layout row wrap class="mt-3 px-2">

                        <v-flex v-for="(f, index) in fillable" v-if="!inArray(['is_active', 'password'], f.key)" :key="index" sm6 xs12>
                            <label>{{ setCase(f.key) }}</label>
                            <v-text-field
                                    v-validate="f.rules"
                                    v-model="formData[f.key]"
                                    :error-messages="errors.collect(f.key)"
                                    :name="f.key"
                                    :data-vv-name="f.key"
                            />
                        </v-flex>
                    </v-layout>
                </form>
            </v-container>
        </v-card>
        <dform :show="showForm" @onClose="showForm = false"/>

    </div>
</template>

<script>
    import { global } from "~/mixins"
    import { PROFILE_URL } from "~/utils/apis"
    import axios from "axios"
    import catchError, { showNoty } from "~/utils/catchError"
    import Cookie from "js-cookie"
    import dform from "./dform"

    export default {
        $_veeValidate: {
            validator: "new"
        },
        components: { dform },

        mixins: [global],
        data() {
            return {
                fillable: [
                    { key: "name", value: "", rules: "required|max:50" },
                    { key: "email", value: "", rules: "required|email" },
                    { key: "phone", value: "", rules: "required|max:30" },
                    { key: "password", value: "", rules: "required|min:6" },
                    { key: "is_active", value: "", rules: "required" },
                    { key: "address", value: "", rules: "required|max:250" },
                    { key: "description", value: "", rules: "max:250" }
                ],

                formData: {},
                showForm: false
            }
        },
        created() {
            this.setFields()
        },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        methods: {
            setFields() {
                this.errors.clear()
                if (this.user) {
                    this.fillable.forEach(
                        data => (this.formData[data.key] = this.user[data.key])
                    )
                }
            },
            submit() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.editData()
                        return
                    }
                })
            },
            async editData() {
                try {
                    this.activateLoader()
                    if (this.user) {
                        this.formData.role_id = 3
                        const resp = await axios
                            .put(PROFILE_URL + "/" + this.user.id, this.formData)
                            .then(res => res.data)
                        let cookieData = await Cookie.get("lj_token")
                        cookieData = JSON.parse(cookieData)
                        cookieData.user = resp.data
                        await Cookie.set("lj_token", JSON.stringify(cookieData))
                        this.$store.commit("user", resp.data)
                        this.setFields()
                        showNoty("Profile Updated", "success")
                        this.deactivateLoader()
                    }
                } catch (e) {
                    this.deactivateLoader()
                    catchError(e)
                }
            }
        }
    }
</script>

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
                                <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                                    <div v-if="!inArray(notIncluded, f.key)">
                                        <label>{{ setCase(f.key) }}</label>
                                        <v-text-field
                                                v-validate="f.rules"
                                                v-model="formData[f.key]"
                                                :error-messages="errors.collect(f.key)"
                                                :name="f.key"
                                                :data-vv-name="f.key"
                                        />
                                    </div>
                                    <div v-if="f.key == 'roles' && comboData">
                                        <label>Roles</label>
                                        <v-autocomplete
                                                v-validate="'required|numeric'"
                                                :items="comboData"
                                                :error-messages="errors.collect('roles')"
                                                :data-vv-name="'roles'"
                                                v-model="formData['roles']"
                                                label="Select Roles"
                                                single-line
                                                item-text="name"
                                                item-value="id"
                                                cache-items
                                                multiple
                                        />
                                    </div>
                                    <div v-if="f.key == 'is_active'">
                                        <v-switch
                                                v-model="formData['is_active']"
                                                label="Active"
                                                color="primary"
                                        />
                                    </div>
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
    import { USER_URL, COMBO_DATA_URL } from "~/utils/apis"
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
                fillable: [
                    { key: "name", value: "", rules: "required|max:50" },
                    { key: "email", value: "", rules: "required|email" },
                    { key: "phone", value: "", rules: "required|max:30" },
                    { key: "password", value: "", rules: "required|min:6" },
                    { key: "roles", value: [], rules: "required|array" },
                    { key: "is_active", value: true, rules: "required|boolean" },
                    { key: "address", value: "", rules: "required|max:250" },
                    { key: "description", value: "", rules: "max:250" }
                ],
                notIncluded: ["roles", "is_active"],
                formData: {},
                formTitle: "Register New User"
            }
        },
        watch: {
            show() {
                this.dialog = this.show
            }
        },
        created() {
            this.setAuth()
            this.getRoles()
            this.setFields()
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
            async getRoles() {
                try {
                    let roles = await axios.get(COMBO_DATA_URL + "Role")
                    if (roles) this.$store.commit("comboData", roles.data)
                } catch (e) {
                    catchError(e)
                }
            },
            setFields() {
                this.errors.clear()
                if (this.currentEdit) {
                    this.fillable.forEach(data => (this.formData[data.key] = data.value))
                }
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
                    const resp = await axios
                        .post(USER_URL, this.formData)
                        .then(res => res.data)

                    if (resp.meta.status === 201) {
                        showNoty("Data Saved", "success")
                        this.$emit("onAdd", resp.data)
                        this.setFields()
                    }
                    this.deactivateLoader()
                } catch (e) {
                    this.dialog = false
                    this.deactivateLoader()
                    catchError(e)
                }
            }
        }
    }
</script>

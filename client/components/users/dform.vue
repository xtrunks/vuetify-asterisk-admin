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
                                    <div v-if="f.type == 'text'">
                                        <label>{{ setCase(f.key) }}</label>
                                        <v-text-field
                                                v-validate="f.rules"
                                                v-model="formData[f.key]"
                                                :error-messages="errors.collect(f.key)"
                                                :name="f.key"
                                                :data-vv-name="f.key"
                                        />
                                    </div>
                                    <div v-if="f.type == 'phone'">
                                        <label>{{ setCase(f.key) }}</label>
                                        <v-text-field
                                                v-validate="f.rules"
                                                v-model="formData[f.key]"
                                                :error-messages="errors.collect(f.key)"
                                                :name="f.key"
                                                :data-vv-name="f.key"
                                                mask="(####)-#######"
                                                max="11"
                                        />
                                    </div>
                                    <div v-if="f.type == 'password'">
                                        <label>{{ setCase(f.key) }}</label>
                                        <v-text-field
                                                v-validate="f.rules"
                                                v-model="formData[f.key]"
                                                :error-messages="errors.collect(f.key)"
                                                :name="f.key"
                                                :data-vv-name="f.key"
                                                :type="showPassword ? 'text' : 'password'"
                                                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                                                @click:append="showPassword = !showPassword"
                                        />
                                    </div>
                                    <div v-if="f.key == 'roles' && comboDataRoles">
                                        <label>Roles</label>
                                        <v-autocomplete
                                                v-validate="'required|numeric'"
                                                :items="comboDataRoles"
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
                                    <div v-if="f.key == 'companies' && comboDataCompanies">
                                        <label>Companies</label>
                                        <v-autocomplete
                                                v-validate="'numeric'"
                                                :items="comboDataCompanies"
                                                :error-messages="errors.collect('companies')"
                                                :data-vv-name="'companies'"
                                                v-model="formData['companies']"
                                                label="Select Companies"
                                                single-line
                                                item-text="name"
                                                item-value="id"
                                                cache-items
                                                multiple
                                        />
                                    </div>
                                    <div v-if="f.type == 'textarea'">
                                        <label>{{ setCase(f.key) }}</label>
                                        <v-textarea
                                                v-validate="f.rules"
                                                v-model="formData[f.key]"
                                                :error-messages="errors.collect(f.key)"
                                                :name="f.key"
                                                :data-vv-name="f.key"
                                        ></v-textarea>
                                    </div>
                                    <div v-if="f.type == 'switch'">
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
    import { mapActions } from "vuex"

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
                showPassword:false,
                fillable: [
                    { key: "name", type:'text', value: "", rules: "required|max:50", },
                    { key: "email", type:'text', value: "", rules: "required|email" },
                    { key: "phone", type:'phone', value: "", rules: "required|max:11|numeric" },
                    { key: "password", type:'password', value: "", rules: "required|min:6" },
                    { key: "roles", type:'select', value: [], rules: "required|array" },
                    { key: "companies", type:'select', value: [], rules: "array" },
                    { key: "is_active", type:'switch', value: true, rules: "required|boolean" },
                    { key: "address", type:'textarea', value: "", rules: "required|max:250" },
                    { key: "description", type:'textarea', value: "", rules: "max:250" }
                ],
                notIncluded: ["roles", "companies", "is_active"],
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
            this.getCompanies()
            this.setFields()
        },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        methods: {
          ...mapActions(['getRoles','getCompanies']),
            onClose() {
                this.$emit("onClose")
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

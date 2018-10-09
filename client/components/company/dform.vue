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
                                <v-flex v-for="(f, index) in fillable" v-if="!inArray(notIncluded, f.key)" :key="index" sm6 xs12>
                                    <label>{{ setCase(f.key) }}</label>
                                    <v-text-field
                                            v-validate="f.rules"
                                            v-model="formData[f.key]"
                                            :error-messages="errors.collect(f.key)"
                                            :name="f.key"
                                            :data-vv-name="f.key"
                                    />
                                </v-flex>
                                <v-flex v-for="(f, index) in fillable" v-if="inArray(notIncluded, f.key)" :key="index" sm6 xs12>
                                    <label>{{ setCase(f.key) }}</label>
                                    <v-textarea
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
    import { COMPANY_URL } from "~/utils/apis"
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
                    { key: "phone", value: "", rules: "required|max:30" },
                    { key: "email", value: "", rules: "required|email" },
                    { key: "contact_person", value: "", rules: "required|max:50" },
                    { key: "province", value: "", rules: "required|max:50" },
                    { key: "city", value: "", rules: "required|max:50" },
                    { key: "address", value: "", rules: "required|max:250" },
                    { key: "description", value: "", rules: "max:250" }
                ],
                notIncluded: ["description", "address"],
                formData: {},
                formTitle: "Register new company"
            }
        },
        watch: {
            show() {
                this.dialog = this.show
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
                        .post(COMPANY_URL, this.formData)
                        .then(res => res.data)
                    if (resp.meta.status === 201) {
                        showNoty("Data Saved", "success")
                        this.$emit("onAdd", resp.data)
                        this.setFields()
                    }
                    this.deactivateLoader()
                } catch (e) {
                    this.deactivateLoader()
                    catchError(e)
                }
            }
        }
    }
</script>

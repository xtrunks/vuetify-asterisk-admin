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
                                    <label>Name</label>
                                    <v-text-field
                                            v-validate="'required|max:50'"
                                            v-model="name"
                                            :error-messages="errors.collect('name')"
                                            name="name"
                                            data-vv-name="name"
                                    />
                                </v-flex>
                                <v-flex sm12>
                                    <label>Description</label>
                                    <v-textarea
                                            v-validate="'max:250'"
                                            v-model="description"
                                            :error-messages="errors.collect('description')"
                                            name="description"
                                            data-vv-name="description"
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
    import { PERMISSION_URL } from "~/utils/apis"
    import axios from "axios"
    import catchError, { showNoty } from "~/utils/catchError"
    import debounce from "lodash/debounce"
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
                    // { key: "slug", value: "", rules: "required|max:100" },
                    { key: "description", value: "", rules: "max:250" }
                ],
                formData: {},
                formTitle: "Register New Permission",
                name: "",
                slug: "",
                description: ""
            }
        },
        watch: {
            show() {
                this.dialog = this.show
            },
            name() {
                this.createSlug(this.name)
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
                    let formData = {
                        name: this.name,
                        description: this.description
                    }
                    const resp = await axios
                        .post(PERMISSION_URL, formData)
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
            },
            createSlug: debounce(function(name) {
                this.slug = this.setSnakeCase(name)
            }, 500)
        }
    }
</script>

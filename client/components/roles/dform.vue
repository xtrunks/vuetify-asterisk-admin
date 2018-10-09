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
                                <v-flex xs12>
                                    <label>Slug</label>
                                    <v-text-field
                                            v-validate="'required|max:80'"
                                            v-model="slug"
                                            :error-messages="errors.collect('slug')"
                                            name="slug"
                                            data-vv-name="slug"
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
    import { ROLE_URL } from "~/utils/apis"
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
                    { key: "slug", value: "", rules: "required|max:100" },
                    { key: "description", value: "", rules: "max:250" }
                ],
                formData: {},
                formTitle: "Register New Role",
                name: "",
                slug: "",
                description: "",
                slugProcess: false
            }
        },
        watch: {
            show() {
                this.dialog = this.show
            },
            name() {
                this.slugProcess = true
                this.createSlug(this.name)
            }
        },
        created() {
            // this.setFields()
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
                    let data = {
                        name: this.name,
                        slug: this.slug,
                        description: this.description
                    }
                    const resp = await axios.post(ROLE_URL, data).then(res => res.data)
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
                this.slugProcess = false
            }, 500)
        }
    }
</script>

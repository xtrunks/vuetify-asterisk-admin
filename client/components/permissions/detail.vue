<template>
    <div>
        <v-card :dark="dark">
            <v-container grid-list-md fluid style="padding-top: 0px;">
                <v-toolbar color="transparent" card>
                    <v-spacer/>
                    <Tbtn icon-color="texts" color="primary" icon="chevron_left" icon-mode tooltip-text="Back to List" @onClick="toHome"/>
                    <Tbtn icon-color="texts" color="primary" icon="save" icon-mode tooltip-text="Save" @onClick="submit"/>
                    <Tbtn icon-color="texts" color="primary" icon="refresh" icon-mode tooltip-text="Refresh" @onClick="setFields"/>
                    <Tbtn icon-color="texts" color="primary" icon="delete" icon-mode tooltip-text="Delete" @onClick="confirmDelete"/>
                </v-toolbar>
                <form>
                    <v-layout row wrap class="mt-3 px-2">
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
                        </v-flex>
                    </v-layout>
                </form>
            </v-container>
        </v-card>
        <Dialog :showDialog="showDialog" text="Are you sure want to delete ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
    </div>
</template>

<script>
    import { global } from "~/mixins"
    import { PERMISSION_URL } from "~/utils/apis"
    import axios from "axios"
    import Dialog from "~/components/Dialog"
    import catchError, { showNoty } from "~/utils/catchError"

    export default {
        $_veeValidate: {
            validator: "new"
        },
        components: { Dialog },
        mixins: [global],
        data() {
            return {
                fillable: [
                    { key: "name", type:'text', value: "", rules: "required|max:50" },
                    // { key: "slug", value: "", rules: "required|max:100" },
                    { key: "description", type:'textarea', value: "", rules: "max:250" }
                ],
                formData: {},
                showNoty: false,
                showDialog: false,
                notyText: "",
                notyColor: "success",
                toggle_multiple: [0, 1, 2, 3]
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
            toHome() {
                this.$router.push("/permissions")
            },
            setFields() {
                this.errors.clear()
                if (this.currentEdit) {
                    this.fillable.forEach(
                        data => (this.formData[data.key] = this.currentEdit[data.key])
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
                    if (this.currentEdit) {
                        const resp = await axios
                            .put(PERMISSION_URL + "/" + this.currentEdit.id, this.formData)
                            .then(res => res.data)
                        this.$store.commit("currentEdit", resp.data)
                        this.setFields()
                        showNoty("Data Updated", "success")
                        this.deactivateLoader()
                    }
                } catch (e) {
                    this.deactivateLoader()

                    catchError(e)
                }
            },
            confirmDelete() {
                this.showDialog = false
                this.showDialog = true
            },
            async removeData() {
                try {
                    if (this.currentEdit) {
                        const resp = await axios
                            .delete(PERMISSION_URL + "/" + this.currentEdit.id)
                            .then(res => res.data)
                        if (resp.meta.status === 200) {
                            showNoty("Data Deleted", "success")
                            this.$router.push("/permissions")
                        }
                    }
                } catch (e) {
                    console.log(e)
                    catchError(e)
                }
            }
        }
    }
</script>

<style scoped>
    .btn-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
</style>

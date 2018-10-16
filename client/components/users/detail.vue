<template>
    <div>
        <v-card :dark="dark">
            <v-container grid-list-md fluid style="padding-top: 5px;">
                <v-toolbar color="transparent" card>
                    <v-spacer/>
                    <Tbtn icon-color="texts" color="primary" icon="chevron_left" icon-mode tooltip-text="Back to List" @onClick="toHome"/>
                    <Tbtn icon-color="texts" color="primary" icon="save" icon-mode tooltip-text="Save" @onClick="submit"/>
                    <Tbtn icon-color="texts" color="primary" icon="refresh" icon-mode tooltip-text="Refresh" @onClick="setFields"/>
                    <Tbtn icon-color="texts" color="primary" icon="delete" icon-mode tooltip-text="Delete" @onClick="confirmDelete"/>
                </v-toolbar>
                <form>
                    <v-layout row wrap>
                        <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
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
        </v-card>
        <Dialog :showDialog="showDialog" text="Are you sure want to delete ?" @onClose="showDialog = false" @onConfirmed="removeData"/>
    </div>
</template>

<script>
    import { global } from "~/mixins"
    import { USER_URL } from "~/utils/apis"
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
                    { key: "email", type:'text', value: "", rules: "required|email" },
                    { key: "phone", type:'phone', value: "", rules: "required|max:11|numeric" },
                    { key: "is_active", type:'switch', value: "", rules: "required" },
                    { key: "address", type:'textarea', value: "", rules: "required|max:250" },
                    { key: "description", type:'textarea', value: "", rules: "max:250" }
                ],

                formData: {},
                showDialog: false,
                switch1: false
            }
        },
        watch: {
            switch1() {
                if (this.switch1 || !this.switch1) {
                    this.formData.is_active = this.switch1
                }
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
                this.$router.push("/users")
            },
            setFields() {
                this.errors.clear()
                if (this.currentEdit) {
                    this.fillable.forEach(
                        data => (this.formData[data.key] = this.currentEdit[data.key])
                    )
                    this.switch1 = this.formData.is_active
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
                        this.formData.roles = this.$store.getters.getRoles("")
                        const resp = await axios
                            .put(USER_URL + "/" + this.currentEdit.id, this.formData)
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
                this.showDialog = true
            },
            async removeData() {
                try {
                    this.activateLoader()

                    if (this.currentEdit) {
                        const resp = await axios
                            .delete(USER_URL + "/" + this.currentEdit.id)
                            .then(res => res.data)
                        if (resp.meta.status === 200) {
                            showNoty("Data Deleted", "success")
                            this.$router.push("/supervisors")
                        }
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

<style scoped>
    .btn-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
</style>

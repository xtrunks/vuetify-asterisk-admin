<template>
    <div>
        <v-card :dark="dark" class="pt-3">
            <v-toolbar color="transparent" card>
                <v-spacer/>
                <Tbtn icon-color="texts" color="primary" icon="chevron_left" icon-mode tooltip-text="Back to List" @onClick="toHome"/>
            </v-toolbar>
            <v-data-table
                    :headers="headers"
                    :items="items"
                    :loading="loading"
                    :pagination.sync="pagination"
                    :total-items="totalItems"
                    :rows-per-page-items="rowsPerPage"
                    class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.phone }}</td>
                    <td class="text-md-center">
                        <Tbtn color="texts" icon="remove_red_eye" icon-mode :tooltip-text="'Manage ' + title" @onClick="toDetail(props.item)"/>
                    </td>
                </template>
            </v-data-table>
        </v-card>

    </div>
</template>
<script>
    import debounce from "lodash/debounce"
    import { USER_URL } from "~/utils/apis"
    import { global } from "~/mixins"
    import axios from "axios"
    import catchError from "~/utils/catchError"

    export default {
        //middleware: "auth",
        mixins: [global],
        data: () => ({
            title: "User",
            headers: [
                { text: "Name", align: "left", value: "name" },
                { text: "Email", align: "left", value: "email" },
                { text: "Phone", align: "left", value: "phone" },
                { text: "Actions", align: "center", value: "name", sortable: false }
            ],
            items: [],
            confirmMessage: "Are you sure want to delete this ?",
            showConfirm: false,
            dataToExport: [],
            fillable: [
                "id",
                "uid",
                "name",
                "email",
                "phone",
                "description",
                "address",
                "is_active"
            ],
            typeDates: ["created_at"]
        }),

        watch: {
            pagination: {
                handler() {
                    this.pupulateTable()
                },
                deep: true
            },
        },

        created() {
            this.pupulateTable()
        },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        methods: {
            toHome() {
                this.$router.push("/companies")
            },
            async pupulateTable() {
                try {
                    this.activateLoader()
                    this.loading = true
                    if (this.currentEdit.users.length > 0 || this.currentEdit.users != ''){
                        this.items = this.currentEdit.users
                        this.totalItems = this.currentEdit.users.length
                        if (this.pagination.sortBy) {
                            this.items = this.items.sort((a, b) => {
                                const sortA = a[sortBy]
                                const sortB = b[sortBy]

                                if (descending) {
                                    if (sortA < sortB) return 1
                                    if (sortA > sortB) return -1
                                    return 0
                                } else {
                                    if (sortA < sortB) return -1
                                    if (sortA > sortB) return 1
                                    return 0
                                }
                            })
                    }
                    }
                    this.loading = false
                    this.deactivateLoader()
                } catch (e) {
                    this.loading = false
                    this.showForm = false
                    this.deactivateLoader()
                    catchError(e)
                }
            },
            toDetail(data) {
                this.$router.push(`/users/${data.id}`)
            },
        }
    }
</script>

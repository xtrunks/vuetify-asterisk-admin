<template>
    <div>
        <h2 class="primary--text mb-3">{{ title }}</h2>
        <v-card :dark="dark" class="pt-3">
            <v-toolbar card color="transparent">
                <Tbtn icon-color="texts" :bottom="true" :tooltip-text="'Register New ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/>
                <Tbtn icon-color="texts" :bottom="true" :tooltip-text="'Download ' + title + ' data'" icon-mode color="primary" icon="cloud_download" @onClick="downloadData"/>
                <v-spacer/>
                <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                />
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
                    <!-- <td class="text-xs-left">{{ props.item.address }}</td> -->
                    <td class="text-xs-left">{{ props.item.contact_person }}</td>
                    <td class="text-xs-left">{{ props.item.phone }}</td>
                    <td class="text-xs-left">{{ props.item.email }}</td>
                    <td class="text-xs-left">{{ props.item.city }}</td>
                    <td class="text-md-center">
                        <Tbtn color="texts" icon="remove_red_eye" icon-mode :tooltip-text="'Manage ' + title" @onClick="toDetail(props.item)"/>
                    </td>
                </template>
            </v-data-table>
        </v-card>
        <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/>
        <DownloadDialog :show-dialog="showDownloadDialog" :data-to-export="dataToExport" :fillable="fillable" :type-dates="typeDates" model="Company" @onClose="showDownloadDialog = false"/>

    </div>
</template>
<script>
    import _ from "lodash"
    import { COMPANY_URL } from "~/utils/apis"
    import { global } from "~/mixins"
    import { dform } from "~/components/company"
    import axios from "axios"
    import catchError from "~/utils/catchError"
    import DownloadDialog from "~/components/DownloadDialog"

    export default {
        middleware: "auth",
        components: { dform, DownloadDialog },
        mixins: [global],
        data: () => ({
            title: "Company",
            headers: [
                { text: "Name", align: "left", value: "name" },
                // { text: "Address", value: "address", align: "left" },
                { text: "Contact Person", value: "contact_person", align: "left" },
                { text: "Phone", value: "phone", align: "left" },
                { text: "Email", value: "email", align: "left" },
                { text: "City", value: "city", align: "left" },
                { text: "Actions", value: "name", align: "center", sortable: false }
            ],
            items: [],
            confirmMessage: "Are you sure want to delete this ?",
            showConfirm: false,
            dataToExport: [],
            fillable: [
                "id",
                "name",
                "email",
                "phone",
                "description",
                "address",
                "contact_person",
                "province",
                "city"
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
            search() {
                if (this.search != "") {
                    this.searchQuery()
                }
            }
        },

        mounted() {
            this.pupulateTable()
        },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        methods: {
            searchQuery: _.debounce(function() {
                this.pupulateTable()
            }, 500),
            async pupulateTable() {
                try {
                    this.activateLoader()
                    this.loading = true
                    const { page, rowsPerPage, descending, sortBy } = this.pagination
                    const endPoint = `${COMPANY_URL}?page=${page}&limit=${rowsPerPage}&search=${
                        this.search
                        }`
                    const res = await axios.get(endPoint).then(res => res.data)
                    this.items = res.data
                    this.totalItems = res.meta.total
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
                    this.loading = false
                    this.deactivateLoader()
                } catch (e) {
                    this.deactivateLoader()

                    catchError(e)
                }
            },
            toDetail(data) {
                this.$router.push(`/companies/${data.id}`)
            },
            addData(data) {
                this.items.unshift(data)
                this.showForm = false
            },
            downloadData() {
                this.dataToExport = []
                this.dataToExport = this.items
                if (this.dataToExport.length) {
                    this.showDownloadDialog = true
                }
            }
        }
    }
</script>

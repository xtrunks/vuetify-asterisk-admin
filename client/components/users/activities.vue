<template>
    <div>
        <v-card :dark="dark" class="pt-3">
            <v-toolbar card color="transparent">
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
                    <td>{{ props.item.ip }}</td>
                    <td>{{ props.item.browser }}</td>
                    <td>{{ props.item.activity }}</td>
                    <td>{{ props.item.created_at }}</td>
                    <!-- <td class="justify-center">
                      <v-btn icon class="mx-0" @click="toDetail(props.item)">
                        <Tbtn icon-color="texts" :tooltip-text="'Show '+title" icon-mode flat color="icons" icon="remove_red_eye" @onClick="toDetail(props.item)"/>
                      </v-btn>
                    </td> -->
                </template>
            </v-data-table>
        </v-card>
        <DownloadDialog :show-dialog="showDownloadDialog" :data-to-export="dataToExport" :fillable="fillable" :type-dates="typeDates" :query="`user_id=${user.id}`" model="Activity" @onClose="showDownloadDialog = false"/>

    </div>
</template>
<script>
    import debounce from "lodash/debounce"
    import { ACTIVITIES_URL } from "~/utils/apis"
    import { global } from "~/mixins"
    import axios from "axios"
    import catchError from "~/utils/catchError"
    import DownloadDialog from "~/components/DownloadDialog"

    export default {
        middleware: "auth",
        components: { DownloadDialog },
        mixins: [global],
        data: () => ({
            title: "Activity",
            headers: [
                { text: "IP Address", align: "left", value: "ip" },
                { text: "Browser", align: "left", value: "browser" },
                { text: "Activity", align: "left", value: "activity" },
                { text: "Created", align: "left", value: "created_at" }
                // { text: "Actions", value: "name", sortable: false }
            ],
            items: [],
            dataToExport: [],
            fillable: ["id", "ip", "browser", "activity", "created_at"],
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
                if (this.search == "" || this.search.length > 2) {
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
            searchQuery: debounce(function() {
                this.pupulateTable()
            }, 500),
            async pupulateTable() {
                try {
                    this.activateLoader()
                    this.loading = true
                    const { page, rowsPerPage, descending, sortBy } = this.pagination
                    const endPoint = `${ACTIVITIES_URL}?page=${page}&limit=${rowsPerPage}&search=${
                        this.search
                        }&user_id=${this.user.id}`
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
                    this.loading = false
                    this.showForm = false
                    this.deactivateLoader()
                    catchError(e)
                }
            },
            toDetail(data) {
                this.$router.push(`/users/${data.id}`)
            },
            downloadData() {
                this.dataToExport = []
                let localItems = this.items
                localItems.map(i => {
                    let user = ""
                    let data = Object.assign({}, i)
                    delete data.user
                    delete data.user_id
                    if (i.user) user = i.user.name
                    data.user = user
                    this.dataToExport.push(data)
                })
                if (this.dataToExport.length) {
                    this.showDownloadDialog = true
                }
            }
        }
    }
</script>

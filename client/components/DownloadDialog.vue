<template>
    <div>
        <v-dialog v-model="dialog" max-width="500px" persistent>
            <v-card :dark="dark">
                <v-card-title>
                    <span class="headline">Choose one of following options</span>
                </v-card-title>
                <v-card-text style="padding: 0;"/>
                <v-container fluid style="padding-top: 0; padding-bottom: 0;" grid-list-md>
                    <v-radio-group v-model="radios">
                        <v-radio label="As seen on screen" value="1" color="white"/>
                        <v-radio label="Custom" value="2" color="white"/>
                    </v-radio-group>
                    <v-layout v-if="radios == '2'" row wrap>
                        <v-flex sm6 xs12>
                            <label>Sort By</label>
                            <v-autocomplete
                                    :items="fillable"
                                    v-model="queryData.sort_by"
                                    label="Select sort by"
                                    single-line
                                    cache-items
                            />
                        </v-flex>
                        <v-flex sm6 xs12>
                            <label>Sort Mode</label>
                            <v-autocomplete
                                    :items="sortModes"
                                    v-model="queryData.sort_mode"
                                    label="Select sort mode"
                                    single-line
                                    cache-items
                            />
                        </v-flex>
                        <v-flex sm6 xs12>
                            <label>Limit</label>
                            <v-text-field
                                    v-model="queryData.limit"
                                    name="limit"
                                    type="number"
                            />
                        </v-flex>
                        <v-flex sm6 xs12>
                            <label>Date Range By</label>
                            <v-autocomplete
                                    :items="typeDates"
                                    v-model="queryData.range_by"
                                    label="Select range date by"
                                    single-line
                                    cache-items
                            />
                        </v-flex>
                        <v-flex v-if="queryData.range_by != ''" sm6 xs12>
                            <label>Range Start</label>
                            <v-menu
                                    ref="menu_range_start"
                                    :close-on-content-click="false"
                                    v-model="menu_range_start"
                                    :nudge-right="40"
                                    :return-value.sync="queryData.range_start"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                            >
                                <v-text-field
                                        slot="activator"
                                        v-model="queryData.range_start"
                                        label="Pick a Range Start"
                                        readonly
                                />
                                <v-date-picker v-model="queryData.range_start" @input="$refs.menu_range_start.save(queryData.range_start)"/>
                            </v-menu>
                        </v-flex>
                        <v-flex v-if="queryData.range_by != ''" sm6 xs12>
                            <label>Range End</label>
                            <v-menu
                                    ref="menu_range_end"
                                    :close-on-content-click="false"
                                    v-model="menu_range_end"
                                    :nudge-right="40"
                                    :return-value.sync="queryData.range_end"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                            >
                                <v-text-field
                                        slot="activator"
                                        v-model="queryData.range_end"
                                        label="Pick a Range End"
                                        readonly
                                />
                                <v-date-picker v-model="queryData.range_end" @input="$refs.menu_range_end.save(queryData.range_end)"/>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn dark color="primary" @click="onClose" >Cancel</v-btn>
                    <v-btn dark color="primary" @click="downloadData" >Download</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { global } from "~/mixins"
    import axios from "axios"
    import catchError, { showNoty } from "~/utils/catchError"
    import moment from "moment"
    import { DATA_EXPORT_URL } from "~/utils/apis"

    export default {
        mixins: [global],
        props: {
            showDialog: {
                type: Boolean,
                required: true
            },
            dataToExport: {
                type: Array,
                required: true
            },
            model: {
                type: String,
                required: true
            },
            fillable: {
                type: Array,
                required: true
            },
            typeDates: {
                type: Array,
                required: true
            },
            query: {
                type: String,
                required: false,
                default: ""
            }
        },

        data() {
            return {
                dialog: false,
                radios: "1",
                sortModes: ["asc", "desc"],
                queryData: {
                    sort_by: "",
                    sort_mode: "asc",
                    limit: 100,
                    range_by: "",
                    range_start: moment()
                        .add(-1, "M")
                        .format("YYYY-MM-DD"),
                    range_end: moment()
                        .add(1, "d")
                        .format("YYYY-MM-DD")
                },
                menu_range_start: false,
                menu_range_end: false
            }
        },
        watch: {
            showDialog() {
                if (this.showDialog || !this.showDialog) {
                    this.dialog = this.showDialog
                }
            }
        },
        computed: {
            dark() {
                return this.$store.state.dark
            }
        },
        methods: {
            onClose() {
                this.clearForm()
                this.$emit("onClose")
            },
            async downloadData() {
                if (this.radios === "1") {
                    this.csvExport(this.model + "s", this.dataToExport)
                    this.onClose()
                } else if (this.radios === "2") {
                    try {
                        this.activateLoader()
                        let query = ""
                        for (let key in this.queryData) {
                            query += `&${key}=${this.queryData[key]}`
                        }
                        if (this.query) {
                            query += "&" + this.query
                        }
                        let resp = await axios.get(
                            DATA_EXPORT_URL + "?model=" + this.model + query
                        )

                        if (
                            resp.status === 200 &&
                            resp.data.data &&
                            resp.data.data.length > 0
                        ) {
                            this.csvExport(this.model + "s", resp.data.data)
                        } else {
                            showNoty("No result found", "error")
                        }
                        this.onClose()
                        this.deactivateLoader()
                    } catch (e) {
                        this.clearForm()
                        this.deactivateLoader()
                        catchError(e)
                    }
                }
            },
            clearForm() {
                this.dialog = false
                this.radios = "1"
                this.sortModes = ["asc", "desc"]
                this.queryData = {
                    sort_by: "",
                    sort_mode: "asc",
                    limit: 100,
                    range_by: "",
                    range_start: moment()
                        .add(-1, "M")
                        .format("YYYY-MM-DD"),
                    range_end: moment().format("YYYY-MM-DD")
                }
                this.menu_range_start = false
                this.menu_range_end = false
            }
        }
    }
</script>

<style scoped>
</style>

import changeCase from "change-case"
import { mapState } from "vuex"
import axios from "axios"
import Noty from "~/components/Noty"
import Tbtn from "~/components/Tbtn"
import { ExportToCsv } from "export-to-csv"

export default {
    components: { Noty, Tbtn },
    data() {
        return {
            loading: false,
            showForm: false,
            totalItems: 0,
            search: "",
            rowsPerPage: [10, 25, 50, 100],
            pagination: {
                sortBy: "",
                descending: false,
                page: 1,
                rowsPerPage: 10
            },
            showDownloadDialog: false
        }
    },
    mounted() {
        this.setAuth()
    },
    methods: {
        inArray(keys, searchedKey) {
            let result = false
            for (let i in keys) {
                if (keys[i] === searchedKey) {
                    result = true
                }
            }
            return result
        },
        setCase(txt) {
            return changeCase.titleCase(txt)
        },
        setSnakeCase(txt) {
            return changeCase.snakeCase(txt)
        },
        setAuth() {
            if (this.token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
                axios.defaults.headers.post["Content-Type"] = "application/json"
            }
        },
        activateLoader() {
            this.$bus.$emit("activate_loader")
        },
        deactivateLoader() {
            this.$bus.$emit("deactivate_loader")
        },

        csvExport(title, data) {
            const options = {
                filename: title,
                fieldSeparator: ",",
                quoteStrings: '"',
                decimalseparator: ".",
                showLabels: true,
                showTitle: true,
                title: title,
                useBom: true,
                useKeysAsHeaders: true
                // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
            }

            if (data.length) {
                const csvExporter = new ExportToCsv(options)
                csvExporter.generateCsv(data)
            }
        }
    },
    computed: {
        ...mapState([
            "token",
            "currentEdit",
            "comboData",
            "comboData2",
            "comboData3",
            "permissions",
            "user",
            "dashboardData"
        ])
    }
}

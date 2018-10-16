const cookieparser = require("cookieparser")
import axios from "axios"
import { USER_URL, COMBO_DATA_URL } from "~/utils/apis"
import catchError from "~/utils/catchError"

export const state = () => ({
    sidebar: false,
    dark: false,
    user: {},
    token: null,
    currentEdit: null,
    currentEdit2: null,
    comboData: null,
    comboData2: null,
    comboData3: null,
    comboDataRoles: null,
    comboDataCompanies: null,
    permissions: null,
    dashboardData: null,

})

export const mutations = {
    toggleSidebar(state) {
        state.sidebar = !state.sidebar
    },
    toggleDark(state) {
        state.dark = !state.dark
    },
    user(state, p) {
        state.user = p
    },
    token(state, p) {
        state.token = p
    },
    currentEdit(state, p) {
        state.currentEdit = p
    },
    currentEdit2(state, p) {
        state.currentEdit = p
    },
    comboData(state, p) {
        state.comboData = p
    },
    comboData2(state, p) {
        state.comboData2 = p
    },
    comboData3(state, p) {
        state.comboData3 = p
    },
    comboDataRoles(state, p) {
        state.comboDataRoles = p
    },
    comboDataCompanies(state, p) {
        state.comboDataCompanies = p
    },
    permissions(state, p) {
        state.permissions = p
    },
    companies(state, p) {
        state.companies = p
    },
    dashboardData(state, p) {
        state.dashboardData = p
    }
}

export const actions = {
    nuxtServerInit({ commit }, { req }) {
        let token = null
        let user = null

        if (req.headers.cookie) {
            let parsed = cookieparser.parse(req.headers.cookie)
            if (parsed.lj_token) {
                let data = JSON.parse(parsed.lj_token)
                token = data.token
                user = data.user
            }
        }
        commit("token", token)
        commit("user", user)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    },
    async getRoles({commit}) {
        try {
            let roles = await axios.get(COMBO_DATA_URL + "Role")
            if (roles) commit("comboDataRoles", roles.data)
        } catch (e) {
            catchError(e)
        }
    },
    async getCompanies({commit}) {
        try {
            let companies = await axios.get(COMBO_DATA_URL + "Company")
            if (companies) commit("comboDataCompanies", companies.data)
        } catch (e) {
            catchError(e)
        }
    },
}

export const getters = {
    getPermissions: state => name => {
        return state.comboData.filter(
            item => item.name.toLowerCase().indexOf(name) > -1
        )
    },
    getRoles: state => name => {
        return state.comboDataRoles.filter(
            item => item.name.toLowerCase().indexOf(name) > -1
        )
    },
    getCompanies: state => name => {
        return state.comboDataCompanies.filter(
            item => item.name.toLowerCase().indexOf(name) > -1
        )
    },
}
// var test = _.filter(items, function (item) {
//   return _.some(item.tags, function (tag) {
//     return _.startsWith(tag, input.val());
//   });
// });

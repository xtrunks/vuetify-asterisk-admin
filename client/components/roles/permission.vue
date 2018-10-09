<template>
  <div>
    <v-card :dark="dark">
      <v-container fluid>
        <v-toolbar color="transparent" card>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          />
          <v-spacer/>
          <Tbtn icon-color="texts" color="primary" icon="chevron_left" icon-mode tooltip-text="Back to Role List" @onClick="toHome"/>
          <Tbtn icon-color="texts" color="primary" icon="save" icon-mode tooltip-text="Save" @onClick="showDialog = true"/>

          <Tbtn icon-color="texts" color="primary" tooltip-text="Select all" icon-mode icon="check_box" @onClick="selectAll"/>
          <Tbtn icon-color="texts" color="primary" tooltip-text="Unselect all" icon-mode icon="check_box_outline_blank" @onClick="clearAll"/>
        </v-toolbar>
        <v-card-text>
          <v-layout v-if="items" row wrap>
            <v-flex v-for="permission in items" :key="permission.id" md3 sm4 xs6>
              <v-checkbox v-model="permissionArray" :label="permission.name" :value="permission.id" color="primary"/>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog :showDialog="showDialog" text="Are you sure want to update ?" @onClose="showDialog = false" @onConfirmed="attachPermissions"/>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { ROLE_PERMISSIONS_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"
import debounce from "lodash/debounce"
export default {
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      showDialog: false,
      permissionArray: [],
      search: "",
      items: []
    }
  },
  watch: {
    search() {
      if (this.search !== "") this.searchPermissions()
    }
  },
  mounted() {
    this.items = this.$store.getters.getPermissions("")
    this.setPermissionArray()
  },
    computed: {
        dark() {
            return this.$store.state.dark
        }
    },
  methods: {
    toHome() {
      this.$router.push("/roles")
    },
    setPermissionArray() {
      if (this.permissions) {
        this.permissions.forEach(p => {
          this.permissionArray.push(p.id)
        })
      }
    },
    async attachPermissions() {
      try {
        this.activateLoader()
        let formData = {
          role_id: this.currentEdit.id,
          permissions: this.permissionArray
        }
        const resp = await axios
          .put(ROLE_PERMISSIONS_URL, formData)
          .then(res => res.data)
        this.$store.commit("permissions", resp.data)
        showNoty("Data Saved", "success")
        this.showDialog = false
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    selectAll() {
      if (this.items) {
        this.permissionArray = []
        this.items.forEach(c => {
          this.permissionArray.push(c.id)
        })
      }
    },
    clearAll() {
      this.permissionArray = []
    },
    searchPermissions: debounce(function() {
      let results = this.$store.getters.getPermissions(this.search)
      this.items = results
    }, 300)
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

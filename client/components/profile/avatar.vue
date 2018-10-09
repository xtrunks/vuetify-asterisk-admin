<template>
    <v-layout row class="mt-3">
        <v-flex xs12 sm6 offset-sm3>
            <v-card :dark="dark">
                <v-img :src="avatar" aspect-ratio="1.7"/>
                <v-card-text>
                    <v-text-field v-model="imageName" label="Select Image" prepend-icon="attach_file" @click="pickFile"/>
                    <input
                            ref="image"
                            type="file"
                            style="display: none"
                            accept="image/*"
                            @change="onFilePicked"

                    >
                    <Tbtn icon-color="texts" color="primary" block icon="cloud_upload" tooltip-text="Save profile picture" @onClick="submitFile"/>
                </v-card-text>

            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import { global } from "~/mixins"
    import axios from "axios"
    import { PROFILE_URL } from "~/utils/apis"
    import catchError, { showNoty } from "~/utils/catchError"
    import Cookie from "js-cookie"

    export default {
        mixins: [global],
        data() {
            return {
                imageName: "",
                imageUrl: "",
                imageFile: ""
            }
        },
        computed: {
            avatar() {
                if (this.user && this.user.photo != "") {
                    return this.user.photo
                }
                return "/images/user.png"
            },
            dark() {
                return this.$store.state.dark
            }
        },

        methods: {
            pickFile() {
                this.$refs.image.click()
            },

            onFilePicked(e) {
                const files = e.target.files
                if (files[0] !== undefined) {
                    this.imageName = files[0].name
                    if (this.imageName.lastIndexOf(".") <= 0) {
                        return
                    }
                    const fr = new FileReader()
                    fr.readAsDataURL(files[0])
                    fr.addEventListener("load", () => {
                        this.imageUrl = fr.result
                        this.imageFile = files[0] // this is an image file that can be sent to server...
                    })
                } else {
                    this.clearData()
                }
            },
            async submitFile() {
                try {
                    this.activateLoader()
                    if (this.user && this.imageFile != "") {
                        let formData = new FormData()
                        formData.append("photo", this.imageFile)
                        const resp = await axios
                            .post(PROFILE_URL + "/upload/" + this.user.id, formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                            })
                            .then(res => res.data)
                        let cookieData = await Cookie.get("lj_token")
                        cookieData = JSON.parse(cookieData)
                        cookieData.user = resp.data
                        await Cookie.set("lj_token", JSON.stringify(cookieData))
                        this.$store.commit("user", resp.data)
                        showNoty("Profile Picture Updated", "success")
                        this.clearData()
                        this.deactivateLoader()
                    }
                } catch (e) {
                    this.deactivateLoader()
                    catchError(e)
                }
            },
            clearData() {
                this.imageName = ""
                this.imageFile = ""
                this.imageUrl = ""
            }
        }
    }
</script>

<style scoped>
</style>

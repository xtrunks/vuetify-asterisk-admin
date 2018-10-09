import Noty from "noty"
import Cookie from "js-cookie"

export default e => {
  if (e.response) {
    const status = e.response.status
    let message = ""
    if (e.response.data && e.response.data.meta)
      message = e.response.data.meta.message
    switch (status) {
      case 400:
        showNoty(message, "error")
        break
      case 422:
        {
          const { details } = e.response.data
          details.forEach(d => {
            showNoty(d.message, "error")
          })
        }
        break
      case 401:
        {
          console.log('401') //eslint-disable-line
          toLogin()
        }
        break

      case 403:
        showNoty(message, "error")
        break

      default:
        showNoty(
          "Internal Server Error, please contact our Administrator",
          "error"
        )
        console.log('Unknown Status') //eslint-disable-line
        break
    }
  } else {
    console.log('default error') //eslint-disable-line
    showNoty("Internal Server Error, please contact our Administrator", "error")
  }
}

function toLogin() {
  Cookie.remove("lj_token")
  if (window && window.location) window.location.href = "/login"
}

export function showNoty(text, type) {
  return new Noty({
    layout: "topRight",
    text,
    theme: "metroui",
    timeout: 5000,
    progressBar: true,
    type
  }).show()
}

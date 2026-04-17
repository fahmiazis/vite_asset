import Cookies from "js-cookie"

export const logout = () => {
  Cookies.remove("access_token")
  Cookies.remove("refresh_token")
  Cookies.remove("user")
  Cookies.remove("token_type")
}
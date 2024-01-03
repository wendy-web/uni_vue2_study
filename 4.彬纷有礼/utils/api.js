
import {baseURL,COS_URL, WSS_URL, HTTP,wxlogin} from "./http.js";
module.exports = {
  baseURL,
  COS_URL,
  WSS_URL,
  get(url, params = {}) {
    return HTTP({
      url,
      data:params,
      method:'get'
    })
  },
  post(url, params = {}, mask = true, page = '') {
    return HTTP({
      url,
      data:params,
      isNoLoading:!mask,
      method:'post'
    })

  },
  postBase({url = '', params = {}, mask = true,fromApp=false}) {
    return HTTP({
      url,
      data:params,
      isNoLoading:!mask,
      method:'post',
      fromApp
    })
  },
  login:wxlogin
}
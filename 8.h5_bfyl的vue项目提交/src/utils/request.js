import axios from 'axios'
import { Dialog } from 'vant'
import { Notify } from 'vant';
import { getToken } from '@/utils/auth'
const url = process.env.NODE_ENV === 'development' ? '/dev' : ''
// console.log('process.env.NODE_ENV :', process.env.NODE_ENV )
// console.log('url:', url)

// create an axios instance
const service = axios.create({
  baseURL: url, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5 * 60 * 1000, // request timeout
  headers: { 'Content-Type': 'application/json;' }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log('config:', config)
    const setLoding = config?.loading ? config.loading : false;
    if (setLoding) {
        console.log('需要loading')
    }
    let token = getToken()
    if (token) {
      // 使用请求头authorization
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    console.log('关闭loading')
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log('关闭loading')
    const res = response.data
    const { code, msg } = res
    if (code == 1 || code == 0 || code == 2) {
      return res
    } else {
      if (code == -1) {
        Dialog.alert({
          title: '提示',
          message: '当前页面已失效，请重新登录',
          confirmButtonText: '确定'
        }).then(()=>{
            // 先获取 token 再跳转登录页
            window.location.href = '/'
        })
        return
      }
      Notify({ type: 'danger', message: msg, duration: 5 * 1000 })
      
    }
  },
  error => {
    console.log('err' + error) // for debug
    Notify({ type: 'danger', message:  error.message, duration: 5 * 1000 })
    
    return Promise.reject(error)
  }
)

export default service

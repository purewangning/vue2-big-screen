import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { v4 } from 'uuid'
import { setRequestParams } from './requestParams'
import errorCode from './errorCode'

let showError = true

const showErrorMessage = (message) => {
  showError &&
    Message({
      message: message,
      type: 'error'
    })
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // 是否需要设置错误警告（默认设置）
    showError = !config.notShowError
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // 添加请求标志traceld，用于定位请求
    const uuid = v4()
    config.headers['Trace-Id'] = uuid
    setRequestParams(config, isRepeatSubmit)
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']

    // 二进制数据处理
    if (['blob', 'arraybuffer'].includes(res.request.responseType)) {
      // 返回json格式报错信息
      if (res.data.type === 'application/json') {
        return res.data.text().then((text) => {
          const { code = 200, msg = '' } = JSON.parse(text)
          if (code === 401) {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
            return
          } else if (code !== 200) {
            showErrorMessage(msg)
            return Promise.reject(msg)
          }
          return res.data
        })
      }
      return res.data
    }

    if (code === 401) {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
      return
    } else if (code === 500) {
      showErrorMessage(msg)
      return Promise.reject(new Error(msg))
    } else if (code === 505) {
      return Promise.reject(res.data)
    } else if (code === 601) {
      showErrorMessage(msg)
      return Promise.reject('error')
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  (error) => {
    console.log('err' + error)
    let { message } = error
    if (message) {
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时'
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常'
      }
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service

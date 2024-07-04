import cache from './cache'

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== '' &&
            typeof value[key] !== 'undefined'
          ) {
            const params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

/**
 * param绑定处理
 * @param {*}  config 请求配置
 * @param {Boolean}  isRepeatSubmit 是否重复请求
 * @returns {config}
 */

export function setRequestParams(config, isRepeatSubmit = false) {
  if (config.method === 'get' && (config.params || config.data)) {
    let url = config.url + '?' + tansParams(config.params || config.data)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  if (config.method === 'post' || config.method === 'put') {
    // 处理分页参数
    if (
      typeof config.data === 'object' &&
      config.data.pageNum &&
      config.data.pageSize
    ) {
      // 分页参数单独拼接在url后面
      config.url =
        config.url +
        '?pageNum=' +
        config.data.pageNum +
        '&pageSize=' +
        config.data.pageSize
    }
    // 处理关闭分页
    if (typeof config.data === 'object' && config.data.closePage) {
      // 分页参数单独拼接在url后面
      if (config.url.indexOf('?') === -1) {
        config.url = config.url + '?closePage=' + config.data.closePage
      } else {
        config.url = config.url + '&closePage=' + config.data.closePage
      }
    }
  }
  if (
    !isRepeatSubmit &&
    (config.method === 'post' || config.method === 'put')
  ) {
    const requestObj = {
      url: config.url,
      data:
        typeof config.data === 'object'
          ? JSON.stringify(config.data)
          : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url // 请求地址
      const s_data = sessionObj.data // 请求数据
      const s_time = sessionObj.time // 请求时间
      const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交
      if (
        s_data === requestObj.data &&
        requestObj.time - s_time < interval &&
        s_url === requestObj.url
      ) {
        const message = '数据正在处理，请勿重复提交'
        console.warn(`[${s_url}]: ` + message)
        console.trace(s_url)
        return Promise.reject(false)
        // return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
    delete config.headers.encryption
    delete config.headers.repeatSubmit
    // return config
  }
}

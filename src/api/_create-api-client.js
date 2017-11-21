import axios from 'axios'
import Toast from 'assets/js/Toast'
import { env, host, timeout } from '../../.env'

import AppInvoker from 'appinvoker'
const toast = new Toast()

export default (context) => {
  const ctx = context.$store ? context.$store.state.ssrContext : context

  const invoker = AppInvoker({
    name: ctx.header['x-app-name'],
    version: ctx.header['x-app-version']
  })

  const http = axios.create({
    baseURL: host[env],
    headers: { Accept: 'application/json' },
    timeout: timeout.client,
    withCredentials: true
  })

  http.interceptors.request.use(cfg => {
    if (invoker.webview) {
      Object.assign(cfg.headers, invoker.getApiSignatures())
    }
    if (['post', 'put', 'delete'].indexOf(cfg.method) !== -1 && !cfg.data) {
      cfg.data = {
        fuc: 1
      }
    }
    return cfg
  })

  http.interceptors.response.use(res => res && res.data, err => {
    if (err.response) {
      if (err.response.status === 401) {
        toast.start({
          tip: '用户认证失败，请重新登录',
          type: 'error'
        })
      } else if (err.response.status === 403) {
        toast.start({
          tip: '您没有权限进行此操作',
          type: 'error'
        })
      }
    }
    if (err.message === `timeout of ${timeout.client}ms exceeded`) {
      toast.start({
        tip: '请求超时',
        type: 'error'
      })
    } else {
      return Promise.reject(err && err.response)
    }
  })

  return http
}

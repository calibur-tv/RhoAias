import axios from 'axios'
import { env, host, timeout } from '../../.env'

export default () => {
  const http = axios.create({
    baseURL: host[env],
    headers: { Accept: 'application/json' },
    timeout: timeout.client
  })

  http.interceptors.request.use(cfg => {
    if (['post', 'put', 'delete'].indexOf(cfg.method) !== -1 && !cfg.data) {
      cfg.data = {
        fuc: 1
      }
    }
    return cfg
  })

  http.interceptors.response.use(res => res && res.data, err => {
    if (err.response) {
      // TODO handle 401 403
    }
    if (err.message === `timeout of ${timeout.client}ms exceeded`) {
      // TODO handle timeout
    }
    return Promise.reject(err && (err.response || err.message))
  })

  return http
}

import axios from 'axios'
import { env, host, timeout } from '../../.env'

export default () => {
  const http = axios.create({
    baseURL: env === 'developoment' ? host[env] : 'http://localhost/',
    headers: { Accept: 'application/json' },
    timeout: timeout.server
  })

  http.interceptors.response.use(res => res && res.data, err => Promise.reject(err))

  return http
}

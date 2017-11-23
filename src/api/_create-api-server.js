import axios from 'axios'
import { env, host, timeout } from '../../.env'

export default () => {
  const http = axios.create({
    baseURL: env === 'development' ? host[env] : 'http://localhost/',
    headers: { Accept: 'application/json' },
    timeout: timeout.server
  })

  http.interceptors.response.use(res => res && res.data && res.data.data, err => {
    err.code = err.response.status
    throw err
  })

  return http
}

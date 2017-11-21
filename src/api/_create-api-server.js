import axios from 'axios'
import { env, host, timeout } from '../../.env'

export default (ctx) => {
  const http = axios.create({
    baseURL: env === 'developoment' ? host[env] : 'http://localhost/',
    headers: { Accept: 'application/json' },
    timeout: timeout.server
  })

  http.interceptors.request.use(config => {
    config.headers = {
      Accept: 'application/json',
      Cookie: ctx.header.cookie || null,
      'User-Agent': ctx.header['user-agent'] || null,
      'Accept-Language': ctx.header['accept-language'] || null
    }
    return config
  })

  http.interceptors.response.use(res => res && res.data, err => Promise.reject(err))

  return http
}

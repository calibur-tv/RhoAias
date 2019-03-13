import md5 from 'blueimp-md5'
import qs from 'qs'
import { AUTH_KEY } from '~/.env'

export default req => {
  const isClient = typeof window !== 'undefined'
  if (isClient && window.__JWT_TOKEN__) {
    return window.__JWT_TOKEN__
  }
  let token = ''
  const cookies = isClient ? document.cookie : req ? req.headers.cookie : ''
  if (cookies) {
    cookies.split('; ').forEach(item => {
      const temp = item.split('=')
      if (temp[0] === 'JWT-TOKEN') {
        token = temp[1]
      }
    })
  }
  const authHeader = req ? req.headers.authorization : ''
  if (authHeader) {
    token = authHeader.split('Bearer ')[1]
  }
  const requestUrl = isClient ? window.location.href : req.url
  const params = qs.parse(requestUrl.split('?')[1])

  if (params && params.s && params.k && params.t && params.u && params.f) {
    if (~['wxapp'].indexOf(params.f)) {
      const now = parseInt(Date.now() / 1000)
      if (
        Math.abs(now - params.s) < 30 &&
        md5(`${params.s}${AUTH_KEY}${params.u}`) === params.k
      ) {
        token = params.t
      }
    }
  }
  if (isClient) {
    window.__JWT_TOKEN__ = token
  }

  return token
}

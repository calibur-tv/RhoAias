import Cookies from 'js-cookie'
import generateRequestError from '~/assets/js/generateRequestError'
import parseToken from '~/assets/js/parseToken'

export default ({ $axios, app }) => {
  const isClient = typeof window !== 'undefined'

  $axios.setHeader('Accept', 'application/x.api.latest+json')
  if (app.store.state.login) {
    $axios.setToken(app.store.state.user.token, 'Bearer')
  } else {
    $axios.setToken(parseToken(isClient ? '' : app.context.req), 'Bearer')
  }

  $axios.onRequest(config => {
    config.baseURL = isClient
      ? process.env.API_URL_BROWSER
      : process.env.API_URL
    config.timeout = 10000

    const method = config.method.toLocaleUpperCase()
    if (isClient) {
      M.sentry.setRequestStack({
        url: config.url,
        params: method === 'GET' ? config.params : config.data,
        method
      })
    }
  })

  $axios.onResponse(resp => {
    if (isClient) {
      M.sentry.setResponseStack({
        url: resp.request.responseURL,
        requestId: resp.headers['x-request-id'],
        viaId: resp.headers['x-via'] || 'none',
        code: 200
      })
    }
    const newToken = resp.headers.authorization
    if (newToken) {
      Object.assign(resp.data.data, {
        token: newToken.split('Bearer ').pop()
      })
    }
    return resp.data
  })

  $axios.onError(error => {
    const err = generateRequestError(error)
    if (isClient) {
      M.sentry.setResponseStack({
        url: err.request ? err.request.responseURL || 'unknown' : 'unknown',
        code: err.statusCode,
        message: err.message
      })
      if (/\/door\/refresh/.test(err.config.url)) {
        Cookies.remove('JWT-TOKEN')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
      M.toast.error(err.message)
    }
    return Promise.reject(err)
  })
}

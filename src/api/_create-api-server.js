import axios from 'axios'
import parseToken from '~/assets/js/parseToken'

class Http {
  constructor(ctx) {
    this.instance = axios.create({
      baseURL: process.env.API_HOST,
      headers: {
        Accept: 'application/x.api.latest+json',
        Authorization: `Bearer ${parseToken(ctx)}`
      },
      timeout: 10000
    })
  }

  async get(url, data) {
    try {
      const res = await this.instance.get(url, {
        params: data && data.params ? data.params : {}
      })
      return res.data.data
    } catch (e) {
      const code = e.response ? e.response.status : 500
      if (code === 401) {
        return null
      }
      e.code = code
      throw e
    }
  }

  async post(url, data) {
    try {
      const res = await this.instance.post(url, data)
      const newToken = res.headers.authorization
      if (newToken) {
        return Object.assign(res.data.data, {
          token: newToken.split('Bearer ').pop()
        })
      }
      return res.data.data
    } catch (e) {
      const code = e.response ? e.response.status : 500
      if (code === 401) {
        return null
      }
      e.code = code
      throw e
    }
  }
}

export default ctx => {
  return new Http(ctx)
}

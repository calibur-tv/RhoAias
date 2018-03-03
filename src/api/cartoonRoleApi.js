import BaseApi from './_baseApi'

export default class extends BaseApi {
  trending ({ seenIds }) {
    return this.http.get('/trending/cartoon_role', { seenIds })
  }

  playing (id) {
    return this.http.post(`/video/${id}/playing`)
  }
}

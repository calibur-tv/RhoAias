import BaseApi from './_baseApi'

export default class extends BaseApi {
  create({
    title,
    tags,
    bangumiId,
    content,
    images,
    desc,
    geetest,
    is_creator
  }) {
    return this.http.post('post/create', {
      title,
      tags,
      bangumiId,
      content,
      images,
      desc,
      geetest,
      is_creator
    })
  }

  show({ id, page, take, only, replyId }) {
    return this.http.get(`post/${id}/show`, {
      params: { page, take, only, replyId }
    })
  }

  deletePost(id) {
    return this.http.post(`post/${id}/deletePost`)
  }

  tags() {
    return this.http.get('post/tags')
  }
}

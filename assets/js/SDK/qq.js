// http://open.mobile.qq.com/api/component/share

export default class {
  init() {
    setShareInfo({
      title: this.getShareTitle(), // 分享标题
      summary: this.getShareDesc(), // 分享内容
      pic: this.getShareImage(), // 分享图片
      url: this.getShareLink() // 分享链接
    })
  }

  getShareTitle() {
    return M.shareData.get().title
  }

  getShareLink() {
    return M.shareData.get().link
  }

  getShareDesc() {
    return M.shareData.get().description
  }

  getShareImage() {
    return M.shareData.get().imageUrl
  }
}

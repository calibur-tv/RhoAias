// http://open.mobile.qq.com/api/component/share

export default class {
  init({ appId, timestamp, signature, nonceStr }) {
    if (typeof window.setShareInfo === 'undefined') {
      return
    }
    setShareInfo({
      title: this.getShareTitle(), // 分享标题
      summary: this.getShareDesc(), // 分享内容
      pic: this.getShareImage(), // 分享图片
      url: this.getShareLink(), // 分享链接
      // 微信权限验证配置信息，若不在微信传播，可忽略
      WXconfig: {
        swapTitleInWX: true,
        appId: appId,
        nonceStr: nonceStr,
        timestamp: timestamp,
        signature: signature
      }
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

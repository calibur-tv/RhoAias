export default class {
  init({ appId, timestamp, signature, nonceStr }) {
    if (typeof window.wx === 'undefined') {
      return
    }
    wx.config({
      debug: false,
      appId: appId,
      nonceStr: nonceStr,
      timestamp: timestamp,
      signature: signature,
      jsApiList: [
        'previewImage',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'updateTimelineShareData',
        'updateAppMessageShareData'
      ]
    })

    // 初始化分享相关
    wx.ready(() => {
      // 初始化查看图片
      const allNoteImages = []
      ;[].forEach.call(
        document.querySelectorAll('.image-package'),
        imagePackage => {
          const image = imagePackage.querySelector('img')

          if (image) {
            let imageSrc = image.getAttribute('src')

            if (imageSrc.match(/^\/\//)) {
              imageSrc = `http:${imageSrc}`
            }

            allNoteImages.push(imageSrc)

            imagePackage.addEventListener('click', () => {
              wx.previewImage({
                current: imageSrc,
                urls: allNoteImages
              })
            })
          }
        }
      )

      wx.updateTimelineShareData({
        title: this.getShareTitle(),
        link: this.getShareLink(),
        imgUrl: this.getShareImage(),
        success: () => {}
      })

      wx.updateAppMessageShareData({
        title: this.getShareTitle(),
        desc: this.getShareDesc(),
        link: this.getShareLink(),
        imgUrl: this.getShareImage(),
        type: 'link',
        success: () => {}
      })

      wx.onMenuShareTimeline({
        title: this.getShareTitle(),
        link: this.getShareLink(),
        imgUrl: this.getShareImage(),
        success: () => {}
      })

      wx.onMenuShareAppMessage({
        title: this.getShareTitle(),
        desc: this.getShareDesc(),
        link: this.getShareLink(),
        imgUrl: this.getShareImage(),
        type: 'link',
        success: () => {}
      })
    })
  }

  getShareTitle() {
    return M.shareData.get().title
  }

  getShareLink() {
    return M.shareData.get().link
  }

  getShareDesc() {
    return M.shareData.get().desc
  }

  getShareImage() {
    return M.shareData.get().image
  }
}

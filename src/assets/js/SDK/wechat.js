export default class {
  init({ appId, timestamp, signature, nonceStr }) {
    wx.config({
      debug: false,
      appId: appId,
      nonceStr: nonceStr,
      timestamp: timestamp,
      signature: signature,
      jsApiList: [
        "onMenuShareTimeline",
        "onMenuShareAppMessage",
        "previewImage"
      ]
    });

    // 初始化分享相关
    wx.ready(() => {
      wx.onMenuShareTimeline({
        title: this.getShareTitle(),
        link: this.getShareLink(),
        imgUrl: this.getShareImage(),
        success: () => {
          M.vueHub.$emit("note-share-wechat");
        }
      });

      wx.onMenuShareAppMessage({
        title: this.getShareTitle(),
        desc: this.getShareDesc(),
        link: this.getShareLink(),
        imgUrl: this.getShareImage(),
        type: "link",
        success: () => {
          M.vueHub.$emit("note-share-wechat");
        }
      });
    });
  }

  getShareTitle() {
    return M.shareData.get().title;
  }

  getShareLink() {
    return M.shareData.get().link;
  }

  getShareDesc() {
    return M.shareData.get().description;
  }

  getShareImage() {
    return M.shareData.get().imageUrl;
  }
}

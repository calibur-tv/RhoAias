// https://am-team.github.io/nebula/jsapi/native/start-share.html

export default class {
  init() {
    // 支付宝版本大于 9.6 时, 自定义信息才生效
    if (Ali.alipayVersion.slice(0, 3) < 9.6) {
      return
    }

    // 监听支付宝右上角的菜单按钮
    document.addEventListener(
      'optionMenu',
      () => {
        ant.call(
          'startShare',
          {
            // 当用户选择该数组内指定的分享渠道时，仅返回渠道名，而不是真正开始自动分享
            onlySelectChannel: [
              'Weibo',
              'ALPContact',
              'ALPTimeLine',
              'SMS',
              'Weixin',
              'WeixinTimeLine',
              'QQ',
              'QQZone',
              'DingTalkSession',
              'OpenInSafari',
              'Favorite'
            ]
          },
          data => {
            // 通过onlySelectChannel屏蔽掉自动分享功能后，自行调用shareToChannel接口进行单独分享
            ant.call(
              'shareToChannel',
              {
                name: data.channelName,
                param: {
                  contentType: 'url', // 选填，目前支持支持'auto',text','image','url'格式（android分享组件不支持auto）
                  title: this.getShareTitle(),
                  content: this.getShareDesc(),
                  iconUrl: this.getShareImage(),
                  imageUrl: this.getShareImage(),
                  captureScreen: false, // 是否分享当前页面的截图
                  url: this.getShareLink(),
                  otherParams: {} // 特定分享渠道的扩展参数
                }
              },
              () => {
                // TODO
              }
            )
          }
        )
      },
      false
    )
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

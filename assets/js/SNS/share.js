import Wechat from './wechat'

export default class {
  constructor({ ua, config }) {
    if (!config) {
      return
    }
    this.ua = ua
    this.config = config
    this.initShareSDK()
    return this.initShareData()
  }

  initShareSDK() {
    if (this.ua.wechat) {
      const wechat = new Wechat()
      wechat.init(this.config)
    }
  }

  initShareData() {
    return {
      get: () => {
        let ret
        try {
          ret = JSON.parse(
            document.querySelector('script[data-hid=share-data]').text
          )
        } catch (e) {
          ret = {
            title: document.title,
            desc:
              document
                .querySelector('[name=description]')
                .getAttribute('content') || 'calibur | 二次元股市',
            image: 'https://image.calibur.tv/owner/logo/max.png-share120jpg'
          }
        }
        return Object.assign(
          {
            link: window.location.href
          },
          ret,
          {
            image: /^https:/.test(ret.image)
              ? ret.image.replace('https:', 'http:')
              : /^http:/.test(ret.image)
                ? ret.image
                : `http://image.calibur.tv${ret.image}`
          }
        )
      }
    }
  }
}

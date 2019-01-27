import Wechat from './wechat'
import QQ from './qq'
import AliPay from './alipay'

export default class {
  constructor({ store }) {
    const { wechat, ua } = store.state
    this.ua = ua
    this.signature = wechat
    this.initShareSDK()
    return this.initShareData()
  }

  initShareSDK() {
    if (this.ua.wechat) {
      const wechat = new Wechat()
      wechat.init(this.signature)
    } else if (this.ua.alipay) {
      const alipay = new AliPay()
      alipay.init()
    } else if (this.ua.qq) {
      const qq = new QQ()
      qq.init(this.signature)
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
            description:
              document
                .querySelector('[name=description]')
                .getAttribute('content') || 'calibur.tv - 天下漫友是一家',
            imageUrl:
              'https://image.calibur.tv/owner/logo/max.png-share120jpg'
          }
        }
        return Object.assign(
          {
            link: window.location.href
          },
          ret,
          {
            imageUrl: /^https:/.test(ret.imageUrl)
              ? ret.imageUrl.replace('https:', 'http:')
              : /^http:/.test(ret.imageUrl)
                ? ret.imageUrl
                : `http://static.calibur.tv${ret.imageUrl}`
          }
        )
      }
    }
  }
}

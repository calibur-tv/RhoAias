import { Message } from 'element-ui'
import { Toast, Indicator } from 'mint-ui'

export default class {
  success (tip) {
    this.stop()
    Toast({
      message: tip,
      iconClass: 'iconfont icon-caozuochenggong'
    })
  }

  info (tip) {
    this.stop()
    Message({
      message: tip,
      center: true
    })
  }

  error (tip) {
    this.stop()
    Toast({
      message: tip,
      iconClass: 'iconfont icon-cuowuhttp'
    })
  }

  loading (tip) {
    Indicator.open({
      text: tip || '加载中...',
      spinnerType: 'triple-bounce'
    })
  }

  stop () {
    Indicator.close()
  }
}

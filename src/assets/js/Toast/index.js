import { Message } from 'element-ui'
import { Toast, Indicator } from 'mint-ui'

export default class {
  success (tip) {
    Toast({
      message: tip,
      iconClass: 'iconfont icon-caozuochenggong'
    })
  }

  info (tip) {
    Message({
      message: tip,
      center: true
    })
  }

  error (tip) {
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

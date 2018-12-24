import { Message } from 'element-ui'
import { Toast, Indicator } from 'mint-ui'

const timeout = (duration = 0) =>
  new Promise(resolve => {
    setTimeout(resolve, duration)
  })

const showTime = 1500

export default class {
  success(tip) {
    this.stop()
    let text = ''
    let time
    if (typeof tip === 'object') {
      text = tip.tip
      time = tip.time || showTime
    } else {
      text = tip
      time = showTime
    }
    Toast({
      duration: time,
      message: text || '操作成功',
      iconClass: 'iconfont icon-caozuochenggong'
    })
    return timeout(time)
  }

  info(tip) {
    this.stop()
    Message({
      message: tip,
      center: true
    })
  }

  error(tip) {
    console && console.log(tip) // eslint-disable-line
    this.stop()
    let text = ''
    let time
    if (typeof tip === 'object') {
      text = tip.tip
      time = tip.time || showTime
    } else {
      text = tip
      time = showTime
    }
    Toast({
      duration: time,
      message: text || '操作失败',
      iconClass: 'iconfont icon-cuowuhttp'
    })
    return timeout(time)
  }

  loading(tip) {
    this.stop()
    let message = ''
    let time
    if (typeof tip === 'object') {
      message = tip.tip
      time = tip.time
    } else {
      message = tip
    }
    Indicator.open({
      text: message || '加载中...',
      spinnerType: 'triple-bounce'
    })
    if (time) {
      return timeout(time).then(() => this.stop())
    }
  }

  stop() {
    Indicator.close()
  }
}

import './style.scss'
import { Message } from 'element-ui'

const timeout = (duration = 0) => new Promise((resolve) => {
  setTimeout(resolve, duration)
})

const fadeTimeout = 300

export default class {
  start (args) {
    const opts = args || {}
    const time = opts.time || 2000
    const tip = opts.tip || '加载中'
    const type = opts.type || 'loading'
    const auto = type === 'loading' ? opts.auto !== undefined || opts.time !== undefined : !(opts.auto !== undefined && !opts.auto)

    let toast = document.getElementById('toast-container')
    if (toast) {
      toast.innerHTML = this.constructor.template(tip, type)
    } else {
      toast = document.createElement('div')
      toast.id = 'toast-container'
      toast.innerHTML = this.constructor.template(tip, type)
      document.body.style.overflow = 'hidden'
      document.body.appendChild(toast)
    }

    setTimeout(() => {
      toast.querySelector('.loading').classList.add('show')
    }, fadeTimeout)

    if (auto) {
      return timeout(time).then(() => this.stop())
    }
  }

  stop () {
    const toast = document.getElementById('toast-container')
    if (toast) {
      toast.querySelector('.loading').classList.add('show')

      setTimeout(() => {
        toast && toast.parentNode.removeChild(toast)
      }, fadeTimeout)
      document.body.removeAttribute('style')
    }
  }

  success (tip) {
    this.start({
      type: 'success',
      tip
    })
  }

  info (tip) {
    Message({
      message: tip,
      center: true
    })
  }

  warn (tip) {
    this.start({
      type: 'info',
      tip
    })
  }

  error (tip) {
    this.start({
      type: 'error',
      tip
    })
  }

  loading (tip) {
    this.start({
      type: 'loading',
      tip
    })
  }

  static template (tip, type) {
    return `<div class="loading"><div class="toast-icon-${type}"></div><span class="tip">${tip}</span></div>`
  }
}

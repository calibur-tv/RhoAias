import scrollToY from 'assets/js/scrollToY'
import Backdrop from 'assets/js/Backdrop'
import Toast from 'assets/js/Toast'

export default {
  install (Vue, options) {
    Vue.prototype.$scrollToY = scrollToY

    Vue.prototype.$channel = new Vue()

    Vue.prototype.$backdrop = new Backdrop()

    Vue.prototype.$toast = new Toast()

    Vue.prototype.$resize = (url, options = {}) => {
      if (url === '') {
        return ''
      }
      const canUseWebP = () => {
        if (Vue.prototype.$isServer) {
          return false
        }
        if (window.supportWebP !== undefined) {
          return window.supportWebP
        }

        const elem = document.createElement('canvas')

        if (elem.getContext && elem.getContext('2d')) {
          const support = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
          window.supportWebP = support
          return support
        }

        return false
      }

      const format = canUseWebP() ? '/format/webp' : ''

      if (options.width && options.width > 0) {
        const width = `/w/${options.width}`
        const mode = options.mode === undefined ? 1 : options.mode
        const height = options.height ? `/h/${options.height}` : mode === 1 ? `/h/${options.width}` : ''

        return `${url}?imageMogr2/auto-orient/strip|imageView2/${mode}${width}${height}${format}`
      }
      return `${url}?imageMogr2/auto-orient/strip${format}`
    }

    Vue.prototype.$eventManager = (function () {
      class Manager {
        constructor () {
          this.id = 0
          this.listeners = {}
        }

        add (ele, evt, handler, capture = false) {
          const events = typeof evt === 'string' ? [evt] : evt
          const result = []
          events.forEach(e => {
            const id = this.id++
            ele.addEventListener(e, handler, capture)
            this.listeners[id] = {
              element: ele,
              event: e,
              handler,
              capture
            }
            result.push(id)
          })
          return result
        }

        del (id) {
          id.forEach(item => {
            if (this.listeners[item]) {
              const h = this.listeners[item]
              h.element.removeEventListener(h.event, h.handler, h.capture)
              Reflect.deleteProperty(this.listeners, item)
            }
          })
        }
      }
      return new Manager()
    }())

    Vue.prototype.$checkInView = (dom, scale = 1) => {
      const rect = dom.getBoundingClientRect()
      return (rect.top < window.innerHeight * scale && rect.bottom > 0) && (rect.left < window.innerWidth * scale && rect.right > 0)
    }
  }
}

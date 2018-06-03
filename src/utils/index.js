import Vue from 'vue'
import env from 'env'
import Alias from '~/assets/js/alias'
import Utils from '~/assets/js/utils'
import ImageLazy from '~/assets/js/imagelazy'
import NoSSR from '~/assets/js/nossr'
import Time from '~/assets/js/timeago'
import MoreBtn from '~/components/common/MoreBtn'
import Drawer from '~/components/common/Drawer'
import Radio from '~/components/common/Radio'
import Post from '~/components/items/Post'
import Select from '~/components/common/Select'
import BangumiPanel from '~/components/panel/BangumiPanel'
import Field from '~/components/common/Field'

import {
  Swipe,
  SwipeItem,
  Picker,
  Switch
} from 'mint-ui'

import {
  Upload
} from 'element-ui'

Vue.use(Upload)
Vue.component(Field.name, Field)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Picker.name, Picker)
Vue.component(ImageLazy.name, ImageLazy)
Vue.component(NoSSR.name, NoSSR)
Vue.component(Time.name, Time)
Vue.component(MoreBtn.name, MoreBtn)
Vue.component(Drawer.name, Drawer)
Vue.component(Radio.name, Radio)
Vue.component(Post.name, Post)
Vue.component(Select.name, Select)
Vue.component(BangumiPanel.name, BangumiPanel)
Vue.component(Switch.name, Switch)

Vue.use({
  install (Vue, options) {
    Vue.prototype.$cdn = env.cdn

    Vue.prototype.$channel = new Vue()

    Vue.prototype.$alias = Alias

    Vue.prototype.$utils = Utils

    Vue.prototype.$siteQR = `${env.cdn.image}owner/site-qr.png`

    Vue.prototype.$resize = (url, options = {}) => {
      if (!url) {
        return ''
      }
      const link = url.match(/^http/) === null ? `${env.cdn.image}${url}` : url
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
      const mode = options.mode === undefined ? 1 : options.mode

      if ((mode === 1 && !options.width) || (!options.width && !options.height)) {
        return `${link}?imageMogr2/auto-orient/strip${format}`
      }

      let width
      let height

      if (mode === 1) {
        width = `/w/${options.width}`
        height = options.height ? `/h/${options.height}` : `/h/${options.width}`
      } else {
        width = options.width ? `/w/${options.width}` : ''
        height = options.height ? `/h/${options.height}` : ''
      }

      return `${link}?imageMogr2/auto-orient/strip|imageView2/${mode}${width}${height}${format}`
    }
  }
})

Vue.mixin({
  methods: {
    $computeImageAspect (image) {
      let width
      let height
      if (typeof image === 'string') {
        if (image.split('|http').length === 1) {
          return 0
        }

        const attr = image.split('|http').shift().split('-')
        width = +attr[0]
        height = +attr[1]
      } else {
        width = image.width
        height = image.height
      }

      if (!width || !height) {
        return 0
      }

      return height / width
    }
  }
})

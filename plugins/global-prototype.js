import Vue from 'vue'
import Alias from '~/assets/js/alias'
import Utils from '~/assets/js/utils'
import resizeImage from '~/assets/js/resizeImage'
import md5 from 'blueimp-md5'

Vue.use({
  install(Vue) {
    Vue.prototype.$md5 = md5

    Vue.prototype.$alias = Alias

    Vue.prototype.$utils = Utils

    Vue.prototype.$resize = resizeImage
  }
})

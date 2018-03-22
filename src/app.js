import Vue from 'vue'
import App from './app.vue'
import '~/assets/css/global'
import { sync } from 'vuex-router-sync'
import { createStore } from '~/store'
import { createRouter } from '~/router'
import '~/utils'
import ImageLazy from '~/assets/js/imagelazy'
import NoSSR from '~/assets/js/nossr'
import Time from '~/assets/js/timeago'
import MoreBtn from '~/components/common/MoreBtn'
import Drawer from '~/components/common/Drawer'
import Radio from '~/components/common/Radio'
import Post from '~/components/items/Post'
import Select from '~/components/common/Select'
import BangumiPanel from '~/components/panel/BangumiPanel'

Vue.component(ImageLazy.name, ImageLazy)
Vue.component(NoSSR.name, NoSSR)
Vue.component(Time.name, Time)
Vue.component(MoreBtn.name, MoreBtn)
Vue.component(Drawer.name, Drawer)
Vue.component(Radio.name, Radio)
Vue.component(Post.name, Post)
Vue.component(Select.name, Select)
Vue.component(BangumiPanel.name, BangumiPanel)

export function createApp () {
  const router = createRouter()
  const store = createStore()

  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}

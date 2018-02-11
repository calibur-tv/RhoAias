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

Vue.component(ImageLazy.name, ImageLazy)
Vue.component(NoSSR.name, NoSSR)
Vue.component(Time.name, Time)

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

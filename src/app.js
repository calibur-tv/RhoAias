import Vue from 'vue'
import App from './app.vue'
import 'assets/css/global.scss'
import { sync } from 'vuex-router-sync'
import { createStore } from './store'
import { createRouter } from './router'
import './utils/mintUI'
import utils from './utils'
import ImageLazy from './utils/imagelazy'

Vue.use(utils)
Vue.component(ImageLazy.name, ImageLazy)

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

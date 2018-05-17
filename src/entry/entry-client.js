import 'es6-promise/auto'
import Vue from 'vue'
import { createApp } from '~/app.js'
import ProgressBar from '~/components/layouts/ProgressBar'
import '~/utils/client'
import Sentry from '~/assets/js/sentry'
import { sentry, env } from 'env'
import FastClick from 'fastclick'

const bar = new Vue(ProgressBar).$mount()

const release = process.env.RELEASE || 'development'
const dev = env === 'development'

document.body.appendChild(bar.$el)

const { app, router, store } = createApp()
const ua = store.state.ua

Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
        ctx: store.state.login ? store.state.user.token : ''
      }).then(next).catch((e) => {
        Vue.prototype.$toast.error(typeof e === 'string' ? e : '网络请求失败，请稍后再试！')
        next(false)
      })
    } else {
      next()
    }
  }
})

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

if (env === 'production') {
  Sentry({
    url: sentry.url,
    version: release
  })
} else if (env === 'staging') {
  // eslint-disable-next-line
  new VConsole()
}

if (!dev && typeof console !== 'undefined') {
  console.log(`Release: ${release}`)
  console.log(`Environment: ${env}`)
}

window.M = window.M || Object.create(null)

router.onReady(() => {
  FastClick.attach(document.body)

  router.beforeResolve(async (to, from, next) => {
    const fullPath = to.fullPath

    if (ua.wechat || ua.qq) {
      // 如果在出发页面已经登录过了，则仍使用路由跳转，需要依赖 store 来判断
      // 如果目标页面是需要用户登录，而出发页面不需要用户登录，则使用页面跳转，而不是路由跳转
      window.location = fullPath
      return next(false)
    }
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)

    if (!asyncDataHooks.length) {
      return next()
    }

    bar.start()

    try {
      await Promise.all(asyncDataHooks.map(hook => hook({
        ctx: store.state.login ? store.state.user.token : '',
        store,
        route: to
      })))
      next()
    } catch (e) {
      Vue.prototype.$toast.error(typeof e === 'string' ? e : '网络请求失败，请稍后再试！')
      next(false)
    } finally {
      bar.finish()
    }
  })

  app.$mount('#app')
})

router.afterEach((to, from) => {
  if (!dev && !(from.name === null && from.fullPath === '/')) {
    _hmt.push(['_trackPageview', to.fullPath]) // eslint-disable-line no-undef
  }
})

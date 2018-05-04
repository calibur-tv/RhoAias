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
    const matched = router.getMatchedComponents(to)
    const asyncDataHooks = matched.map(c => c.asyncData).filter(_ => _)
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
      Vue.prototype.$toast.error('网络请求失败，请稍后再试！')
      next(false)
    } finally {
      bar.finish()
    }
  })

  router.afterEach((to, from) => {
    if (!dev && !(from.name === null && from.fullPath === '/')) {
      _hmt.push(['_trackPageview', to.fullPath]) // eslint-disable-line no-undef
    }
  })

  app.$mount('#app')
})

import 'es6-promise/auto'
import Vue from 'vue'
import { createApp } from '~/app.js'
import ProgressBar from '~/components/layouts/ProgressBar'
import '~/utils/client'
import Sentry from '~/assets/js/sentry'
import { sentry, env } from 'env'
import FastClick from 'fastclick'
import Wechat from '~/assets/js/SDK/wechat'
import QQ from '~/assets/js/SDK/qq'
import resizeImage from '~/assets/js/resizeImage'

const bar = new Vue(ProgressBar).$mount()

const release = process.env.RELEASE || 'development'
const dev = env === 'development'

document.body.appendChild(bar.$el)

const { app, router, store } = createApp()
const ua = store.state.ua

Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
        ctx: store.state.login ? store.state.user.token : ''
      })
        .then(next)
        .catch(e => {
          Vue.prototype.$toast.error(
            typeof e === 'string' ? e : '网络请求失败，请稍后再试！'
          )
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

window.M = window.M || Object.create(null)

if (env !== 'production') {
  // eslint-disable-next-line
  new VConsole()
}

const recorder = new Sentry({
  url: sentry.url,
  version: release,
  env
})

recorder.init()
M.sentry = recorder

if (!dev && typeof console !== 'undefined') {
  console.log(`Release: ${release}`) // eslint-disable-line
  console.log(`Environment: ${env}`) // eslint-disable-line
}

M.shareData = {
  get: () => {
    let ret
    try {
      ret = JSON.parse(
        document.querySelector('script[data-hid=share-data]').text
      )
    } catch (e) {
      ret = {
        title: document.title,
        description:
          document
            .querySelector('[name=description]')
            .getAttribute('content') || 'calibur - 天下漫友是一家',
        imageUrl:
          'http://image.calibur.tv/owner/logo-new/logo.png?imageMogr2/auto-orient/strip|imageView2/1/w/120/h/120'
      }
    }
    return Object.assign(
      {
        link: window.location.href
      },
      ret,
      {
        imageUrl: resizeImage(ret.imageUrl.replace('https:', 'http:'), {
          width: 200,
          share: true
        })
      }
    )
  }
}

if (ua.wechat) {
  const wechat = new Wechat()
  wechat.init()
} else if (ua.qq) {
  const qq = new QQ()
  qq.init()
}

router.onReady(() => {
  FastClick.attach(document.body)

  router.beforeResolve(async (to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c)
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)

    if (!asyncDataHooks.length) {
      return next()
    }

    bar.start()

    try {
      await Promise.all(
        asyncDataHooks.map(hook =>
          hook({
            ctx: store.state.login ? store.state.user.token : '',
            store,
            route: to
          })
        )
      )
      next()
    } catch (e) {
      Vue.prototype.$toast.error(
        typeof e === 'string' ? e : '网络请求失败，请稍后再试！'
      )
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

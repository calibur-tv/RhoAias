import Vue from 'vue'
import NuxtLoading from './components/nuxt-loading.vue'

import '../assets/css/global.scss'

import '../node_modules/normalize.css/normalize.css'

import _6f6c098b from '../layouts/default.vue'
import _77430317 from '../layouts/empty.vue'

const layouts = { "_default": _6f6c098b,"_empty": _77430317 }

export default {
  head: function() {
    const { ua } = this.$store.state
    return {
      title: '天下漫友是一家',
      titleTemplate: titleChunk => {
        return titleChunk || 'calibur - 天下漫友是一家'
      },
      htmlAttrs: {
        lang: 'zh-CN'
      },
      bodyAttrs: {
        id: 'calibur-tv'
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,maximum-scale=1'
        },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
        { name: 'force-rendering', content: 'webkit' },
        {
          hid: 'description',
          name: 'description',
          content: '一个兴趣使然的二次元综合网站'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content:
            'calibur，咖喱棒, 动漫，ACG，二次元，视频，番剧，动画，新番，神作, 排行榜, 贴吧, 盖楼, 应援, 帖子, 在线'
        }
      ],
      link: [
        {
          rel: 'shortcut icon',
          type: 'image/x-icon',
          href: `https://image.calibur.tv/favicon.ico`
        }
      ],
      script: [
        {
          innerHTML: process.env.injectScript.baiduStat,
          type: 'text/javascript',
          async: true
        },
        {
          innerHTML: process.env.injectScript.baiduPush,
          type: 'text/javascript',
          async: true
        },
        ua.ios
          ? { innerHTML: process.env.iPhoneXViewport, type: 'text/javascript' }
          : '',
        ua.qq
          ? {
              src: '//qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js',
              type: 'text/javascript'
            }
          : '',
        ua.wechat
          ? {
              src: '//res2.wx.qq.com/open/js/jweixin-1.4.0.js',
              type: 'text/javascript'
            }
          : ''
      ].filter(_ => _),
      __dangerouslyDisableSanitizers: 'script'
    }
  },

  render(h, props) {
    const loadingEl = h('nuxt-loading', { ref: 'loading' })
    const layoutEl = h(this.layout || 'nuxt')
    const templateEl = h('div', {
      domProps: {
        id: '__layout'
      },
      key: this.layoutName
    }, [ layoutEl ])

    const transitionEl = h('transition', {
      props: {
        name: 'layout',
        mode: 'out-in'
      },
      on: {
        beforeEnter(el) {
          // Ensure to trigger scroll event after calling scrollBehavior
          window.$nuxt.$nextTick(() => {
            window.$nuxt.$emit('triggerScroll')
          })
        }
      }
    }, [ templateEl ])

    return h('div', {
      domProps: {
        id: '__nuxt'
      }
    }, [
      loadingEl,
      transitionEl
    ])
  },
  data: () => ({
    layout: null,
    layoutName: ''
  }),
  beforeCreate() {
    Vue.util.defineReactive(this, 'nuxt', this.$options.nuxt)
  },
  created() {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (typeof window !== 'undefined') {
      window.$nuxt = this
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
  },

  mounted() {
    this.$loading = this.$refs.loading
  },
  watch: {
    'nuxt.err': 'errorChanged'
  },

  methods: {
    errorChanged() {
      if (this.nuxt.err && this.$loading) {
        if (this.$loading.fail) this.$loading.fail()
        if (this.$loading.finish) this.$loading.finish()
      }
    },

    setLayout(layout) {
      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      this.layoutName = layout
      this.layout = layouts['_' + layout]
      return this.layout
    },
    loadLayout(layout) {
      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      return Promise.resolve(layouts['_' + layout])
    }
  },
  components: {
    NuxtLoading
  }
}

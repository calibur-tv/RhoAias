const qiniu = require('./qiniu')
const buildEnv = process.env.NODE_ENV
const isDev = buildEnv === 'development'
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const CompressionPlugin = require('compression-webpack-plugin')
// const BrotliPlugin = require('brotli-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const injectScript = require('./.script')
const SentryPlugin = require('./assets/js/webpack.sentry.plugin.js')
const releaseTag = new Date().toLocaleString()
const baseUrl = require('./.env').baseUrl

module.exports = {
  mode: 'universal',
  env: {
    API_URL: baseUrl.API_URL[buildEnv],
    API_URL_BROWSER: baseUrl.API_URL_BROWSER[buildEnv],
    SENTRY_URL: 'https://63fb1028c6e24cb5be33e8ed64d798e8@sentry.io/1278322',
    RELEASE: releaseTag,
    injectScript
  },
  buildDir: isDev ? '.nuxt-dev' : '.nuxt',
  /*
   ** Headers of the page
   */
  head() {
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

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#f25d8e' },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/global.scss', 'normalize.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios',
    '~/plugins/element-ui',
    '~/plugins/global-prototype',
    '~/plugins/global-component',
    { src: '~/plugins/route-change', ssr: false },
    { src: '~/plugins/client-prototype', ssr: false },
    { src: '~/plugins/client-namespace', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],

  axios: {
    debug: false,
    proxyHeaders: true,
    progress: false
  },

  styleResources: {
    sass: ['./assets/css/variables.scss', './assets/css/mixins.scss']
  },

  /**
   * Global middleware
   */
  router: {
    extendRoutes(routes) {
      for (const route of routes) {
        const props = /:/.test(route.path)
        route.props = props
        if (route.children) {
          for (const item of route.children) {
            item.props = props
          }
        }
      }
      routes.push({
        name: 'error-fallback',
        path: '*',
        component: resolve('pages/error/404.vue')
      })
    }
    // scrollBehavior: function(to, from, savedPosition) {
    //   if (savedPosition) {
    //     return savedPosition
    //   }
    //   let position = { x: 0, y: 0 }
    //   if (to.hash) {
    //     position = { selector: to.hash }
    //   }
    //   return position
    // }
  },

  /*
   ** Build configuration
   */
  build: {
    extend(config, { isDev, isClient }) {
      config.output.filename = '[name].[hash:8].js'
      config.output.chunkFilename = '[name].chunk.[chunkhash:8].js'
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (!isDev && isClient) {
        config.devtool = '#source-map'
      }
    },
    extractCSS: true,
    plugins: (() => {
      const result = [new LodashModuleReplacementPlugin({ shorthands: true })]
      return isDev
        ? result.concat([])
        : result.concat([
            new SentryPlugin({
              project: 'www-xt',
              include: /\.js(\.map)?$/,
              organisation: 'calibur',
              token:
                '5b02ddc4b7894347952d08e1f5563b9c2a845347bb234acf9fedd73210cbbd8b',
              release: releaseTag,
              suppressErrors: !isDev,
              deleteAfterCompile: false,
              filenameTransform: filename => {
                return `~/m/${filename}`
              }
            }),
            new CompressionPlugin({
              test: /\.(js|css|html)$/
            })
            /*
            new BrotliPlugin({
              test: /\.(js|css|html)$/
            })
            */
          ])
    })(),
    loaders: {
      cssModules: {
        localIdentName: '[local]-[hash:base64:2]',
        camelCase: true
      }
    },
    publicPath: isDev ? '/_nuxt/' : `${qiniu.host}${qiniu.key_prefix}`,
    babel: {
      plugins: [
        'babel-plugin-lodash',
        [
          'component',
          {
            libraryName: 'mint-ui',
            style: true
          },
          'mint-ui'
        ],
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          },
          'element-ui'
        ]
      ]
    }
  }
}

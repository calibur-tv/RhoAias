import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _230566b7 = () => interopDefault(import('../pages/bangumi/index.vue' /* webpackChunkName: "pages/bangumi/index" */))
const _6aab045b = () => interopDefault(import('../pages/bangumi/index/news.vue' /* webpackChunkName: "pages/bangumi/index/news" */))
const _baafa26e = () => interopDefault(import('../pages/bangumi/index/timeline.vue' /* webpackChunkName: "pages/bangumi/index/timeline" */))
const _f968a068 = () => interopDefault(import('../pages/bangumi/index/tags/_id.vue' /* webpackChunkName: "pages/bangumi/index/tags/_id" */))
const _14b8625d = () => interopDefault(import('../pages/search.vue' /* webpackChunkName: "pages/search" */))
const _0b169f6d = () => interopDefault(import('../pages/world.vue' /* webpackChunkName: "pages/world" */))
const _7b372030 = () => interopDefault(import('../pages/world/index.vue' /* webpackChunkName: "pages/world/index" */))
const _3f2e7690 = () => interopDefault(import('../pages/world/pins.vue' /* webpackChunkName: "pages/world/pins" */))
const _f5aba69c = () => interopDefault(import('../pages/world/post.vue' /* webpackChunkName: "pages/world/post" */))
const _d69ff482 = () => interopDefault(import('../pages/world/qaq.vue' /* webpackChunkName: "pages/world/qaq" */))
const _50bff8ea = () => interopDefault(import('../pages/world/review.vue' /* webpackChunkName: "pages/world/review" */))
const _ece0cb2a = () => interopDefault(import('../pages/about/hello.vue' /* webpackChunkName: "pages/about/hello" */))
const _0adc80ab = () => interopDefault(import('../pages/app/download.vue' /* webpackChunkName: "pages/app/download" */))
const _61e3dd28 = () => interopDefault(import('../pages/app/feedback.vue' /* webpackChunkName: "pages/app/feedback" */))
const _a54a880a = () => interopDefault(import('../pages/app/handbook.vue' /* webpackChunkName: "pages/app/handbook" */))
const _1474b528 = () => interopDefault(import('../pages/app/invite.vue' /* webpackChunkName: "pages/app/invite" */))
const _217abe17 = () => interopDefault(import('../pages/app/report.vue' /* webpackChunkName: "pages/app/report" */))
const _652e76c8 = () => interopDefault(import('../pages/callback/auth-error.vue' /* webpackChunkName: "pages/callback/auth-error" */))
const _5480d568 = () => interopDefault(import('../pages/callback/auth-redirect.vue' /* webpackChunkName: "pages/callback/auth-redirect" */))
const _0bfc8543 = () => interopDefault(import('../pages/callback/auth-success.vue' /* webpackChunkName: "pages/callback/auth-success" */))
const _255890e8 = () => interopDefault(import('../pages/error/404.vue' /* webpackChunkName: "pages/error/404" */))
const _6307f3b2 = () => interopDefault(import('../pages/my/invite.vue' /* webpackChunkName: "pages/my/invite" */))
const _16b57aee = () => interopDefault(import('../pages/my/notification.vue' /* webpackChunkName: "pages/my/notification" */))
const _55fc68a2 = () => interopDefault(import('../pages/my/setting.vue' /* webpackChunkName: "pages/my/setting" */))
const _d0988024 = () => interopDefault(import('../pages/review/create.vue' /* webpackChunkName: "pages/review/create" */))
const _899ef50e = () => interopDefault(import('../pages/role/trending.vue' /* webpackChunkName: "pages/role/trending" */))
const _86774a2a = () => interopDefault(import('../pages/about/invite/_id.vue' /* webpackChunkName: "pages/about/invite/_id" */))
const _48b185e6 = () => interopDefault(import('../pages/app/notice/_id.vue' /* webpackChunkName: "pages/app/notice/_id" */))
const _5b5baadf = () => interopDefault(import('../pages/bangumi/_id.vue' /* webpackChunkName: "pages/bangumi/_id" */))
const _36ce4e22 = () => interopDefault(import('../pages/bangumi/_id/index.vue' /* webpackChunkName: "pages/bangumi/_id/index" */))
const _c8e36e84 = () => interopDefault(import('../pages/bangumi/_id/cartoon.vue' /* webpackChunkName: "pages/bangumi/_id/cartoon" */))
const _4c3e7b44 = () => interopDefault(import('../pages/bangumi/_id/pins.vue' /* webpackChunkName: "pages/bangumi/_id/pins" */))
const _1fdc7880 = () => interopDefault(import('../pages/bangumi/_id/post.vue' /* webpackChunkName: "pages/bangumi/_id/post" */))
const _4883ef9e = () => interopDefault(import('../pages/bangumi/_id/qaq.vue' /* webpackChunkName: "pages/bangumi/_id/qaq" */))
const _080e8938 = () => interopDefault(import('../pages/bangumi/_id/review.vue' /* webpackChunkName: "pages/bangumi/_id/review" */))
const _3a4cf554 = () => interopDefault(import('../pages/bangumi/_id/role.vue' /* webpackChunkName: "pages/bangumi/_id/role" */))
const _9339856a = () => interopDefault(import('../pages/bangumi/_id/video.vue' /* webpackChunkName: "pages/bangumi/_id/video" */))
const _1d4aa65b = () => interopDefault(import('../pages/pin/_id.vue' /* webpackChunkName: "pages/pin/_id" */))
const _457137c0 = () => interopDefault(import('../pages/post/_id.vue' /* webpackChunkName: "pages/post/_id" */))
const _669dc5b2 = () => interopDefault(import('../pages/qaq/_id.vue' /* webpackChunkName: "pages/qaq/_id" */))
const _11d61b38 = () => interopDefault(import('../pages/review/_id.vue' /* webpackChunkName: "pages/review/_id" */))
const _12602cd4 = () => interopDefault(import('../pages/role/_id.vue' /* webpackChunkName: "pages/role/_id" */))
const _2ffec554 = () => interopDefault(import('../pages/soga/_id.vue' /* webpackChunkName: "pages/soga/_id" */))
const _583bf008 = () => interopDefault(import('../pages/user/_zone.vue' /* webpackChunkName: "pages/user/_zone" */))
const _546fa17f = () => interopDefault(import('../pages/user/_zone/index.vue' /* webpackChunkName: "pages/user/_zone/index" */))
const _391080f4 = () => interopDefault(import('../pages/user/_zone/bangumi.vue' /* webpackChunkName: "pages/user/_zone/bangumi" */))
const _5e5355a0 = () => interopDefault(import('../pages/user/_zone/mark.vue' /* webpackChunkName: "pages/user/_zone/mark" */))
const _ad6de13e = () => interopDefault(import('../pages/user/_zone/pins.vue' /* webpackChunkName: "pages/user/_zone/pins" */))
const _217674fa = () => interopDefault(import('../pages/user/_zone/post.vue' /* webpackChunkName: "pages/user/_zone/post" */))
const _7d32e264 = () => interopDefault(import('../pages/user/_zone/qaq.vue' /* webpackChunkName: "pages/user/_zone/qaq" */))
const _c2d0bd0a = () => interopDefault(import('../pages/user/_zone/review.vue' /* webpackChunkName: "pages/user/_zone/review" */))
const _9b7c5b4e = () => interopDefault(import('../pages/user/_zone/role.vue' /* webpackChunkName: "pages/user/_zone/role" */))
const _592f6e81 = () => interopDefault(import('../pages/video/_id.vue' /* webpackChunkName: "pages/video/_id" */))
const _cfefe6a6 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

const scrollBehavior = function(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      let position = { x: 0, y: 0 }
      if (to.hash) {
        position = { selector: to.hash }
      }
      return position
    }

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/bangumi",
      component: _230566b7,
      props: false,
      name: "bangumi",
      children: [{
        path: "news",
        component: _6aab045b,
        props: false,
        name: "bangumi-index-news"
      }, {
        path: "timeline",
        component: _baafa26e,
        props: false,
        name: "bangumi-index-timeline"
      }, {
        path: "tags/:id?",
        component: _f968a068,
        props: false,
        name: "bangumi-index-tags-id"
      }]
    }, {
      path: "/search",
      component: _14b8625d,
      props: false,
      name: "search"
    }, {
      path: "/world",
      component: _0b169f6d,
      props: false,
      children: [{
        path: "",
        component: _7b372030,
        props: false,
        name: "world"
      }, {
        path: "pins",
        component: _3f2e7690,
        props: false,
        name: "world-pins"
      }, {
        path: "post",
        component: _f5aba69c,
        props: false,
        name: "world-post"
      }, {
        path: "qaq",
        component: _d69ff482,
        props: false,
        name: "world-qaq"
      }, {
        path: "review",
        component: _50bff8ea,
        props: false,
        name: "world-review"
      }]
    }, {
      path: "/about/hello",
      component: _ece0cb2a,
      props: false,
      name: "about-hello"
    }, {
      path: "/app/download",
      component: _0adc80ab,
      props: false,
      name: "app-download"
    }, {
      path: "/app/feedback",
      component: _61e3dd28,
      props: false,
      name: "app-feedback"
    }, {
      path: "/app/handbook",
      component: _a54a880a,
      props: false,
      name: "app-handbook"
    }, {
      path: "/app/invite",
      component: _1474b528,
      props: false,
      name: "app-invite"
    }, {
      path: "/app/report",
      component: _217abe17,
      props: false,
      name: "app-report"
    }, {
      path: "/callback/auth-error",
      component: _652e76c8,
      props: false,
      name: "callback-auth-error"
    }, {
      path: "/callback/auth-redirect",
      component: _5480d568,
      props: false,
      name: "callback-auth-redirect"
    }, {
      path: "/callback/auth-success",
      component: _0bfc8543,
      props: false,
      name: "callback-auth-success"
    }, {
      path: "/error/404",
      component: _255890e8,
      props: false,
      name: "error-404"
    }, {
      path: "/my/invite",
      component: _6307f3b2,
      props: false,
      name: "my-invite"
    }, {
      path: "/my/notification",
      component: _16b57aee,
      props: false,
      name: "my-notification"
    }, {
      path: "/my/setting",
      component: _55fc68a2,
      props: false,
      name: "my-setting"
    }, {
      path: "/review/create",
      component: _d0988024,
      props: false,
      name: "review-create"
    }, {
      path: "/role/trending",
      component: _899ef50e,
      props: false,
      name: "role-trending"
    }, {
      path: "/about/invite/:id?",
      component: _86774a2a,
      props: true,
      name: "about-invite-id"
    }, {
      path: "/app/notice/:id?",
      component: _48b185e6,
      props: true,
      name: "app-notice-id"
    }, {
      path: "/bangumi/:id",
      component: _5b5baadf,
      props: true,
      children: [{
        path: "",
        component: _36ce4e22,
        props: true,
        name: "bangumi-id"
      }, {
        path: "cartoon",
        component: _c8e36e84,
        props: true,
        name: "bangumi-id-cartoon"
      }, {
        path: "pins",
        component: _4c3e7b44,
        props: true,
        name: "bangumi-id-pins"
      }, {
        path: "post",
        component: _1fdc7880,
        props: true,
        name: "bangumi-id-post"
      }, {
        path: "qaq",
        component: _4883ef9e,
        props: true,
        name: "bangumi-id-qaq"
      }, {
        path: "review",
        component: _080e8938,
        props: true,
        name: "bangumi-id-review"
      }, {
        path: "role",
        component: _3a4cf554,
        props: true,
        name: "bangumi-id-role"
      }, {
        path: "video",
        component: _9339856a,
        props: true,
        name: "bangumi-id-video"
      }]
    }, {
      path: "/pin/:id?",
      component: _1d4aa65b,
      props: true,
      name: "pin-id"
    }, {
      path: "/post/:id?",
      component: _457137c0,
      props: true,
      name: "post-id"
    }, {
      path: "/qaq/:id?",
      component: _669dc5b2,
      props: true,
      name: "qaq-id"
    }, {
      path: "/review/:id?",
      component: _11d61b38,
      props: true,
      name: "review-id"
    }, {
      path: "/role/:id?",
      component: _12602cd4,
      props: true,
      name: "role-id"
    }, {
      path: "/soga/:id?",
      component: _2ffec554,
      props: true,
      name: "soga-id"
    }, {
      path: "/user/:zone?",
      component: _583bf008,
      props: true,
      children: [{
        path: "",
        component: _546fa17f,
        props: true,
        name: "user-zone"
      }, {
        path: "bangumi",
        component: _391080f4,
        props: true,
        name: "user-zone-bangumi"
      }, {
        path: "mark",
        component: _5e5355a0,
        props: true,
        name: "user-zone-mark"
      }, {
        path: "pins",
        component: _ad6de13e,
        props: true,
        name: "user-zone-pins"
      }, {
        path: "post",
        component: _217674fa,
        props: true,
        name: "user-zone-post"
      }, {
        path: "qaq",
        component: _7d32e264,
        props: true,
        name: "user-zone-qaq"
      }, {
        path: "review",
        component: _c2d0bd0a,
        props: true,
        name: "user-zone-review"
      }, {
        path: "role",
        component: _9b7c5b4e,
        props: true,
        name: "user-zone-role"
      }]
    }, {
      path: "/video/:id?",
      component: _592f6e81,
      props: true,
      name: "video-id"
    }, {
      path: "/",
      component: _cfefe6a6,
      props: false,
      name: "index"
    }, {
      path: "*",
      component: _255890e8,
      name: "error-fallback"
    }],

    fallback: false
  })
}

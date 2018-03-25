import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta, {
  keyName: 'head',
  attribute: 'data-n-head',
  ssrAttribute: 'data-n-head-ssr',
  tagIDKeyName: 'hid'
})

export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
    routes: [
      {
        path: '/',
        component: () => import('~/layouts/default'),
        children: [
          {
            path: '',
            name: 'homepage',
            component: () => import('~/views/index')
          },
          {
            path: 'bangumi/:id(\\d+)',
            name: 'bangumi-show',
            component: () => import('~/views/bangumi/show')
          },
          {
            path: 'bangumi/timeline',
            name: 'bangumi-timeline',
            component: () => import('~/views/bangumi/time')
          },
          {
            path: 'bangumi/news',
            name: 'bangumi-news',
            component: () => import('~/views/bangumi/news')
          },
          {
            path: 'bangumi/tags/:id?',
            name: 'bangumi-tags',
            component: () => import('~/views/bangumi/tags')
          },
          {
            path: 'user/:slug',
            name: 'user-show',
            component: () => import('~/views/user/show')
          },
          {
            path: 'post/:id(\\d+)',
            name: 'post-show',
            component: () => import('~/views/post/show')
          },
          {
            path: 'notification/list',
            name: 'notification-list',
            component: () => import('~/views/notification/list')
          },
          {
            path: 'about/hello',
            name: 'hello',
            component: () => import('~/views/about/hello')
          },
          {
            path: 'me/setting',
            name: 'user-setting',
            component: () => import('~/views/user/setting')
          },
          {
            path: 'video/:id(\\d+)',
            component: () => import('~/views/video/show')
          },
          {
            path: 'trending/role',
            component: () => import('~/views/role/trending')
          }
        ]
      },
      {
        path: '/campaign',
        component: () => import('~/layouts/empty'),
        children: [
          {
            path: 'canvas',
            component: () => import('~/views/campaign/canvas')
          }
        ]
      }
    ]
  })
}

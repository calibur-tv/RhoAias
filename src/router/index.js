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
            path: 'bangumi/timeline',
            name: 'bangumi-time',
            component: () => import('~/views/bangumi/time')
          },
          {
            path: 'bangumi/:id(\\d+)',
            name: 'bangumi-show',
            component: () => import('~/views/bangumi/show')
          },
          {
            path: 'user/:slug',
            name: 'user-show',
            component: () => import('~/views/user/show')
          },
          {
            path: 'post/:id(\\d+)',
            name: '帖子',
            component: () => import('~/views/post/show')
          }
        ]
      }
    ]
  })
}

<template>
  <div id="app">
    <router-view></router-view>
    <sign-drawer></sign-drawer>
  </div>
</template>

<script>
  import { qiniu, script } from 'env'
  import SignDrawer from '~/components/common/Sign'

  export default {
    name: 'Entry',
    head: {
      title: '天下漫友是一家',
      titleTemplate: '%s - calibur',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      bodyAttrs: '',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'renderer', content: 'webkit' },
        { hid: 'description', name: 'description', content: '一个兴趣使然的二次元综合网站' },
        { hid: 'keywords', name: 'keywords', content: 'calibur，咖喱棒, 动漫，ACG，二次元，视频，番剧，动画，新番，神作, 排行榜, 贴吧, 盖楼, 应援, 帖子, 在线' }
      ],
      link: [
        { rel: 'shortcut icon', type: 'image/x-icon', href: `${qiniu.host}/favicon.ico` }
      ],
      script: [
        { innerHTML: script.baiduStat, type: 'text/javascript' },
        { innerHTML: script.baiduPush, type: 'text/javascript' }
      ],
      __dangerouslyDisableSanitizers: 'script'
    },
    components: {
      SignDrawer
    },
    mounted () {
      if (this.$store.state.login) {
        this.$store.dispatch('getNotification', this)
        this.$cookie.set('JWT-TOKEN', this.$store.state.user.token)
      }
    }
  }
</script>

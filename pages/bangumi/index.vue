<template>
  <div id="bangumi-index-layout">
    <VueLayoutTab :headers="headers" :routable="true" align="center" />
    <nuxt-child />
  </div>
</template>

<script>
import VueLayoutTab from 'vue-layout-tab'

export default {
  name: 'BangumiIndexLayout',
  components: {
    VueLayoutTab
  },
  data() {
    return {
      headers: [
        {
          label: '新番放送',
          route: 'bangumi-index-news'
        },
        {
          label: '时间轴',
          route: 'bangumi-index-timeline'
        },
        {
          label: '动画标签',
          route: 'bangumi-index-tags-id'
        }
      ]
    }
  }
}
</script>

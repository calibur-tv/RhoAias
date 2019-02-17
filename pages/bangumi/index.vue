<template>
  <div id="bangumi-index-layout">
    <tab-container
      :headers="headers"
      :router="true"
    />
    <nuxt-child />
  </div>
</template>

<script>
import TabContainer from '~/components/common/TabContainer'

export default {
  name: 'BangumiIndexLayout',
  components: {
    TabContainer
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

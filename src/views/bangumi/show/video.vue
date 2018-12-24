<template>
  <bangumi-video-flow/>
</template>

<script>
import BangumiVideoFlow from '~/components/bangumi/flows/BangumiVideoFlow'

export default {
  name: 'BangumiVideo',
  async asyncData({ route, store, ctx }) {
    await store.dispatch('bangumi/getVideos', {
      ctx,
      id: route.params.id
    })
  },
  components: {
    BangumiVideoFlow
  }
}
</script>

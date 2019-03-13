<template>
  <div id="bangumi-image-flow">
    <FlowList :id="id" func="getBangumiImage" type="seenIds" sort="active">
      <ImageWaterfallFlow slot-scope="{ flow }" :bangumi-id="id" :list="flow" />
    </FlowList>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import ImageWaterfallFlow from '~/components/image/ImageWaterfallFlow'

export default {
  name: 'BangumiImageFlow',
  components: {
    FlowList,
    ImageWaterfallFlow
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      id: params.id,
      func: 'getBangumiImage',
      type: 'seenIds',
      sort: 'active'
    })
  }
}
</script>

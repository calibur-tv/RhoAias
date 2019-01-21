<template>
  <flow-list
    :id="zone"
    func="getUserImage"
    type="page"
    sort="news"
  >
    <image-waterfall-flow
      slot-scope="{ flow }"
      :list="flow"
      :user-zone="zone"
      bangumi-id=""
    />
  </flow-list>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import ImageWaterfallFlow from '~/components/image/ImageWaterfallFlow'

export default {
  name: 'UserImage',
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getUserImage',
      type: 'page',
      sort: 'news',
      id: params.zone
    })
  },
  components: {
    FlowList,
    ImageWaterfallFlow
  },
  props: {
    zone: {
      type: String,
      required: true
    }
  }
}
</script>

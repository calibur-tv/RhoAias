<template>
  <div>
    <flow-list 
      func="getWorldImage" 
      type="seenIds" 
      sort="active">
      <image-waterfall-flow
        slot-scope="{ flow }"
        :list="flow"
      />
      <no-content slot="nothing" />
    </flow-list>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import ImageWaterfallFlow from '~/components/image/ImageWaterfallFlow'

export default {
  name: 'ImageFlowList',
  components: {
    FlowList,
    ImageWaterfallFlow
  },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('flow/initData', {
        func: 'getWorldImage',
        type: 'seenIds',
        sort: 'active'
      })
      // store.dispatch('flow/getMeta', { type: 'image' })
    ])
  },
  head: {
    title: '相册区'
  },
  data() {
    return {
      // flowType: 'image'
    }
  },
  methods: {
    // openCreateImageModal() {
    //   if (this.$store.state.login) {
    //     this.$channel.$emit('open-create-image-drawer')
    //   } else {
    //     this.$channel.$emit('sign-in')
    //   }
    // }
  }
}
</script>

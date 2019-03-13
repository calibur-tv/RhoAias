<style lang="scss">
#post-world {
  .img {
    background-color: RGB(60, 134, 247);
  }
}
</style>

<template>
  <FlowList func="getWorldPost" type="seenIds" sort="active">
    <ul slot-scope="{ flow }">
      <PostFlowItem v-for="item in flow" :key="item.id" :item="item" />
    </ul>
    <no-content slot="nothing" />
  </FlowList>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import PostFlowItem from '~/components/flow/item/PostFlowItem'

export default {
  name: 'PostFlowList',
  components: {
    FlowList,
    PostFlowItem
  },
  data() {
    return {
      showTips: false
    }
  },
  computed: {
    // meta() {
    //   return this.$store.state.flow.post.meta
    // }
  },
  async asyncData(ctx) {
    await Promise.all([
      ctx.store.dispatch('flow/initData', {
        func: 'getWorldPost',
        type: 'seenIds',
        sort: 'active'
      })
      // store.dispatch('flow/getMeta', { type: 'post' })
    ])
  },
  head: {
    title: '帖子区'
  },
  methods: {
    // openCreatePost() {
    //   if (!this.$store.state.login) {
    //     this.$channel.$emit('sign-in')
    //     return
    //   }
    //   this.$channel.$emit('drawer-open-write-post')
    // }
  }
}
</script>

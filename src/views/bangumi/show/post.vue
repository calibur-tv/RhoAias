<template>
  <post-flow-list
    v-if="info"
    :bangumi-id="info.id"
    :bangumi-name="info.name"
  />
</template>

<script>
import PostFlowList from '~/components/flow/list/PostFlowList'

export default {
  name: 'BangumiPost',
  async asyncData({ route, store, ctx }) {
    const id = route.params.id
    await Promise.all([
      store.dispatch('bangumi/getTopPosts', { ctx, id }),
      store.dispatch('flow/initData', {
        type: 'post',
        sort: 'active',
        bangumiId: id,
        ctx
      })
    ])
  },
  components: {
    PostFlowList
  },
  computed: {
    info() {
      return this.$store.state.bangumi.info
    }
  }
}
</script>

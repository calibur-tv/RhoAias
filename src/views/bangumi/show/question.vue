<template>
  <question-flow-list
    v-if="info"
    :bangumi-id="info.id"
    :bangumi-name="info.name"
  />
</template>

<script>
import QuestionFlowList from '~/components/flow/list/QuestionFlowList'

export default {
  name: 'BangumiQuestion',
  async asyncData({ store, route, ctx }) {
    await store.dispatch('flow/initData', {
      type: 'question',
      sort: 'active',
      bangumiId: route.params.id,
      ctx
    })
  },
  components: {
    QuestionFlowList
  },
  computed: {
    info() {
      return this.$store.state.bangumi.info
    }
  }
}
</script>

<template>
  <FlowList func="getWorldQAQ" type="seenIds" sort="active">
    <ul slot-scope="{ flow }">
      <QuestionFlowItem
        v-for="item in flow"
        :key="item.id"
        :item="item"
        bangumi-id=""
        user-zone=""
      />
    </ul>
    <no-content slot="nothing" />
  </FlowList>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import QuestionFlowItem from '~/components/flow/item/QuestionFlowItem'

export default {
  name: 'QuestionFlowList',
  components: {
    FlowList,
    QuestionFlowItem
  },
  data() {
    return {}
  },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('flow/initData', {
        func: 'getWorldQAQ',
        type: 'seenIds',
        sort: 'active'
      })
      // store.dispatch('flow/getMeta', { type: 'question' })
    ])
  },
  head: {
    title: '问答区'
  },
  methods: {
    openCreateQAQModal() {
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      this.$channel.$emit('drawer-open-write-question')
    }
  }
}
</script>

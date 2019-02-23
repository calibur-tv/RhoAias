<template>
  <flow-list func="getWorldScore" type="seenIds" sort="active">
    <ul slot-scope="{ flow }">
      <score-flow-item
        v-for="item in flow"
        :key="item.id"
        :item="item"
        :bangumi-id="0"
        user-zone=""
      />
    </ul>
    <no-content slot="nothing" />
  </flow-list>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import ScoreFlowItem from '~/components/flow/item/ScoreFlowItem'

export default {
  name: 'ScoreFlowList',
  components: {
    FlowList,
    ScoreFlowItem
  },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('flow/initData', {
        func: 'getWorldScore',
        type: 'seenIds',
        sort: 'active'
      })
    ])
  },
  head: {
    title: '漫评区'
  }
}
</script>

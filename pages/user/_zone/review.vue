<template>
  <FlowList :id="zone" func="getUserScore" type="page" sort="news">
    <ul slot-scope="{ flow }">
      <ScoreFlowItem
        v-for="item in flow"
        :key="item.id"
        :item="item"
        :user-zone="zone"
        bangumi-id=""
      />
    </ul>
  </FlowList>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import ScoreFlowItem from '~/components/flow/item/ScoreFlowItem'

export default {
  name: 'UserScore',
  components: {
    FlowList,
    ScoreFlowItem
  },
  props: {
    zone: {
      type: String,
      required: true
    }
  },
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getUserScore',
      type: 'page',
      sort: 'news',
      id: params.zone
    })
  }
}
</script>

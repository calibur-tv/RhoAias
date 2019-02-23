<template>
  <flow-list
    :id="id"
    func="virtualIdolList"
    type="seenIds"
    sort="bangumi-activity-1"
  >
    <ul slot-scope="{ flow }">
      <virtual-idol-item
        v-for="item in flow"
        :key="item.id"
        :item="item"
        sort="bangumi"
      />
    </ul>
  </flow-list>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import VirtualIdolItem from '~/components/idol/VirtualIdolItem'

export default {
  name: 'BangumiCartoonRole',
  components: {
    FlowList,
    VirtualIdolItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'virtualIdolList',
      type: 'seenIds',
      sort: 'bangumi-activity-1',
      id: params.id
    })
  }
}
</script>

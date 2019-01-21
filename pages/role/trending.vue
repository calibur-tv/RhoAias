<template>
  <div id="trending-role">
    <flow-list
      func="getRoleTrending"
      type="seenIds"
      sort="hot"
    >
      <ul 
        slot-scope="{ flow }" 
        class="container">
        <cartoon-role-flow-item
          v-for="(item, index) in flow"
          :key="item.id"
          :item="item"
          :index="index"
          bangumi-id=""
          user-zone=""
        />
      </ul>
    </flow-list>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import CartoonRoleFlowItem from '~/components/flow/item/CartoonRoleFlowItem'

export default {
  name: 'TrendingRole',
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('flow/initData', {
        func: 'getRoleTrending',
        type: 'seenIds',
        sort: 'hot'
      })
    ])
  },
  head: {
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: '动漫角色排行榜'
      }
    ]
  },
  components: {
    FlowList,
    CartoonRoleFlowItem
  }
}
</script>

<style lang="scss">
</style>

<template>
  <div id="role-trending-product">
    <FlowList :id="0" func="getIdolProducts" type="lastId" sort="news">
      <ul slot-scope="{ flow }">
        <PostFlowItem
          v-for="item in flow"
          :key="item.id"
          :item="item"
          bangumi-id=""
          user-zone=""
        />
      </ul>
    </FlowList>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import PostFlowItem from '~/components/flow/item/PostFlowItem'

export default {
  name: 'RoleTrendingProduct',
  components: {
    FlowList,
    PostFlowItem
  },
  async asyncData({ store }) {
    await store.dispatch('flow/initData', {
      func: 'getIdolProducts',
      type: 'lastId',
      sort: 'news',
      id: 0
    })
  }
}
</script>

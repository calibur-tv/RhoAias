<template>
  <flow-list
    :id="zone"
    func="getUserRole"
    type="page"
    sort="news"
  >
    <ul
      slot-scope="{ flow }"
      class="container"
    >
      <cartoon-role-flow-item
        v-for="item in flow"
        :key="item.id"
        :item="item"
        :user-zone="zone"
        bangumi-id=""
      />
    </ul>
  </flow-list>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import CartoonRoleFlowItem from '~/components/flow/item/CartoonRoleFlowItem'

export default {
  name: 'UserCartoonRole',
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getUserRole',
      type: 'page',
      sort: 'news',
      id: params.zone
    })
  },
  components: {
    FlowList,
    CartoonRoleFlowItem
  },
  props: {
    zone: {
      type: String,
      required: true
    }
  }
}
</script>

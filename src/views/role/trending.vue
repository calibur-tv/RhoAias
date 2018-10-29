<template>
  <div id="trending-role">
    <cartoon-role-flow-list/>
  </div>
</template>

<script>
import CartoonRoleFlowList from "~/components/flow/list/CartoonRoleFlowList";

export default {
  name: "TrendingRole",
  async asyncData({ store, ctx }) {
    await store.dispatch("world/initData", {
      type: "role",
      sort: "hot",
      ctx
    });
  },
  head: {
    meta: [
      {
        hid: "description",
        name: "description",
        content: "动漫角色排行榜"
      }
    ]
  },
  components: {
    CartoonRoleFlowList
  }
};
</script>

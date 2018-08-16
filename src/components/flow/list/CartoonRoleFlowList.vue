<template>
  <div id="cartoon-role-flow-list">
    <ul class="container">
      <cartoon-role-flow-item
        v-for="(item, index) in roles"
        :index="index"
        :key="item.id"
        :item="item"
        :bangumi-id="bangumiId"
        :user-zone="userZone"
      />
    </ul>
    <more-btn
      :no-more="source.noMore"
      :loading="source.loading"
      :length="roles.length"
      @fetch="loadMore"
    >
      <a
        v-if="isMe"
        :href="$alias.roleTrending"
      >
        <button>查看角色列表</button>
      </a>
      <button
        v-if="bangumiId"
        @click="openFeedbackForRole"
      >求偶像</button>
    </more-btn>
  </div>
</template>

<script>
import flowMixin from "./_flowListMixin";
import CartoonRoleFlowItem from "../item/CartoonRoleFlowItem";

export default {
  name: "CartoonRoleFlowList",
  components: {
    CartoonRoleFlowItem
  },
  mixins: [flowMixin],
  data() {
    return {
      flowType: "role"
    };
  },
  computed: {
    roles() {
      if (this.userZone) {
        return this.source.list;
      }
      return this.$utils.orderBy(this.source.list, "star_count", "desc");
    }
  },
  methods: {
    openFeedbackForRole() {
      this.$channel.$emit("open-feedback", {
        type: 6,
        desc: `我想要为《${this.info.name}》的 ? 应援`
      });
    }
  }
};
</script>

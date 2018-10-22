<style lang="scss">
#cartoon-role-flow-list {
  .request-cartoon-role-btn {
    text-align: center;

    button {
      margin-top: 35px;
      margin-bottom: 50px;
      @include btn-empty(#333);
    }
  }
}
</style>

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
    <div
      v-if="source.noMore && !source.loading && roles.length && bangumiId"
      class="request-cartoon-role-btn"
    >
      <button
        class="request-cartoon-role-btn"
        @click="openFeedbackForRole"
      >没有你喜欢的角色？</button>
    </div>
    <more-btn
      v-else
      :no-more="source.noMore"
      :loading="source.loading"
      :length="roles.length"
      :auto="true"
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
      >没有你喜欢的角色？</button>
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
      // eslint-disable-next-line
      return this.source.list.sort((a, b) => b.star_count - a.star_count);
    }
  },
  methods: {
    openFeedbackForRole() {
      this.$channel.$emit("open-feedback", {
        type: 6,
        desc: `我想要为《${this.bangumiName}》的 {?} 应援`,
        placeholder: "请填写你想要的角色"
      });
    }
  }
};
</script>

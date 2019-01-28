<style lang="scss" scoped>
.align-center {
  text-align: center;
}
.h-175 {
  height: 175px;
}
.look-for-role-btn {
  margin: 10px auto 20px;
  width: 200px;
}
</style>

<template>
  <flow-list
    :id="id"
    func="getBangumiRole"
    type="seenIds"
    sort="hot"
    class="container"
  >
    <ul slot-scope="{ flow }">
      <cartoon-role-flow-item
        v-for="item in flow"
        :key="item.id"
        :item="item"
        :bangumi-id="id"
        user-zone=""
      />
    </ul>
    <div 
      slot="nothing" 
      class="align-center">
      <div 
        class="state-nothing h-175">
        <img
          src="~assets/img/no-content.png"
          alt="no-content"
        >
        <span>这里什么都没有</span>
      </div>
      <el-button
        type="primary"
        class="look-for-role-btn"
        round
        @click="openFeedback"
      >求偶像</el-button>
    </div>
    <div 
      slot="no-more"
      class="align-center">
      <el-button
        type="primary"
        class="look-for-role-btn"
        round
        @click="openFeedback"
      >求偶像</el-button>
    </div>
  </flow-list>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import CartoonRoleFlowItem from '~/components/flow/item/CartoonRoleFlowItem'

export default {
  name: 'BangumiCartoonRole',
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getBangumiRole',
      type: 'seenIds',
      sort: 'hot',
      id: params.id
    })
  },
  components: {
    FlowList,
    CartoonRoleFlowItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    openFeedback() {
      this.$channel.$emit('open-feedback', {
        type: 6,
        desc: `我想要为 {?} 应援`,
        placeholder: '请填写要应援的偶像'
      })
    }
  }
}
</script>

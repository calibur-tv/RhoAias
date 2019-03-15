<style lang="scss">
#idol-product-area {
  margin-left: -$container-padding;
  margin-right: -$container-padding;
}
</style>

<template>
  <div id="idol-product-area">
    <FlowList :id="idolId" func="getIdolProducts" type="lastId" sort="news">
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
  name: 'IdolProductArea',
  components: {
    FlowList,
    PostFlowItem
  },
  props: {
    idolId: {
      type: String,
      required: true
    },
    state: {
      type: Number,
      required: true
    }
  }
}
</script>

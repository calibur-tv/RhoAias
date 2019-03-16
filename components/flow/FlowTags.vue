<style lang="scss">
.flow-tags {
  height: 25px;
  overflow: hidden;
  font-size: 0;
}
</style>

<template>
  <div class="flow-tags">
    <BubbleTag v-if="bangumi" :text="bangumi.name">
      <img slot="icon" src="~assets/img/bangumi-icon.png">
    </BubbleTag>
    <BubbleTag v-if="idol" :text="idol.name">
      <img slot="icon" src="~assets/img/bangumi-icon.png">
    </BubbleTag>
    <template v-else>
      <BubbleTag v-for="item in tags" :key="item.id" :text="item.name" />
    </template>
  </div>
</template>

<script>
import BubbleTag from '~/components/common/BubbleTag'

export default {
  name: 'FlowTags',
  components: {
    BubbleTag
  },
  props: {
    bangumi: {
      type: Object,
      default: null
    },
    idol: {
      type: Object,
      default: null
    },
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>

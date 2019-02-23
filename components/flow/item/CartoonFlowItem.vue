<template>
  <li class="cartoon">
    <nuxt-link :to="$alias.image(item.id)">
      <div class="poster-wrap">
        <img :src="$resize(item.source.url, { width: 290, height: 420 })" />
        <div class="info">
          <i class="el-icon-picture-outline" />
          <span class="image-count" v-text="item.image_count" />
        </div>
      </div>
      <div class="intro">
        <p class="name oneline">【 {{ item.part }} 】{{ item.name }}</p>
      </div>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: 'CartoonFlowItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    bangumiId: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {}
  }
}
</script>

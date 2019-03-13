<style lang="scss">
.video-flow-item {
  margin-bottom: 15px;

  a {
    display: block;
    width: 100%;
    height: 80px;
    @extend %clearfix;
  }

  &:first-child {
    margin-top: $container-padding;
  }

  .poster {
    margin-right: 10px;
    border-radius: 5px;
    float: left;
  }

  .intro {
    overflow: hidden;

    .part {
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 5px;
    }

    .name {
      @include twoline(18px);
    }
  }
}
</style>

<template>
  <li :key="item.id"
      class="video-flow-item"
  >
    <nuxt-link :to="$alias.video(item.id)">
      <v-img :src="item.poster"
             width="128" height="80" class="poster"
      />
      <div class="intro">
        <p class="part oneline">
          第{{ item.part }}话
        </p>
        <span class="name"
              v-text="item.name"
        />
      </div>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: 'VideoFlowItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    bangumiId: {
      type: [String, Number],
      default: ''
    },
    userZone: {
      type: String,
      default: ''
    }
  }
}
</script>

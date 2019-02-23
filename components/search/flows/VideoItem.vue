<style lang="scss">
.search-item-video {
  position: relative;
  padding: 12px 0;
  border-bottom: 1px solid $color-gray-normal;
  @extend %clearfix;

  .in-common-avatar {
    float: left;
    margin-right: 12px;
    width: 60px;
    height: 43px;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .avatar {
    float: left;
    margin-right: 12px;
    width: 105px;
    height: 65px;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .intro {
    overflow: hidden;

    .head {
      margin-bottom: 5px;

      .badge {
        display: inline-block;
        height: 22px;
        padding: 0 10px;
        border: 1px solid #979797;
        color: #979797;
        text-align: center;
        line-height: 21px;
        border-radius: 100px;
        margin-right: 12px;
        font-size: 11px;
      }

      .name {
        color: #222;
        font-size: 16px;
        margin-right: 14px;
        font-weight: 700;
        line-height: 21px;
      }
    }

    .summary {
      font-size: 12px;
      color: $color-text-normal;
      @include twoline(16px);
    }
  }
}
</style>

<template>
  <div class="search-item-video">
    <nuxt-link
      v-if="inCommon"
      :to="$alias.video(item.id)"
      class="in-common-avatar"
    >
      <img
        :src="$resize(item.poster, { width: 180, height: 102 })"
        :alt="item.name"
      />
    </nuxt-link>
    <nuxt-link v-else :to="$alias.video(item.id)" class="avatar">
      <img
        :src="$resize(item.poster, { width: 120, height: 86 })"
        :alt="item.name"
      />
    </nuxt-link>
    <div class="intro">
      <div class="head">
        <span v-if="inCommon" class="badge">视频</span>
        <nuxt-link
          :to="$alias.video(item.id)"
          class="name"
          v-text="item.name"
        />
      </div>
      <nuxt-link :to="$alias.video(item.id)">
        <p class="summary" v-text="item.summary" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchItemVideo',
  props: {
    item: {
      required: true,
      type: Object
    },
    inCommon: {
      required: true,
      type: Boolean,
      default: false
    }
  }
}
</script>

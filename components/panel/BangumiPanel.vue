<style lang="scss" module>
$panel-height: 92px;

.bangumi-panel {
  padding-top: $container-padding;
  padding-bottom: $container-padding;

  .avatar {
    display: block;
    float: left;
    width: 80px;
    height: $panel-height;
    border-radius: 5px;
    margin-right: 10px;
    overflow: hidden;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: $panel-height;

    .name {
      font-size: 16px;
      font-weight: bold;
      display: block;
    }

    .summary {
      font-size: 12px;
      color: #666;
      margin-top: -3px;
      @include twoline(13px);
    }

    .controls {
      text-align: right;
    }
  }
}
</style>

<template>
  <div :class="$style.bangumiPanel">
    <nuxt-link :class="$style.avatar" :to="$alias.bangumi(bangumi.id)">
      <v-img :src="bangumi.avatar" width="80" height="92" />
    </nuxt-link>
    <div :class="$style.content">
      <nuxt-link :to="$alias.bangumi(bangumi.id)">
        <h5 :class="$style.name" class="oneline" v-text="bangumi.name" />
      </nuxt-link>
      <p :class="$style.summary" v-text="bangumi.summary" />
      <div :class="$style.controls">
        <FollowButton :id="bangumi.id" type="bangumi" />
      </div>
    </div>
  </div>
</template>

<script>
import FollowButton from '~/components/common/FollowButton'

export default {
  name: 'BangumiPanel',
  components: {
    FollowButton
  },
  props: {
    bangumi: {
      type: Object,
      required: true
    }
  }
}
</script>

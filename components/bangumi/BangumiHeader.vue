<style lang="scss">
$banner-height: 140px;

#bangumi-header {
  position: relative;
  width: 100%;
  height: $banner-height;
  overflow: hidden;
  box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.5);
  z-index: 0;

  .img {
    width: 110%;
    height: $banner-height;
    margin: -$banner-height / 2 -55%;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    background-color: #999;
    @include filter-blur();
  }

  .bangumi-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(#000, 0.3);
  }

  .info {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    color: $color-white;
    text-shadow: 0 1px 10px gray;
    padding: $container-padding;

    .avatar {
      width: 54px;
      height: 54px;
      margin-right: 12px;
      float: left;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .share-img {
      position: fixed;
      left: 100%;
      top: -100%;
    }

    .follow-button {
      float: right;
      margin-top: 13px;
      margin-left: 5px;
      text-shadow: 0 1px 10px gray;
      color: #fff;

      &:after {
        border-color: #fff;
      }
    }

    .summary {
      overflow: hidden;

      .title {
        font-size: 16px;
        line-height: 18px;
        display: block;
        margin-bottom: 7px;
      }

      span {
        font-size: 13px;
        margin-right: 12px;
      }
    }
  }
}
</style>

<template>
  <section 
    id="bangumi-header">
    <div
      :style="{
        backgroundImage: `url(${$resize(info.banner, {
          height: 400,
          mode: 2
        })})`
      }"
      class="img bg"
    />
    <div class="bangumi-mask" />
    <div class="info">
      <img
        :src="$resize(info.avatar, { width: 200 })"
        class="avatar"
        alt="avatar"
      >
      <img
        class="share-img"
        src="https://image.calibur.tv/owner/logo/max.png?imageMogr2/auto-orient/strip|imageView2/1/w/200/h/200"
      >
      <follow-button
        :id="info.id"
        type="bangumi"
      />
      <div class="summary">
        <p 
          class="title oneline" 
          v-text="info.name" />
        <span>关注数 {{ $utils.shortenNumber(info.follow_users.total) }}</span>
        <span>活跃度 {{ $utils.shortenNumber(info.power) }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import FollowButton from '~/components/common/FollowButton'

export default {
  name: 'VBangumiHeader',
  components: {
    FollowButton
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  }
}
</script>

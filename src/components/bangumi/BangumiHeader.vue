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
    v-if="info" 
    id="bangumi-header">
    <div
      :style="{ backgroundImage: `url(${$resize(info.banner, { height: 400, mode: 2 })})` }"
      class="img bg"
    />
    <div class="info">
      <img 
        :src="$resize(info.avatar, { width: 200 })"
        class="avatar" 
        alt="avatar">
      <follow-button
        :id="info.id"
        :followed="info.followed"
        :class="info.followed ? 'is-followed' : 'not-follow'"
        type="bangumi"
        @submit="actionFollow"
      />
      <div class="summary">
        <p 
          class="title oneline" 
          v-text="info.name"/>
        <span>关注 {{ $utils.shortenNumber(info.count_like) }}</span>
        <!--
        <span>帖子 {{ $utils.shortenNumber(postTotal) }}</span>
        -->
      </div>
    </div>
  </section>
</template>

<script>
import FollowButton from "~/components/common/FollowButton";

export default {
  name: "VBangumiHeader",
  components: {
    FollowButton
  },
  computed: {
    info() {
      return this.$store.state.bangumi.info;
    },
    postTotal() {
      return this.$store.state.bangumi.posts.total;
    }
  },
  methods: {
    actionFollow(result) {
      this.$store.commit("bangumi/SET_FOLLOW", { result });
    }
  }
};
</script>

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

    .follow {
      float: right;
      margin-top: 13px;
      margin-left: 5px;
      @include btn-empty(#fff);
      text-shadow: 0 1px 10px gray;
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
        :src="$resize(info.avatar, { width: 108 })" 
        class="avatar" 
        alt="avatar">
      <button
        :class="[ info.followed ? 'is-followed' : 'not-follow' ]"
        class="follow btn-empty"
        @click="actionFollow"
      >
        <i class="iconfont icon-guanzhu"/>
        {{ info.followed ? '已关注' : '关注' }}
      </button>
      <div class="summary">
        <p 
          class="title oneline" 
          v-text="info.name"/>
        <span>关注 {{ $utils.shortenNumber(info.count_like) }}</span>
        <span>帖子 {{ $utils.shortenNumber(postTotal) }}</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "VBangumiHeader",
  data() {
    return {
      loadingFollow: false
    };
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
    async actionFollow() {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (this.loadingFollow) {
        return;
      }
      this.loadingFollow = true;
      try {
        await this.$store.dispatch("bangumi/follow", {
          ctx: this,
          id: this.info.id
        });
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingFollow = false;
      }
    }
  }
};
</script>

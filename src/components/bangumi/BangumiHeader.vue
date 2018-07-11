<style lang="scss">
  $banner-height: 140px;

  #bangumi-header {
    position: relative;
    width: 100%;
    height: $banner-height;
    overflow: hidden;
    box-shadow: inset 0 0 15px 0 rgba(0,0,0,.5);

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
        box-shadow: 0 4px 10px rgba(0,0,0,.2);
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
  <section id="bangumi-header" v-if="info">
    <div
      class="img bg"
      :style="{ backgroundImage: `url(${$resize(info.banner, { height: 400, mode: 2 })})` }"
    ></div>
    <div class="info">
      <img class="avatar" :src="$resize(info.avatar, { width: 108 })" alt="avatar">
      <button
        class="follow btn-empty"
        @click="actionFollow"
        :class="[ info.followed ? 'is-followed' : 'not-follow' ]"
      >
        <i class="iconfont icon-guanzhu"></i>
        {{ info.followed ? '已关注' : '关注' }}
      </button>
      <div class="summary">
        <p class="title oneline" v-text="info.name"></p>
        <span>关注 {{ $utils.shortenNumber(info.count_like) }}</span>
        <span>帖子 {{ $utils.shortenNumber(postTotal) }}</span>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'v-bangumi-header',
    computed: {
      info () {
        return this.$store.state.bangumi.info
      },
      postTotal () {
        return this.$store.state.bangumi.posts.total
      }
    },
    data () {
      return {
        loadingFollow: false
      }
    },
    methods: {
      async actionFollow () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.loadingFollow) {
          return
        }
        this.loadingFollow = true
        try {
          await this.$store.dispatch('bangumi/follow', {
            ctx: this,
            id: this.info.id
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingFollow = false
        }
      }
    }
  }
</script>

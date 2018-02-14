<style lang="scss">
  #bangumi-show {
    $banner-height: 140px;

    #banner {
      position: relative;
      width: 100%;
      overflow: hidden;
      box-shadow: inset 0 0 15px 0 rgba(0,0,0,.5);
      z-index: 1;
      height: $banner-height;

      .img {
        width: 110%;
        height: $banner-height;
        margin: -$banner-height / 2 -55%;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: -1;
        @include filter-blur();
        background-color: #999;
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
          @include btn-empty(#fff)
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

    $video-item-width: 255px;
    $video-item-margin: 15px;
    $video-item-height: 70px;
    #videos {
      li {
        margin: 0 $video-item-margin 15px 0;
      }

      a {
        display: block;
        position: relative;
      }

      figure {
        width: $video-item-width - $video-item-margin;
        height: $video-item-height;
        background-color: $color-gray-normal;
        cursor: pointer;
        border-radius: 3px;
        overflow: hidden;

        &:hover p {
          color: $color-blue-normal;
        }

        img {
          width: 110px;
          height: 100%;
          cursor: pointer;
          margin-right: 12px;
        }

        figcaption {
          padding-left: 122px;
          padding-right: 12px;

          p {
            display: block;
            color: $color-text-deep;
            font-size: 12px;
            line-height: 14px;
            margin-top: 6px;
            margin-bottom: 5px;
          }

          span {
            font-size: 12px;
            line-height: 14px;
            color: $color-text-normal;
          }
        }
      }
    }

    #posts {
    }
  }
</style>

<template>
  <div id="bangumi-show">
    <section id="banner">
      <div class="img bg"
           :style="{ backgroundImage: info ? `url(${$resize(info.banner, { height: 400, mode: 2 })})` : '' }"
      ></div>
      <div class="info">
        <img class="avatar" :src="$resize(info.avatar, { width: 108 })" alt="avatar">
        <button class="follow btn-empty"
                @click="actionFollow"
                :class="[ info.followed ? 'is-followed' : 'not-follow' ]">
          <i class="iconfont icon-guanzhu"></i>
          {{ info.followed ? '已关注' : '关注' }}
        </button>
        <div class="summary">
          <p class="title oneline" v-text="info.name"></p>
          <span>关注 {{ $utils.shortenNumber(info.count_like) }}</span>
          <span>帖子 {{ $utils.shortenNumber(posts.total) }}</span>
        </div>
      </div>
    </section>
    <div class="hr"></div>
    <div>
      <div class="tabs border-bottom">
        <button class="active">看帖</button>
      </div>
      <ul
        v-infinite-scroll="getPost"
        infinite-scroll-disabled="notFetch"
        infinite-scroll-distance="50"
      >
        <mt-loadmore
          id="posts"
          :top-method="refreshPost"
          :auto-fill="false"
          ref="loadmore">
          <v-post-item
            v-for="item in posts.data"
            :key="item.id"
            :item="item"
          ></v-post-item>
        </mt-loadmore>
      </ul>
      <more-btn
        :no-more="posts.noMore"
        :loading="postState.loading"
        :auto="true"
        :length="posts.data.length"
      ></more-btn>
    </div>
  </div>
</template>

<script>
  const defaultParams = {
    post: {
      take: 10,
      type: 'new'
    }
  }

  export default {
    name: 'bangumi-show',
    async asyncData ({ route, store, ctx }) {
      const id = route.params.id
      await Promise.all([
        store.dispatch('bangumi/getBangumi', { ctx, id }),
        store.dispatch('bangumi/getPosts', {
          ctx,
          id,
          take: defaultParams.post.take,
          type: defaultParams.post.type
        })
      ])
    },
    head () {
      if (!this.id) {
        return
      }
      let keywords = this.info.alias
      this.tags.forEach(tag => {
        keywords += `,${tag.name}`
      })
      return {
        title: `${this.info.name} - 番剧`,
        meta: [
          { hid: 'description', name: 'description', content: this.info.summary },
          { hid: 'keywords', name: 'keywords', content: keywords }
        ]
      }
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      info () {
        return this.$store.state.bangumi.info
      },
      tags () {
        return this.info.tags
      },
      followers () {
        return this.info.followers
      },
      videos () {
        return this.$store.state.bangumi.videos
      },
      posts () {
        return this.$store.state.bangumi.posts
      },
      notFetch () {
        return this.postState.loading || this.posts.noMore
      }
    },
    data () {
      return {
        postState: {
          take: defaultParams.post.take,
          type: defaultParams.post.type,
          loading: false,
          init: true
        },
        videoState: {
          loading: false,
          init: false
        }
      }
    },
    methods: {
      async actionFollow () {
        if (this.$store.state.login) {
          try {
            await this.$store.dispatch('bangumi/follow', {
              ctx: this,
              id: this.id
            })
          } catch (e) {
            this.$toast.error(e)
          }
        } else {
          this.$channel.$emit('drawer-open-sign')
        }
      },
      async getPost (reset = false) {
        if (this.postState.loading || (this.posts.noMore && !reset)) {
          return
        }
        this.postState.loading = true

        try {
          await this.$store.dispatch('bangumi/getPosts', {
            ctx: this,
            id: this.id,
            take: this.postState.take,
            type: this.postState.type,
            reset
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.$refs.loadmore.onTopLoaded()
          this.postState.loading = false
        }
      },
      refreshPost () {
        this.getPost(true)
      }
    }
  }
</script>

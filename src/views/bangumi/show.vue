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

    #videos {

      .sub-title {
        margin-top: $container-padding;
      }

      .video {
        margin-bottom: 15px;
        width: 100%;
        display: block;

        &:first-child {
          margin-top: $container-padding;
        }

        img {
          width: 128px;
          height: 80px;
          border-radius: 5px;
          margin-right: 10px;
          float: left;
        }

        figcaption {
          overflow: hidden;
        }

        p {
          font-size: 16px;
          line-height: 20px;
          margin-bottom: 5px;
        }
      }
    }

    #roles {
      li {
        position: relative;
        margin: 15px 0;
        padding-bottom: 15px;

        &:not(:last-child) {
          @include border-bottom();
        }

        .avatar {
          width: 100px;
          height: 100px;
          display: block;
          float: left;
          overflow: hidden;
          border-radius: 5px;
          margin-right: 10px;
          border: 1px solid $color-gray-normal;

          img {
            width: 100%;
            height: auto;
          }
        }

        .summary {
          overflow: hidden;

          .role {
            font-size: 14px;
            line-height: 20px;
            height: 60px;
            overflow: hidden;

            .name {
              font-weight: bold;
            }

            .intro {
              color: #000;
            }
          }

          .lover {
            margin-top: 20px;
            height: 20px;
            line-height: 20px;
            vertical-align: middle;
            color: $color-text-normal;
            text-align: right;

            img {
              width: 20px;
              height: 20px;
              border-radius: 15px;
              vertical-align: middle;
              border: 1px solid $color-gray-normal;
              margin-left: 10px;
            }

            a {
              font-size: 12px;
              color: $color-text-normal;
            }

            span {
              margin-left: 10px;
              font-size: 12px;
              margin-right: 2px;
            }
          }
        }
      }
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
      <div class="tabs">
        <button @click="switchTab('post')" :class="{ 'active': sort === 'post' }">看帖</button>
        <button @click="switchTab('video')" :class="{ 'active': sort === 'video' }">视频</button>
        <button @click="switchTab('role')" :class="{ 'active': sort === 'role' }">偶像</button>
      </div>
      <template v-if="sort === 'post'">
        <ul>
          <v-post-item
            v-for="item in posts.data"
            :key="item.id"
            :item="item"
          ></v-post-item>
        </ul>
        <more-btn
          :no-more="posts.noMore"
          :loading="postState.loading"
          @fetch="getPost"
          :length="posts.data.length"
        ></more-btn>
      </template>
      <div id="videos" v-else-if="sort === 'video'">
        <div v-if="info.season" class="container">
          <template v-for="season in videos.data">
            <h3 class="sub-title" v-text="season.name" :key="season.name"></h3>
            <ul :key="season.name">
              <li
                v-for="(video, index) in season.data"
                :key="video.id"
                class="video"
              >
                <router-link :to="$alias.video(video.id)">
                  <figure class="clearfix">
                    <v-img class="bg"
                           :alt="video.name"
                           :src="$resize(video.poster, { width: 128, height: 80 })">
                    </v-img>
                    <figcaption>
                      <p class="oneline">第{{ videos.repeat ? index + 1 : video.part }}话</p>
                      <span class="twoline" v-text="video.name"></span>
                    </figcaption>
                  </figure>
                </router-link>
              </li>
            </ul>
          </template>
        </div>
        <ul class="container" v-else>
          <li
            v-for="video in videos.data"
            :key="video.id"
            class="video"
          >
            <router-link :to="$alias.video(video.id)">
              <figure class="clearfix">
                <v-img class="bg"
                       :alt="video.name"
                       :src="$resize(video.poster, { width: 128, height: 80 })">
                </v-img>
                <figcaption>
                  <p class="oneline">第{{ video.part }}话</p>
                  <span class="twoline" v-text="video.name"></span>
                </figcaption>
              </figure>
            </router-link>
          </li>
        </ul>
        <more-btn
          :no-more="!videos.data.length && videoState.fetched"
          :auto="true"
          :loading="videoState.loading"
          :length="videos.data.length"
        ></more-btn>
      </div>
      <div id="roles" v-else-if="sort === 'role'">
        <ul class="container">
          <li v-for="item in roles.data">
            <div class="clearfix">
              <router-link :to="$alias.role(item.id, item.bangumi_id)" class="avatar">
                <v-img :src="item.avatar" width="90" height="90"></v-img>
              </router-link>
              <div class="summary">
                <div class="role">
                  <router-link :to="$alias.role(item.id, item.bangumi_id)" class="name" v-text="item.name"></router-link>
                  <span class="intro">：{{ item.intro }}</span>
                </div>
                <div class="lover">
                  <span>
                    粉丝:
                    {{ $utils.shortenNumber(item.fans_count) }}
                  </span>
                  <span>
                    金币:
                    {{ $utils.shortenNumber(item.star_count) }}
                  </span>
                  <span>
                    守护者：
                    <router-link :to="$alias.user(item.lover.zone)">
                      {{ item.lover.nickname }}
                      <v-img :src="item.lover.avatar" width="20" height="20"></v-img>
                    </router-link>
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <more-btn
          :no-more="roles.noMore"
          :length="roles.data.length"
          :loading="roleState.loading"
          @fetch="getRoles"
        ></more-btn>
      </div>
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
          type: defaultParams.post.type,
          reset: true
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
      },
      roles () {
        return this.$store.state.bangumi.roles
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
          init: false,
          fetched: false
        },
        roleState: {
          loading: false,
          init: false
        },
        sort: 'post'
      }
    },
    methods: {
      async actionFollow () {
        if (!this.$store.state.login) {
          this.$channel.$emit('drawer-open-sign')
          return
        }
        try {
          await this.$store.dispatch('bangumi/follow', {
            ctx: this,
            id: this.id
          })
        } catch (e) {
          this.$toast.error(e)
        }
      },
      async getVideos () {
        if (this.videoState.loading) {
          return
        }
        this.videoState.loading = true
        this.videoState.init = true

        try {
          await this.$store.dispatch('bangumi/getVideos', this.id)
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.videoState.fetched = true
          this.videoState.loading = false
        }
      },
      async getPost (reset = false) {
        if (this.postState.loading || (this.posts.noMore && !reset)) {
          return
        }
        this.postState.loading = true
        this.postState.init = true

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
          this.postState.loading = false
        }
      },
      refreshPost () {
        this.getPost(true)
      },
      async getRoles (reset = false) {
        if (this.roleState.loading) {
          return
        }
        this.roleState.loading = true
        this.roleState.init = true

        try {
          await this.$store.dispatch('bangumi/getRoles', {
            ctx: this,
            bangumiId: this.id,
            reset
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.roleState.loading = false
        }
      },
      switchTab (tab) {
        this.sort = tab
        if (tab === 'post') {
          if (!this.postState.init) {
            this.getPost()
          }
        } else if (tab === 'video') {
          if (!this.videoState.init) {
            this.getVideos()
          }
        } else if (tab === 'role') {
          if (!this.roleState.init) {
            this.getRoles(true)
          }
        }
      }
    }
  }
</script>

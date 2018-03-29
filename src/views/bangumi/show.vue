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

          .name {
            @include twoline(18px)
          }
        }

        p {
          font-size: 16px;
          line-height: 20px;
          margin-bottom: 5px;
        }
      }
    }

    #roles {
      #role-list {
        li {
          position: relative;
          padding-bottom: 15px;
          margin-top: 15px;

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
              display: block;
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

            .star {
              float: right;
              margin-top: 14px;
              @include btn-empty(#000)
            }
          }

          .footer {
            margin-top: 10px;
            height: 30px;
            line-height: 30px;
            vertical-align: middle;
            color: $color-text-normal;
            text-align: right;

            img {
              width: 20px;
              height: 20px;
              border-radius: 15px;
              vertical-align: middle;
              border: 1px solid $color-gray-normal;
              margin-left: 5px;
              margin-top: -3px;
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

      .role-detail-drawer {
        .info {
          margin-bottom: 20px;
          text-align: center;

          .avatar {
            position: relative;
            margin: 0 auto 15px;
            @include avatar(80px);
            @include border($color-gray-normal, 50%);
          }

          .intro {
            padding: 0 50px;
            font-size: 13px;
          }

          .star {
            margin-top: 10px;
            @include btn-empty(#000)
          }

          .stats {
            font-size: 13px;
            color: $color-text-light;
            margin-top: 10px;

            span {
              margin: 0 5px;
            }
          }
        }

        .lover {
          .sub-title {
            margin-top: 10px;
          }

          .lover-user {
            margin-bottom: 10px;
          }
        }

        .lover-user {
          display: block;

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid $color-gray-normal;
            margin-right: 10px;
            vertical-align: middle;
          }
        }

        #role-fans-list {
          .lover-user {
            padding: 10px 0;
            position: relative;
            @include border-bottom();

            .score {
              float: right;
              font-size: 13px;
              color: $color-text-light;
              margin-top: 13px;
            }
          }
        }

        .total-limit {
          background-color: #f5f5f5;
          text-align: center;
          font-size: 12px;
          color: #999;
          padding-top: 15px;
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
                    <v-img
                      class="bg"
                      :alt="video.name"
                      :src="$resize(video.poster, { width: 128, height: 80 })"
                    ></v-img>
                    <figcaption>
                      <p class="part oneline">第{{ videos.repeat ? index + 1 : video.part }}话</p>
                      <span class="name" v-text="video.name"></span>
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
                <v-img
                  class="bg"
                  :alt="video.name"
                  :src="$resize(video.poster, { width: 128, height: 80 })"
                ></v-img>
                <figcaption>
                  <p class="part oneline">第{{ video.part }}话</p>
                  <span class="name" v-text="video.name"></span>
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
        <ul id="role-list" class="container" v-if="roleState.fetched">
          <li v-for="item in roles.data">
            <div class="clearfix">
              <div class="avatar" @click="showRoleDetail(item)">
                <v-img :src="item.avatar" width="90" height="90"></v-img>
              </div>
              <div class="summary">
                <div class="role" @click="showRoleDetail(item)">
                  <span class="name" v-text="item.name"></span>
                  <span class="intro">：{{ item.intro }}</span>
                </div>
                <button @click="handleStarRole(item)" class="star">为TA应援</button>
              </div>
            </div>
            <div class="footer" v-if="item.fans_count">
              <span>
                粉丝:
                {{ $utils.shortenNumber(item.fans_count) }}
              </span>
              <span>
                金币:
                {{ $utils.shortenNumber(item.star_count) }}
              </span>
              <span v-if="item.lover">
                守护者：
                <router-link :to="$alias.user(item.lover.zone)">
                  {{ item.lover.nickname }}
                  <v-img :src="item.lover.avatar" width="20" height="20"></v-img>
                </router-link>
              </span>
            </div>
          </li>
        </ul>
        <more-btn
          :no-more="roles.noMore"
          :length="roles.data.length"
          :loading="roleState.loading"
          @fetch="getRoles"
        ></more-btn>
        <v-drawer
          v-model="openRoleDetailDrawer"
          :header-text="currentRole.name"
          from="bottom"
          size="100%"
          class="role-detail-drawer"
        >
          <div class="info">
            <div class="avatar">
              <img :src="$resize(currentRole.avatar, { width: 160 })">
            </div>
            <p class="intro" v-text="currentRole.intro"></p>
            <button @click="handleStarRole(currentRole)" class="star">为TA应援</button>
            <div class="stats">
              <span>粉丝数：{{ currentRole.fans_count }}</span>
              <span>金币数：{{ currentRole.star_count }}</span>
            </div>
          </div>
          <div class="lover container" v-if="currentRole.loverId">
            <div class="hr"></div>
            <h3 class="sub-title">守护者：</h3>
            <router-link class="lover-user" :to="$alias.user(currentRole.lover.zone)">
              <img :src="$resize(currentRole.lover.avatar, { width: 80 })">
              <span v-text="currentRole.lover.nickname"></span>
            </router-link>
          </div>
          <div class="hr"></div>
          <div class="tabs">
            <button @click="switchFocusRoleTab('new')" :class="{ 'active': focusRoleSort === 'new' }">最近</button>
            <button @click="switchFocusRoleTab('hot')" :class="{ 'active': focusRoleSort === 'hot' }">最多</button>
          </div>
          <ul id="role-fans-list" class="container">
            <li
              v-for="item in currentRoleFans.data"
              :key="item.id"
            >
              <router-link class="lover-user" :to="$alias.user(item.zone)">
                <img :src="$resize(item.avatar, { width: 80 })">
                <span v-text="item.nickname"></span>
                <v-time class="score" v-if="focusRoleSort === 'new'" v-model="item.score"></v-time>
                <span class="score" v-else>{{ item.score }}个金币</span>
              </router-link>
            </li>
          </ul>
          <p v-if="currentRoleFans.data.length >= 100" class="total-limit">最多显示100人</p>
          <more-btn
            :no-more="currentRoleFans.noMore"
            :length="currentRoleFans.data.length"
            :loading="loadingRoleFans"
            @fetch="fetchCurrentRoleFans"
          ></more-btn>
        </v-drawer>
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
      const name = this.info.name
      keywords += `${keywords}, ${name}动漫, ${name}动画片, ${name}全集, ${name}在线观看, ${name}吧`
      return {
        title: `${name} - 番剧`,
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
      },
      currentRoleFans () {
        return this.$store.state.cartoonRole.fans[this.focusRoleSort]
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
          init: false,
          fetched: false
        },
        sort: 'post',
        openRoleDetailDrawer: false,
        currentRole: {},
        focusRoleSort: 'new',
        loadingRoleFans: false,
        loadingFollow: false
      }
    },
    methods: {
      async actionFollow () {
        if (!this.$store.state.login) {
          this.$channel.$emit('drawer-open-sign')
          return
        }
        if (this.loadingFollow) {
          return
        }
        this.loadingFollow = true
        try {
          await this.$store.dispatch('bangumi/follow', {
            ctx: this,
            id: this.id
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingFollow = false
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
          this.roleState.fetched = true
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
      },
      async handleStarRole (role) {
        if (!this.$store.state.login) {
          this.$channel.$emit('drawer-open-sign')
          return
        }
        if (!this.$store.state.user.coin) {
          this.$toast.warn('金币不足')
          return
        }
        try {
          await this.$store.dispatch('bangumi/starRole', {
            bangumiId: this.id,
            roleId: role.id,
            ctx: this,
            hasStar: role.has_star
          })
          this.$store.commit('USE_COIN')
          this.$toast.info(`+${role.has_star}s`)
        } catch (e) {}
      },
      async showRoleDetail (role) {
        this.currentRole = role
        this.focusRoleSort = 'new'
        this.openRoleDetailDrawer = true
        this.fetchCurrentRoleFans(true)
      },
      switchFocusRoleTab (tab) {
        this.focusRoleSort = tab
        if (this.$store.state.cartoonRole.fans[tab].length) {
          return
        }
        this.fetchCurrentRoleFans()
      },
      async fetchCurrentRoleFans (reset = false) {
        if (this.loadingRoleFans) {
          return
        }
        this.loadingRoleFans = true
        try {
          await this.$store.dispatch('cartoonRole/getFansList', {
            ctx: this,
            bangumiId: this.id,
            roleId: this.currentRole.id,
            sort: this.focusRoleSort,
            reset
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingRoleFans = false
        }
      }
    }
  }
</script>

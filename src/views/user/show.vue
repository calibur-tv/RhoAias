<style lang="scss">
  #user-show {
    $banner-height: 120px;

    .user-banner {
      position: relative;
      width: 100%;
      overflow: hidden;
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
      }
    }

    .user-panel {
      position: relative;
      z-index: 2;

      .avatar {
        position: absolute;
        left: $container-padding;
        top: -40px;
        @include avatar(80px);
        @include border(#fff, 50%);
      }

      .info {
        padding-left: 90px;
        line-height: 40px;
        padding-bottom: 10px;

        .nickname {
          overflow: hidden;
        }

        button {
          margin-top: 8px;
          float: right;
          @include btn-empty($color-blue-normal)
        }
      }
    }

    #bangumis {

      li {
        position: relative;
        height: 62px;
        padding: 8px 0;
        @include border-bottom();

        img {
          width: 46px;
          height: 46px;
          margin-right: 12px;
          float: left;
        }

        p {
          overflow: hidden;
          color: $color-text-deep;
          font-size: 12px;
          line-height: 14px;
          margin-top: 6px;
          margin-bottom: 5px;
        }
      }
    }

    #posts-of-reply {
      background-color: #ffffff;

      li {
        float: none;
        padding: 10px;
        position: relative;
        @include border-bottom();

        .header {
          position: relative;
          height: 32px;
          line-height: 32px;

          .time {
            float: right;
            display: block;
            color: #999;
            font-size: 12px;
            position: relative;
            z-index: 1;
            margin-right: 12px;
          }
        }

        .origin {
          display: block;
          background-color: $color-gray-normal;
          padding: 10px 20px;
          margin: 10px 0;
          border-radius: 5px;
        }

        .reply {
          display: block;
          border-left: 5px solid $color-gray-normal;
          margin: 10px 0;
          padding-left: 10px;
        }

        .content {
          margin-top: 3px;
          color: #666;
          font-size: 12px;
          line-height: 22px;
          max-height: 44px;
          overflow: hidden;
        }

        .images {
          margin-bottom: 5px;

          .image-full {
            height: 190px;
            width: 100%;
          }

          .image-list {
            img {
              width: 32%;
              height: auto;

              &:not(:last-child) {
                margin-right: 2%;
              }
            }
          }
        }

        .footer {
          color: #a3a8ad;
          font-size: 12px;
          line-height: 24px;

          span {
            margin: 0 5px;
          }
        }
      }
    }

    #roles-of-mine {
      li {
        position: relative;
        margin-top: 15px;
        padding-bottom: 15px;

        &:not(:last-child) {
          @include border-bottom();
        }

        .avatar {
          width: 80px;
          height: 80px;
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

          .lover {
            height: 20px;
            line-height: 20px;
            vertical-align: middle;
            font-size: 13px;
            color: $color-text-normal;
            overflow: hidden;
            text-align: right;

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
  <div id="user-show">
    <div class="user-banner">
      <div class="img bg" :style="{ backgroundImage: `url(${$resize(user.banner, { height: 240, mode: 2 })})` }"></div>
    </div>
    <div class="user-panel container">
      <div class="avatar">
        <img :src="$resize(user.avatar, { width: 92 })" alt="avatar">
      </div>
      <div class="info">
        <button v-if="isMe" @click="handleDaySign">{{ daySigned ? '已签到' : '签到' }}{{ coinCount ? ` (${coinCount})` : '' }}</button>
        <p class="nickname oneline" v-text="user.nickname"></p>
      </div>
    </div>
    <div class="tabs">
      <button @click="switchTab('bangumi')" :class="{ 'active': sort === 'bangumi' }">番剧</button>
      <button @click="switchTab('mine')" :class="{ 'active': sort === 'mine' }">发帖</button>
      <button @click="switchTab('reply')" :class="{ 'active': sort === 'reply' }">回复</button>
      <button @click="switchTab('role')" :class="{ 'active': sort === 'role' }">偶像</button>
    </div>
    <template v-if="sort === 'bangumi'">
      <ul id="bangumis" class="container" v-if="bangumis.length">
        <li
          v-for="item in bangumis"
          :key="item.id"
        >
          <router-link :to="$alias.bangumi(item.id)">
            <v-img class="bg"
                   :alt="item.name"
                   :src="$resize(item.avatar, { width: 160, height: 160 })"
            ></v-img>
            <p class="twoline" v-text="item.name"></p>
          </router-link>
        </li>
      </ul>
      <more-btn
        v-else
        :no-more="true"
        :auto="true"
        :length="0"
      ></more-btn>
    </template>
    <template v-else-if="sort === 'role'">
      <ul
        class="container"
        id="roles-of-mine"
        v-infinite-scroll="getUserRoles"
        infinite-scroll-disabled="noFetchRoles"
        infinite-scroll-distance="50"
      >
        <li
          v-for="item in roles"
          :key="item.id"
        >
          <div class="clearfix">
            <div class="avatar">
              <v-img :src="item.avatar" width="80" height="80"></v-img>
            </div>
            <div class="summary">
              <div class="role">
                <span class="name" v-text="item.name"></span>
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
                  贡献:
                  {{ item.has_star }}
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <more-btn
        :no-more="noMoreRoles"
        :loading="loadingRoles"
        :length="roles.length"
        :auto="true"
      ></more-btn>
    </template>
    <template v-else>
      <ul
        id="posts-of-mine"
        v-if="sort === 'mine'"
        v-infinite-scroll="getUserPosts"
        infinite-scroll-disabled="noFetch"
        infinite-scroll-distance="50"
      >
        <v-post-item
          v-for="item in posts.data"
          :key="item.id"
          :item="item"
        ></v-post-item>
      </ul>
      <ul
        id="posts-of-reply"
        v-else-if="sort === 'reply'"
        v-infinite-scroll="getUserPosts"
        infinite-scroll-disabled="noFetch"
        infinite-scroll-distance="50"
      >
        <li
          v-for="item in posts.data"
          :key="item.id"
        >
          <router-link class="header" :to="$alias.post(item.post.id)" v-text="item.post.title"></router-link>
          <router-link class="origin" :to="$alias.post(item.post.id, { comment: item.parent.id })">
            <span>{{ item.user.nickname }}</span>：
            <div class="content" v-html="item.parent.content"></div>
            <div class="images clearfix" v-if="item.parent.images.length">
              <v-img
                class="image-full bg"
                v-if="item.parent.images.length === 1"
                :src="item.parent.images[0]"
                height="190"
                mode="2"
                tag="div"
              ></v-img>
              <div class="image-list" v-else>
                <v-img
                  v-for="(image, index) in imageFilter(item.parent.images)"
                  :key="index"
                  :src="image"
                  width="110"
                ></v-img>
              </div>
            </div>
          </router-link>
          <router-link class="reply" :to="$alias.post(item.post.id, { comment: item.parent.id, reply: item.id })">
            <div class="content" v-html="item.content"></div>
            <div class="images clearfix" v-if="item.images.length">
              <v-img
                class="image-full bg"
                v-if="item.images.length === 1"
                :src="item.images[0]"
                height="190"
                mode="2"
                tag="div"
              ></v-img>
              <div class="image-list" v-else>
                <v-img
                  v-for="(image, index) in imageFilter(item.images)"
                  :key="index"
                  :src="image"
                  width="110"
                ></v-img>
              </div>
            </div>
          </router-link>
          <router-link class="footer" :to="$alias.bangumi(item.bangumi.id)">
            回复于
            <span v-text="item.bangumi.name"></span>
            <v-time v-model="item.created_at"></v-time>
          </router-link>
        </li>
      </ul>
      <more-btn
        :no-more="posts.noMore"
        :loading="posts.loading"
        :length="posts.data.length"
        :auto="true"
      ></more-btn>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'page-user',
    async asyncData ({ route, store, ctx }) {
      const zone = route.params.slug
      const arr = [
        store.dispatch('users/getUser', {
          ctx, zone
        }),
        store.dispatch('users/getFollowBangumis', {
          ctx, zone
        })
      ]
      await Promise.all(arr)
    },
    head () {
      if (!this.slug) {
        return
      }
      return {
        title: `${this.user.nickname} - 用户`,
        meta: [
          { hid: 'description', name: 'description', content: this.user.signature },
          { hid: 'keywords', name: 'keywords', content: `calibur,用户,天下漫友是一家,${this.user.zone},${this.user.nickname}` }
        ]
      }
    },
    computed: {
      slug () {
        return this.$route.params.slug
      },
      isMe () {
        return this.$store.state.login
          ? this.slug === this.self.zone
          : false
      },
      self () {
        return this.$store.state.user
      },
      user () {
        return this.isMe
          ? this.self
          : this.$store.state.users.list[this.slug]
      },
      bangumis () {
        return this.$store.state.users.list[this.slug].bangumis
      },
      posts () {
        return this.sort === 'bangumi' ? {} : this.$store.state.users.posts[this.sort]
      },
      daySigned () {
        return this.self.daySign
      },
      coinCount () {
        return this.self.coin
      },
      noFetch () {
        return this.sort === 'bangumi' ? true : (this.posts.loading || this.posts.noMore)
      },
      roles () {
        return this.$store.state.users.roles.data
      },
      noMoreRoles () {
        return this.$store.state.users.roles.noMore
      },
      noFetchRoles () {
        return this.loadingRoles || this.noMoreRoles
      }
    },
    data () {
      return {
        signDayLoading: false,
        sort: 'bangumi',
        loadingRoles: false
      }
    },
    methods: {
      switchTab (tab) {
        this.sort = tab
        if (tab === 'bangumi') {
          return
        }
        if (tab === 'role') {
          this.getUserRoles(true)
          return
        }
        this.getUserPosts(true)
      },
      getUserPosts (isFirstRequest = false) {
        if (
          isFirstRequest &&
          this.$store.state.users.posts[this.sort].data.length &&
          this.$store.state.users.posts.zone === this.user.zone
        ) {
          return
        }
        this.$store.dispatch('users/getFollowPosts', {
          type: this.sort,
          zone: this.user.zone
        })
      },
      async getUserRoles (isFirstRequest = false) {
        if (this.loadingRoles) {
          return
        }
        this.loadingRoles = true
        try {
          await this.$store.dispatch('users/getFollowRoles', {
            ctx: this,
            zone: this.user.zone,
            reset: isFirstRequest
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingRoles = false
        }
      },
      async handleDaySign () {
        if (this.daySigned || this.signDayLoading) {
          return
        }
        this.signDayLoading = true

        try {
          await this.$store.dispatch('users/daySign', {
            ctx: this
          })
          this.$store.commit('SET_USER_INFO', {
            daySign: true,
            coin: this.coinCount + 1
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.signDayLoading = false
        }
      },
      imageFilter (images) {
        return images.slice(0, 3)
      }
    }
  }
</script>

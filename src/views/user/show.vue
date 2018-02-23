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
      background-color: #ffffff;

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
      background-color: #ffffff;

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
      }
    },
    data () {
      return {
        signDayLoading: false,
        sort: 'bangumi'
      }
    },
    methods: {
      switchTab (tab) {
        this.sort = tab
        if (tab !== 'bangumi') {
          this.getUserPosts(true)
        }
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

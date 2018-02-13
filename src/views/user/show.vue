<style lang="scss">
  #user-show {
    $banner-height: 120px;

    .user-banner {
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
          margin-top: 10px;
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
    <div class="tabs border-bottom">
      <button @click="switchTab('bangumi')" :class="{ 'active': sort === 'bangumi' }">番剧</button>
      <button @click="switchTab('mine')" :class="{ 'active': sort === 'mine' }">发帖</button>
      <button @click="switchTab('reply')" :class="{ 'active': sort === 'reply' }">回复</button>
    </div>
    <ul id="bangumis" class="container" v-show="sort === 'bangumi'">
        <li
          v-for="item in bangumis"
          :key="item.id"
          class="border-bottom"
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
    <ul id="posts-of-mine" v-show="sort === 'mine'">
      <v-post-item
        v-for="item in posts.data"
        :key="item.id"
        :item="item"
      ></v-post-item>
    </ul>
  </div>
</template>

<script>
//  import UserApi from '~/api/userApi'

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
        return this.sort === 'bangumi' ? [] : this.$store.state.users.posts[this.sort]
      },
      daySigned () {
        return this.self.daySign
      },
      coinCount () {
        return this.self.coin
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
      getUserPosts (isFirstRequest) {
        if (isFirstRequest && this.$store.state.users.posts[this.sort].data.length) {
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
      }
    }
  }
</script>

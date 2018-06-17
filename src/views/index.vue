<style lang="scss">
  #homepage {
    height: 100vh;
    background-color: #fff;
    position: relative;
    padding: 0 10px 100px 10px;

    #header {
      height: 48px;

      .nav-left {
        float: left;

        .logo {
          width: 24px;
          height: 24px;
          margin-right: 8px;
          margin-left: 8px;
          vertical-align: middle;
        }

        a {
          color: #757575;
          display: inline-block;
          -webkit-box-flex: 0;
          font-size: 12px;
          font-weight: 600;
          line-height: 48px;
          padding: 0 8px;
          text-align: center;

          &.active {
            color: $color-pink-deep;
          }
        }
      }

      .nav-right {
        overflow: hidden;
        text-align: right;
        height: 100%;

        .icon-apps {
          font-size: 22px;
          color: #757575;
          margin-right: 12px;
          line-height: 48px;
        }

        .sign-btn {
          display: block;
          background-color: #f8f8f8;
          border: 1px solid #c6c6c6;
          line-height: 28px;
          padding: 0 9px;
          border-radius: 2px;
          margin-top: 9px;
          float: right;
        }

        .nav-avatar {
          position: relative;
          margin-top: 11px;
          float: right;

          .avatar {
            display: block;
            @include avatar-2(26px);
          }

          .badge {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: red;
            @include border(#fff, 50%);
          }
        }
      }
    }

    #banner {
      height: 170px;
      min-height: 50vw;
      position: relative;
      margin-top: 10px;
      margin-bottom: 20px;

      div {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-top-left-radius: 255px 15px;
        border-top-right-radius: 15px 225px;
        border-bottom-right-radius: 225px 15px;
        border-bottom-left-radius: 15px 255px;
        opacity: 0;
        transition: opacity 1s ease-in-out;
        border: 1px solid #757575;
        background-color: #757575;

        &.show {
          opacity: 1;
        }
      }
    }

    #main {
      .slogan {
        text-align: center;
        margin-top: 24px;
        line-height: 28px;
        font-size: small;
      }
    }

    #footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
</style>

<template>
  <div id="homepage">
    <header id="header">
      <div class="nav-left">
        <img class="logo" @click="handleLogoClick" src="http://image.calibur.tv/owner/logo-new/logo.png?imageMogr2/auto-orient/strip|imageView2/1/w/72/h/72" alt="logo">
        <a class="active" href="/">首页</a>
        <a href="/bangumi/news">番剧</a>
      </div>
      <div class="nav-right">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="iconfont icon-apps"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a href="/post/trending/active">
                帖子
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="/image/trending/new">
                相册
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="/role/trending">
                偶像
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="nav-avatar" v-if="currentUser">
          <button class="avatar" @click="openUserDrawer">
            <img :src="$resize(currentUser.avatar, { width: 48 })" alt="avatar">
          </button>
          <span class="badge" v-if="notificationCount"></span>
        </div>
        <button class="sign-btn" @click="openSignDrawer" v-else>登录</button>
      </div>
    </header>
    <div id="banner">
      <div class="bg" :class="{'show' : toggle}" :style="{ backgroundImage: banner1 ? `url(${$resize(banner1.url, options)})` : '' }"></div>
      <div class="bg" :class="{'show' : !toggle}" :style="{ backgroundImage: banner2 ? `url(${$resize(banner2.url, options)})` : '' }"></div>
    </div>
    <main id="main">
      <v-search></v-search>
      <div class="slogan">天下漫友是一家</div>
    </main>
    <v-footer></v-footer>
    <user-drawer></user-drawer>
  </div>
</template>

<script>
  import vFooter from '~/components/layouts/Footer'
  import UserDrawer from '~/components/layouts/UserDrawer'
  import vSearch from '~/components/search/input'

  export default {
    name: 'page-index',
    head: {
      title: ''
    },
    async asyncData ({ store, ctx }) {
      await store.dispatch('homepage/getBanners', ctx)
    },
    components: {
      UserDrawer,
      vFooter,
      vSearch
    },
    computed: {
      banners () {
        return this.$store.state.homepage.banners
      },
      currentUser () {
        return this.$store.state.user
      },
      notificationCount () {
        if (!this.currentUser) {
          return 0
        }
        const result = this.currentUser.notification - this.$store.state.users.notifications.checked
        return result < 0 ? 0 : result
      }
    },
    data () {
      return {
        banner1: null,
        banner2: null,
        timer: null,
        toggle: true,
        index: 0,
        options: {
          width: 720,
          height: 0,
          mode: 0
        }
      }
    },
    created () {
      this.banner1 = this.banners[0]
    },
    mounted () {
      this.loopBanner()
    },
    methods: {
      loopBanner () {
        this.timer = setInterval(() => {
          this.index = 1 + this.index === this.banners.length ? 0 : this.index + 1
          const data = this.banners[this.index]
          this.toggle
            ? this.banner2 = data
            : this.banner1 = data
          setTimeout(() => {
            this.toggle = !this.toggle
          }, 5000)
        }, 10000)
      },
      openSignDrawer () {
        this.$channel.$emit('sign-in', (false))
      },
      openUserDrawer () {
        this.$channel.$emit('open-user-drawer')
      },
      handleLogoClick () {
        this.$toast.info('calibur.tv')
      }
    },
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
</script>

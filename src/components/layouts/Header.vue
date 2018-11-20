<style lang="scss">
$header-hgt: 48px;

#header {
  height: $header-hgt;

  .header-text {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: $header-hgt;
    z-index: 9;
    background-color: #fff;
    padding: 0 10px;

    &.border-header {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-left {
      float: left;

      .logo {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        margin-left: 5px;
        vertical-align: middle;
        border-radius: 4px;
      }

      .link {
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

      .open-search-btn {
        display: inline-block;
        vertical-align: middle;
        height: 100%;
        margin-right: 12px;
        float: right;

        i {
          font-size: 24px;
          line-height: 24px;
          color: #757575;
        }
      }

      .nav-avatar {
        position: relative;
        margin-top: 11px;
        float: right;

        .badge {
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: red;
          pointer-events: none;
          @include border(#fff, 50%);
        }
      }
    }
  }
}
</style>

<template>
  <header id="header">
    <div 
      :class="{ 'border-header': !noBorderPage }"
      class="header-text">
      <div class="nav-left">
        <router-link to="/">
          <img
            class="logo"
            src="https://image.calibur.tv/owner/logo/max.png?imageMogr2/auto-orient/strip|imageView2/1/w/80/h/80"
            alt="logo"
          >
        </router-link>
        <router-link
          :class="{ 'active': worldPage }"
          class="link"
          to="/world"
        >社区</router-link>
        <router-link
          :class="{ 'active': bangumiPage }"
          class="link"
          to="/bangumi/news"
        >番剧</router-link>
        <router-link
          :class="{ 'active': rolePage }"
          class="link"
          to="/role/trending"
        >偶像</router-link>
        <router-link
          :class="{ 'active': appPage }"
          class="link"
          to="/app/download"
        >APP</router-link>
      </div>
      <div class="nav-right">
        <div
          v-if="currentUser" 
          class="nav-avatar">
          <button @click="openUserDrawer">
            <v-img
              :src="currentUser.avatar"
              :avatar="true"
              size="24"
            />
          </button>
          <span 
            v-if="notificationCount" 
            class="badge"/>
        </div>
        <button 
          v-else 
          class="sign-btn" 
          @click="openSignDrawer">登录</button>
        <template v-if="!homePage">
          <button
            class="open-search-btn"
            @click="openSearchDrawer = true">
            <i class="iconfont icon-sousuo"/>
          </button>
          <search-drawer v-model="openSearchDrawer"/>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import SearchDrawer from '~/components/drawers/SearchDrawer'

export default {
  name: 'VHeader',
  components: {
    SearchDrawer
  },
  data() {
    return {
      openSearchDrawer: false
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user
    },
    notificationCount() {
      if (!this.currentUser) {
        return 0
      }
      const result =
        this.currentUser.notification -
        this.$store.state.users.notifications.checked
      return result < 0 ? 0 : result
    },
    path() {
      return this.$route.path
    },
    homePage() {
      return this.path === '/'
    },
    worldPage() {
      return /^\/world/.test(this.path)
    },
    bangumiPage() {
      return /^\/bangumi/.test(this.path)
    },
    rolePage() {
      return /^\/role/.test(this.path)
    },
    appPage() {
      return /^\/app/.test(this.path)
    },
    noBorderPage() {
      return this.homePage || this.appPage
    }
  },
  methods: {
    openSignDrawer() {
      this.$channel.$emit('sign-in', false)
    },
    openUserDrawer() {
      this.$channel.$emit('open-user-drawer')
    }
  }
}
</script>

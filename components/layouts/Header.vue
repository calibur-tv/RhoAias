<style lang="scss">
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
        margin-right: 5px;
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
        padding: 0 5px;
        text-align: center;

        &.active {
          color: $color-pink-normal;
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
        float: right;
        display: inline-block;
        vertical-align: middle;
        height: 100%;
        margin-right: 12px;

        i {
          font-size: 24px;
          line-height: 24px;
          color: #757575;
        }
      }

      .nav-avatar {
        float: right;
        position: relative;
        margin-top: 11px;

        img {
          border-radius: 50%;
          display: block;
          width: 24px;
          height: 24px;
        }
      }

      .faker-user-avatar {
        float: right;
        display: block;
        position: relative;
        margin-top: 11px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }
  }
}
</style>

<template>
  <header id="header">
    <div :class="{ 'border-header': !noBorderPage }" class="header-text">
      <div class="nav-left">
        <router-link to="/">
          <img
            class="logo"
            src="https://image.calibur.tv/owner/logo/icon-1024.png-share120jpg"
            alt="logo"
          >
        </router-link>
        <router-link
          :class="{ active: rolePage }"
          class="link"
          to="/role/trending"
        >
          股市
        </router-link>
        <router-link
          :class="{ active: worldPage }"
          class="link"
          to="/world/post"
        >
          社区
        </router-link>
        <router-link
          :class="{ active: bangumiPage }"
          class="link"
          to="/bangumi/news"
        >
          番剧
        </router-link>
        <router-link
          :class="{ active: appPage }"
          class="link"
          to="/app/download"
        >
          APP
        </router-link>
        <router-link
          :class="{ active: rewardPage }"
          class="link"
          to="/about/reward"
        >
          捐赠
        </router-link>
      </div>
      <div class="nav-right">
        <not-ssr>
          <template v-if="haveAuthToken">
            <div v-if="currentUser" class="nav-avatar">
              <button @click="openUserDrawer">
                <img :src="$resize(currentUser.avatar, { width: 48 })" alt="">
              </button>
            </div>
            <img
              v-else
              :src="
                $resize('https://image.calibur.tv/default/user-avatar', {
                  width: 48
                })
              "
              class="faker-user-avatar"
            >
          </template>
          <button v-else class="sign-btn" @click="openSignDrawer">
            登录
          </button>
        </not-ssr>
        <template v-if="!homePage">
          <button class="open-search-btn" @click="openSearchDrawer = true">
            <i class="iconfont icon-sousuo" />
          </button>
          <SearchDrawer v-model="openSearchDrawer" />
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
    haveAuthToken() {
      return this.$store.state.haveAuthToken
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
      return /^\/role\/trending/.test(this.path)
    },
    appPage() {
      return /^\/app/.test(this.path)
    },
    rewardPage() {
      return /^\/about\/reward/.test(this.path)
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

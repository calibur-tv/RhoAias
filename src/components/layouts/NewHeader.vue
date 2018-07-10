<style lang="scss">
  #mew-header {
    height: 48px;
    padding: 0 10px;
    width: 100%;

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
</style>

<template>
  <header id="mew-header">
    <div class="nav-left">
      <img
        class="logo"
        @click="handleLogoClick"
        src="http://image.calibur.tv/owner/logo-new/logo.png?imageMogr2/auto-orient/strip|imageView2/1/w/72/h/72"
        alt="logo"
      >
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
            <a href="/pins/trending/active">
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
</template>

<script>
  export default {
    name: 'new-header',
    computed: {
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
    methods: {
      openSignDrawer () {
        this.$channel.$emit('sign-in', (false))
      },
      openUserDrawer () {
        this.$channel.$emit('open-user-drawer')
      },
      handleLogoClick () {
        this.$toast.info('calibur.tv')
      }
    }
  }
</script>

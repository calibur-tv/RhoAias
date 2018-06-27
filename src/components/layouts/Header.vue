<style lang="scss">
  #header-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: $nav-height;
    box-shadow: 0 2px 4px rgba(0,0,0,.1);
    background-color: #ffffff;
    z-index: 90;

    .header-main {
      height: 100%;
      line-height: $nav-height;
    }

    .logo {
      height: 28px;
      margin-top: ($nav-height - 28) / 2;
      display: block;
      float: left;

      img {
        height: 100%;
        width: auto;
      }
    }

    .header-right {
      text-align: right;
      overflow: hidden;
      height: 100%;
      font-size: 0;

      .open-search-btn {
        display: inline-block;
        vertical-align: middle;
        margin-left: 24px;
        margin-top: 2px;

        i {
          font-size: 24px;
          line-height: 24px;
        }
      }

      .nav-avatar {
        position: relative;
        margin-left: 15px;
        display: inline-block;
        vertical-align: middle;
        @include avatar(24px);
        @include border($color-gray-normal, 50%);

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

      .faker-avatar {
        margin-left: 15px;
        width: 24px;
        height: 24px;
        font-size: 23px;
        line-height: 24px;
        vertical-align: middle;
        color: #333;
      }

      .search-drawer {
        border-radius: 0 0 5px 5px;

        $search-height: 24px;
        .search-wrap {
          margin-top: 8px;
          margin-bottom: 8px;
          height: $search-height;
          line-height: $search-height;
          font-size: 12px;

          .cancel {
            float: right;
            padding-top: 5px;
            padding-left: 10px;
          }

          .content {
            overflow: hidden;
            background-color: #f4f4f4;
            border-radius: 4px;

            .iconfont {
              float: left;
              margin: 6px 10px 0 10px;
            }

            .clear {
              display: block;
              float: right;
              margin: 5px 10px;
              width: 14px;
              height: 14px;
              text-align: center;
              line-height: 13px;
              font-size: 12px;
              background-color: #999;
              color: #fff;
              border-radius: 50%;
              user-select: none;
            }

            .input-wrap {
              height: 100%;
              overflow: hidden;

              input {
                height: $search-height;
                background-color: transparent;
                display: block;
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <header id="header-wrap" class="container">
    <div class="header-main">
      <a class="logo" href="/">
        <img :src="$resize(`${$cdn.image}owner/logo`, { height: 56, mode: 2 })" alt="logo">
      </a>
      <div class="header-right">
        <button class="open-search-btn" @click="openSearchDrawer = true">
          <i class="iconfont icon-sousuo"></i>
        </button>
        <button class="nav-avatar" v-if="user" @click="openUserDrawer">
          <img :src="$resize(avatar, { width: 48 })" alt="avatar">
          <span class="badge" v-if="notificationCount"></span>
        </button>
        <button class="faker-avatar iconfont icon-avatar" @click="openSignDrawer" v-else></button>
      </div>
    </div>
    <search-drawer v-model="openSearchDrawer"></search-drawer>
  </header>
</template>

<script>
  import SearchDrawer from '~/components/drawers/SearchDrawer'

  export default {
    name: 'v-header',
    components: {
      SearchDrawer
    },
    computed: {
      avatar () {
        return this.$store.state.login
          ? this.user.avatar
          : `${this.$cdn.image}default/user-avatar`
      },
      computeUserDrawerBg () {
        if (this.user.banner.split('/default/user-banner').length > 1) {
          return {}
        }
        return { backgroundImage: `url(${this.$resize(this.user.banner, { height: 250, mode: 2 })})` }
      },
      user () {
        return this.$store.state.user
      },
      notificationCount () {
        const result = this.user.notification - this.$store.state.users.notifications.checked
        return result < 0 ? 0 : result
      }
    },
    data () {
      return {
        openSearchDrawer: false
      }
    },
    methods: {
      openUserDrawer () {
        this.$channel.$emit('open-user-drawer')
      },
      openSignDrawer () {
        this.$channel.$emit('sign-in', (false))
      }
    }
  }
</script>

<style lang="scss">
  .user-drawer {
    text-align: left;

    .user-section {
      height: 110px;
      width: 100%;
      overflow: hidden;
      position: relative;
      padding: $container-padding;
      text-shadow: 0 1px 10px gray;
      color: #ffffff;
      line-height: 40px;

      .bg {
        width: 120%;
        height: 120%;
        position: absolute;
        left: -10%;
        top: -10%;
        z-index: -1;
        background-color: #999;
        @include filter-blur();
      }

      .user-info {
        margin-bottom: 5px;

        .avatar {
          position: relative;
          display: block;
          @include avatar(50px);
          @include border(#fff, 50%);
          float: left;
          margin-right: 10px;
        }

        .panel {
          overflow: hidden;
          line-height: 25px;

          button {
            @include btn-empty(#ffffff);
          }
        }
      }

      .badge {
        margin-right: 30px;
        font-size: 14px;
      }
    }

    .routes {
      margin-top: 10px;

      li {
        height: 40px;
        position: relative;
        padding: 5px 0;
        margin-left: 3px;
        @include border-bottom();
      }

      i {
        font-size: 13px;
      }

      a, button {
        display: block;
        width: 100%;
        height: 100%;
        line-height: 30px;
        text-align: left;
        font-size: 13px;
        color: #333;
      }

      .badge-count {
        border-radius: 12px;
        font-size: 15px;
        padding: 2px 8px;
        background-color: red;
        color: #fff;
        height: 20px;
        line-height: 16px;
        margin-left: 5px;
      }
    }
  }
</style>

<template>
  <v-drawer
    from="right"
    size="70%"
    id="user"
    v-model="switchUserDrawer"
    class="user-drawer"
    v-if="user"
  >
    <div class="user-section">
      <div class="bg" :style="computeUserDrawerBg"></div>
      <div class="user-info">
        <a :href="$alias.user(user.zone)" class="avatar">
          <img :src="$resize(user.avatar, { width: 50 })" alt="me">
        </a>
        <div class="panel">
          <div>
            <a class="oneline" :href="$alias.user(user.zone)" v-text="user.nickname"></a>
          </div>
          <button @click="handleDaySign">{{ daySigned ? '已签到' : '签到' }}</button>
        </div>
      </div>
      <span class="badge">金币：{{ coinCount }} 个</span>
      <span class="badge">邀请码：{{ user.id }}</span>
    </div>
    <ul class="routes container" @click="switchUserDrawer = false">
      <li>
        <a :href="$alias.user(user.zone)">
          <i class="iconfont icon-zhuye"></i>
          个人主页
        </a>
      </li>
      <li>
        <a href="/me/setting">
          <i class="iconfont icon-shezhi"></i>
          用户设置
        </a>
      </li>
      <li>
        <a href="/notification/list">
          <i class="iconfont icon-nitification"></i>
          消息通知
          <span v-if="notificationCount" class="badge-count">{{ notificationCount }}</span>
        </a>
      </li>
      <li>
        <a href="/about/hello">
          <i class="iconfont icon-bangzhu"></i>
          功能简介
        </a>
      </li>
      <li>
        <button @click="logout">
          <i class="iconfont icon-tuichu"></i>
          退出登录
        </button>
      </li>
    </ul>
  </v-drawer>
</template>

<script>
  import UserApi from '~/api/userApi'

  export default {
    name: 'v-user-drawer',
    computed: {
      user () {
        return this.$store.state.user
      },
      computeUserDrawerBg () {
        if (!this.user || this.user.banner.split('/default/user-banner').length > 1) {
          return {}
        }
        return { backgroundImage: `url(${this.$resize(this.user.banner, { height: 250, mode: 2 })})` }
      },
      notificationCount () {
        const result = this.user.notification - this.$store.state.users.notifications.checked
        return result < 0 ? 0 : result
      },
      daySigned () {
        return this.user.daySign
      },
      coinCount () {
        return this.user.coin
      }
    },
    data () {
      return {
        switchUserDrawer: false,
        signDayLoading: false
      }
    },
    methods: {
      logout () {
        this.$cookie.remove('JWT-TOKEN')
        const api = new UserApi(this)
        api.logout()
        window.location.href = '/'
      },
      async handleDaySign () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
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
    },
    mounted () {
      this.$channel.$on('open-user-drawer', () => {
        this.$store.dispatch('getNotification', this)
        this.switchUserDrawer = true
      })
    }
  }
</script>

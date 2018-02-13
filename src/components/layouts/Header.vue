<style lang="scss">
  #header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: $nav-height;
    line-height: $nav-height;
    box-shadow: 0 2px 4px rgba(0,0,0,.1);
    background-color: #ffffff;
    z-index: 99;

    .logo {
      height: 32px;
      margin-top: ($nav-height - 32) / 2;
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

      .search-btn {
        display: inline-block;
        vertical-align: middle;

        i {
          font-size: 24px;
          line-height: 24px;
        }
      }

      .search-drawer {
        border-radius: 0 0 5px 5px;
      }

      .nav-avatar {
        margin-left: 15px;
        display: inline-block;
        vertical-align: middle;
        @include avatar(24px);
        position: relative;

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

      .sign-drawer {
        .form-item {
          position: relative;
          height: 48px;

          label {
            text-align: left;
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 80px;
            background-color: #fff;
            font-size: 16px;
          }

          input {
            display: block;
            overflow: hidden;
            height: 100%;
            width: 100%;
            padding-left: 90px;
          }
        }

        .captcha {
          position: relative;
          margin-top: 15px;

          &:before {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            text-align: center;
            line-height: 44px;
            color: $color-white;
          }
        }

        .switch {
          text-align: center;
          width: 100%;
          font-size: 13px;
          color: #666;
          padding: 20px 0;
        }

        .checkAndSend {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          padding: 0 10px;
          font-size: 12px;
          color: $color-text-normal;
        }
      }

      .user-drawer {
        text-align: left;

        .user-section {
          height: 110px;
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: $container-padding;

          .bg {
            @include filter-blur();
            width: 120%;
            height: 120%;
            position: absolute;
            left: -10%;
            top: -10%;
            z-index: -1;
            background-color: #999;
          }
          
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
            text-shadow: 0 1px 10px gray;
            color: #ffffff;
            line-height: 25px;

            button {
              @include btn-empty(#ffffff);
            }
          }
        }

        .routes {
          margin-top: 10px;

          li {
            height: 40px;
            position: relative;
            padding: 5px 0;
            margin-left: 3px;
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
    }
  }
</style>

<template>
  <header id="header" class="container">
    <router-link class="logo" to="/">
      <img :src="$resize(`${$cdn.image}owner/logo`, { height: 64, mode: 2 })" alt="logo">
    </router-link>
    <div class="header-right">
      <button class="search-btn" @click="openSearchDrawer = true">
        <i class="iconfont icon-sousuo"></i>
      </button>
      <v-drawer
        from="top"
        size="40%"
        id="search"
        class="search-drawer"
        v-model="openSearchDrawer"
      >

      </v-drawer>
      <template v-if="$store.state.login">
        <button class="nav-avatar" @click="openUserDrawer">
          <img :src="$resize(avatar, { width: 48 })" alt="avatar">
          <span class="badge" v-if="notificationCount"></span>
        </button>
        <v-drawer
          from="right"
          size="70%"
          id="user"
          v-model="switchUserDrawer"
          class="user-drawer"
        >
          <div class="user-section">
            <div class="bg" :style="{ backgroundImage: `url(${$resize(user.banner, { height: 250, mode: 2 })})` }"></div>
            <router-link :to="$alias.user(user.zone)" class="avatar">
              <img :src="$resize(user.avatar)" alt="me">
            </router-link>
            <div class="panel">
              <div>
                <router-link class="oneline" :to="$alias.user(user.zone)" v-text="user.nickname"></router-link>
              </div>
              <button @click="handleDaySign">{{ daySigned ? '已签到' : '签到' }}{{ coinCount ? ` (${coinCount})` : '' }}</button>
            </div>
          </div>
          <ul class="routes container">
            <li class="border-bottom">
              <router-link :to="$alias.user(user.zone)">
                <i class="iconfont icon-zhuye"></i>
                个人主页
              </router-link>
            </li>
            <li class="border-bottom">
              <a href="">
                <i class="iconfont icon-nitification"></i>
                消息通知
                <span v-if="notificationCount" class="badge-count">{{ notificationCount }}</span>
              </a>
            </li>
            <li class="border-bottom">
              <button @click="logout">
                <i class="iconfont icon-tuichu"></i>
                退出登录
              </button>
            </li>
          </ul>
        </v-drawer>
      </template>
      <template v-else>
        <button class="nav-avatar" @click="openSignDrawer">
          <img :src="$resize(avatar, { width: 48 })" alt="avatar">
        </button>
        <v-drawer
          v-model="switchLoginDrawer"
          from="bottom"
          size="100%"
          :header-text="showRegisterForm ? '注册' : '登录'"
          class="sign-drawer"
          id="sign"
        >
          <form
            v-show="showRegisterForm"
            class="container"
            autocomplete="off"
            data-vv-scope="sign-up"
          >
            <div class="form-item border-bottom">
              <label for="sign-up-nickname">昵称</label>
              <input
                name="nickname"
                id="sign-up-nickname"
                type="text"
                v-validate="'required|nickname:2-14'"
                v-model.trim="signUp.nickname"
                @input="showSignUpCaptcha"
                autocomplete="off"
                placeholder="2-14个字符组成"
              >
            </div>
            <div class="form-item border-bottom">
              <label for="sign-up-access">手机号</label>
              <input
                id="sign-up-access"
                type="tel"
                name="access"
                v-validate="'required|numeric|len:11'"
                v-model.trim="signUp.access"
                @input="showSignUpCaptcha"
                autocomplete="off"
                placeholder="填写常用手机号"
              >
            </div>
            <div class="form-item border-bottom">
              <label for="sign-up-auth-code">验证码</label>
              <input
                id="sign-up-auth-code"
                type="text"
                name="auth-code"
                v-validate="'required|len:6'"
                autocomplete="off"
                v-model.trim="signUp.authCode"
                placeholder="请填写验证码"
              >
              <button class="checkAndSend"
                      @click="handleRegisterAuthCode"
                      type="button"
              >{{ getAuthCodeBtnText }}</button>
            </div>
            <div class="form-item border-bottom">
              <label for="sign-up-secret">密码</label>
              <input
                id="sign-up-secret"
                type="password"
                name="secret"
                v-validate="'required|min:6|max:16'"
                v-model.trim="signUp.secret"
                autocomplete="off"
                @input="showSignUpCaptcha"
                placeholder="6-16个字符组成"
              >
            </div>
            <div class="form-item border-bottom">
              <label for="sign-up-invite-code">邀请码</label>
              <input
                id="sign-up-invite-code"
                class="last-input"
                type="text"
                autocomplete="off"
                v-model.trim="signUp.inviteCode"
                placeholder="可为空"
              >
            </div>
            <div class="captcha btn-submit" data-text="注册" ref="signUpCaptcha"></div>
          </form>
          <form
            v-show="!showRegisterForm"
            class="container"
            autocomplete="off"
            data-vv-scope="sign-in"
          >
            <div class="form-item border-bottom">
              <label for="login-access">手机号</label>
              <input
                name="access"
                id="login-access"
                placeholder="请输入手机号"
                type="tel"
                v-model.trim="signIn.access"
                v-validate="'required|numeric|len:11'"
                @input="showSignInCaptcha"
              >
            </div>
            <div class="form-item border-bottom">
              <label for="login-secret">密码</label>
              <input
                name="secret"
                id="login-secret"
                placeholder="请输入密码"
                type="password"
                v-validate="'required|min:6|max:16'"
                v-model.trim="signIn.secret"
                autocomplete="off"
                @input="showSignInCaptcha"
              >
            </div>
            <div class="captcha btn-submit" data-text="登录" ref="signInCaptcha"></div>
          </form>
          <button class="switch" @click="showRegisterForm = !showRegisterForm">{{ showRegisterForm ? '返回登录' : '立即注册' }}</button>
        </v-drawer>
      </template>
    </div>
  </header>
</template>

<script>
  import UserApi from '~/api/userApi'

  export default {
    name: 'v-header',
    computed: {
      avatar () {
        return this.$store.state.login
          ? this.user.avatar
          : `${this.$cdn.image}default/user-avatar`
      },
      user () {
        return this.$store.state.user
      },
      getAuthCodeBtnText () {
        if (this.signUpStep === 3) {
          return `${this.signUp.timeout}秒后可重新获取`
        } else if (this.signUpStep === 4) {
          return '点击重新获取'
        }
        return '点击获取验证码'
      },
      daySigned () {
        return this.user.daySign
      },
      coinCount () {
        return this.user.coin
      },
      notificationCount () {
        return this.user.notification - this.$store.state.users.notifications.checked
      }
    },
    data () {
      return {
        signDayLoading: false,
        openSearchDrawer: false,
        switchUserDrawer: false,
        switchLoginDrawer: false,
        showRegisterForm: false,
        signIn: {
          captcha: false,
          access: '',
          secret: '',
          method: 'phone'
        },
        signUp: {
          captcha: false,
          method: 'phone',
          access: '',
          secret: '',
          nickname: '',
          authCode: '',
          inviteCode: '',
          tempAccess: '',
          timeout: 0
        },
        /**
         * signUpStep
         * 0：未获取 captcha
         * 1：已获取 captcha
         * 2: captcha 验证通过
         * 3：邮件或短信已发送，倒数中，不可重复发
         * 4：可再次发送邮件或短信
         * 5: captcha 邮箱或手机号已注册
         */
        signUpStep: 0
      }
    },
    methods: {
      handleFetch () {
        if (this.loading) {
          return
        }
        this.$emit('fetch')
      },
      openSignDrawer () {
        this.switchLoginDrawer = true
        this.showSignInCaptcha()
      },
      openUserDrawer () {
        this.$store.dispatch('getNotification', this)
        this.switchUserDrawer = true
      },
      showSignUpCaptcha () {
        if (!this.signUp.captcha && this.switchLoginDrawer) {
          this.$validator.validateAll('sign-up').then((result) => {
            if (result) {
              this.signUp.captcha = true
              this.$captcha({
                type: 'float',
                elem: this.$refs.signUpCaptcha,
                success: ({ data, captcha }) => {
                  this.register(data).then((res) => {
                    this.$cookie.set('JWT-TOKEN', res)
                    window.location.reload()
                  }).catch((err) => {
                    this.signUp.captcha = false
                    this.$toast.error(err)
                    setTimeout(() => {
                      captcha.reset()
                    }, 500)
                  })
                },
                error: () => {
                  this.signUp.captcha = false
                }
              })
            }
          })
        }
      },
      showSignInCaptcha () {
        if (!this.signIn.captcha && this.switchLoginDrawer) {
          this.$validator.validateAll('sign-in').then((result) => {
            if (result) {
              this.signIn.captcha = true
              const ele = this.$refs.signInCaptcha
              ele.innerHTML = ''
              this.$captcha({
                type: 'float',
                elem: ele,
                success: ({ data, captcha }) => {
                  this.login(data).then((token) => {
                    this.$cookie.set('JWT-TOKEN', token, { expires: 365 })
                    window.location.reload()
                  }).catch((err) => {
                    this.signIn.captcha = false
                    this.$toast.error(err)
                    setTimeout(() => {
                      captcha.reset()
                    }, 500)
                  })
                },
                error: () => {
                  this.signIn.captcha = false
                }
              })
            }
          })
        }
      },
      login (geetest) {
        const api = new UserApi()
        return api.login({
          access: this.signIn.access,
          secret: this.signIn.secret,
          method: this.signIn.method,
          geetest
        })
      },
      register (geetest) {
        const api = new UserApi()
        return api.register({
          method: this.signUp.method,
          access: this.signUp.access,
          secret: this.signUp.secret,
          nickname: this.signUp.nickname,
          authCode: this.signUp.authCode,
          inviteCode: this.signUp.inviteCode,
          geetest
        })
      },
      async handleRegisterAuthCode () {
        if (this.signUpStep === 3 || this.signUpStep === 1) {
          return
        }
        const nicknameIsOK = await this.$validator.validate('sign-up.nickname')
        if (nicknameIsOK) {
          const accessIsOK = await this.$validator.validate('sign-up.access')
          if (accessIsOK) {
            if (this.signUp.access !== this.signUp.tempAccess) {
              if (this.signUpStep === 0 || this.signUpStep === 4 || this.signUpStep === 5) {
                this.signUpStep = 1
                this.$captcha(({ data }) => {
                  this.signUpStep = 2
                  this.getRegisterAuthCode(data)
                })
              }
            } else {
              this.$toast.info(`请更换${this.signUp.method === 'email' ? '邮箱' : '手机'}`)
            }
          } else {
            this.$toast.info(`请填写正确的${this.signUp.method === 'email' ? '邮箱' : '手机'}`)
          }
        } else {
          this.$toast.info('请先填写昵称')
        }
      },
      getRegisterAuthCode (geetest) {
        const api = new UserApi()
        this.signUp.tempAccess = this.signUp.access
        api.sendSignAuthCode({
          method: this.signUp.method,
          access: this.signUp.access,
          nickname: this.signUp.nickname,
          mustNew: true,
          geetest
        }).then(() => {
          this.signUp.tempAccess = ''
          this.signUpStep = 3
          this.$toast.success(`${this.signUp.method === 'email' ? '邮件' : '短信'}已发送，请查收`)
        }).catch((err) => {
          this.$toast.error(err)
          this.signUpStep = 5
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
      logout () {
        this.$cookie.remove('JWT-TOKEN')
        const api = new UserApi(this)
        api.logout()
        window.location.reload()
      }
    },
    mounted () {
      this.$channel.$on('switch-to-register', result => {
        this.showRegisterForm = result
      })
    }
  }
</script>

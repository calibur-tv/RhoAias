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

      .search-btn,
      .create-btn {
        display: inline-block;
        vertical-align: middle;
        margin-left: 24px;

        i {
          font-size: 24px;
          line-height: 24px;
        }
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
              margin: 0 10px;
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
              }
            }
          }
        }
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
        text-align: center;

        .form-item {
          position: relative;
          height: 48px;
          @include border-bottom();

          label {
            text-align: left;
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 80px;
            background-color: #fff;
            font-size: 16px;
            line-height: 48px;
          }

          input {
            display: block;
            overflow: hidden;
            height: 100%;
            padding-left: 90px;
            line-height: 48px;
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
          font-size: 13px;
          color: #666;
          padding: 20px 10px;
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

        .tip {
          text-align: left;
          line-height: 25px;
          font-size: 13px;
          margin-top: 10px;
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
          text-shadow: 0 1px 10px gray;
          color: #ffffff;

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
            line-height: 25px;

            button {
              @include btn-empty(#ffffff);
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
    }
  }
</style>

<template>
  <header id="header" class="container">
    <router-link class="logo" to="/">
      <img :src="$resize(`${$cdn.image}owner/logo`, { height: 56, mode: 2 })" alt="logo">
    </router-link>
    <div class="header-right">
      <button class="search-btn" @click="openSearchDrawer = true">
        <i class="iconfont icon-sousuo"></i>
      </button>
      <button class="create-btn">
        <i class="iconfont icon-pinglun" @click="handleCreateBtnClick"></i>
      </button>
      <write-post
        :post-id="createPostId"
        :bangumi-id="createBangumiId"
      ></write-post>
      <v-drawer
        from="top"
        size="30%"
        id="search"
        class="search-drawer"
        v-model="openSearchDrawer"
      >
        <div class="container">
          <div class="search-wrap">
            <button class="cancel" @click="openSearchDrawer = false">取消</button>
            <div class="content">
              <i class="iconfont icon-sousuo"></i>
              <span class="clear" @click="q = ''" v-show="q">×</span>
              <div class="input-wrap">
                <input
                  type="text"
                  v-model.trim="q"
                  placeholder="搜索番剧"
                  @keyup.enter="search()"
                >
              </div>
            </div>
          </div>
        </div>
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
            <div class="bg" :style="computeUserDrawerBg"></div>
            <div>
              <router-link :to="$alias.user(user.zone)" class="avatar">
                <img :src="$resize(user.avatar, { width: 50 })" alt="me">
              </router-link>
              <div class="panel">
                <div>
                  <router-link class="oneline" :to="$alias.user(user.zone)" v-text="user.nickname"></router-link>
                </div>
                <button @click="handleDaySign">{{ daySigned ? '已签到' : '签到' }}</button>
              </div>
            </div>
            <span class="badge">金币：{{ coinCount }} 个</span>
            <span class="badge">邀请码：{{ user.id }}</span>
          </div>
          <ul class="routes container" @click="switchUserDrawer = false">
            <li>
              <router-link :to="$alias.user(user.zone)">
                <i class="iconfont icon-zhuye"></i>
                个人主页
              </router-link>
            </li>
            <li>
              <router-link to="/me/setting">
                <i class="iconfont icon-shezhi"></i>
                用户设置
              </router-link>
            </li>
            <li>
              <router-link to="/notification/list">
                <i class="iconfont icon-nitification"></i>
                消息通知
                <span v-if="notificationCount" class="badge-count">{{ notificationCount }}</span>
              </router-link>
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
            v-show="showForgotForm"
            class="container"
            autocomplete="off"
            data-vv-scope="reset"
          >
            <div class="form-item">
              <label for="reset-access">手机号</label>
              <input name="access"
                     id="reset-access"
                     type="number"
                     v-validate="'required|numeric|len:11'"
                     v-model.trim="resetPassword.access"
                     @input="showResetCaptcha"
                     placeholder="登录的手机号">
            </div>
            <div class="form-item">
              <label for="reset-auth-code">验证码</label>
              <input type="text"
                     id="reset-auth-code"
                     name="auth-code"
                     v-validate="'required|len:6'"
                     v-model.trim="resetPassword.authCode"
                     @input="showResetCaptcha"
                     autocomplete="off"
                     placeholder="请填写验证码">
              <button class="checkAndSend"
                      @click="handleResetAuthCode"
                      type="button"
              >{{ getResetBtnText }}</button>
            </div>
            <div class="form-item">
              <label for="reset-new-secret">新密码</label>
              <input name="secret"
                     id="reset-new-secret"
                     type="password"
                     v-validate="'required|min:6|max:16'"
                     v-model.trim="resetPassword.secret"
                     autocomplete="off"
                     @input="showResetCaptcha"
                     placeholder="新密码">
            </div>
            <div
              class="captcha"
              data-text="提交"
              ref="resetCaptcha"
              @click="showResetCaptcha"
            ></div>
          </form>
          <form
            v-show="showRegisterForm"
            class="container"
            autocomplete="off"
            data-vv-scope="sign-up"
          >
            <div class="form-item">
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
            <div class="form-item">
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
            <div class="form-item">
              <label for="sign-up-auth-code">验证码</label>
              <input
                id="sign-up-auth-code"
                type="number"
                name="auth-code"
                v-validate="'required|numeric|len:6'"
                autocomplete="off"
                v-model.trim="signUp.authCode"
                @input="showSignUpCaptcha"
                placeholder="请填写验证码"
              >
              <button class="checkAndSend"
                      @click="handleRegisterAuthCode"
                      type="button"
              >{{ getAuthCodeBtnText }}</button>
            </div>
            <div class="form-item">
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
            <div class="form-item">
              <label for="sign-up-invite-code">邀请码</label>
              <input
                id="sign-up-invite-code"
                class="last-input"
                type="text"
                autocomplete="off"
                v-model.trim="signUp.inviteCode"
                @input="showSignUpCaptcha"
                placeholder="可为空"
              >
            </div>
            <div
              class="captcha btn-submit"
              data-text="注册"
              ref="signUpCaptcha"
              @click="showSignUpCaptcha"
            ></div>
            <div class="tip">
              提示：由于注册时要根据初始昵称为每个用户分配独立域名，因此注册时的昵称不支持日文和特殊符号和标点符号，可在注册完成后在个人设置页面修改昵称
            </div>
          </form>
          <form
            v-show="showLoginForm"
            class="container"
            autocomplete="off"
            data-vv-scope="sign-in"
          >
            <div class="form-item">
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
            <div class="form-item">
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
            <div
              class="captcha btn-submit"
              data-text="登录"
              ref="signInCaptcha"
              @click="showSignInCaptcha"
            ></div>
          </form>
          <button v-show="!showForgotForm" class="switch" @click="showRegisterForm ? switchSignModal('login') : switchSignModal('register')">{{ showRegisterForm ? '返回登录' : '立即注册' }}</button>
          <button class="switch" @click="showForgotForm ? switchSignModal('login') : switchSignModal('forgot')" v-show="!showRegisterForm">{{ showForgotForm ? '返回登录' : '忘记密码' }}</button>
        </v-drawer>
      </template>
    </div>
  </header>
</template>

<script>
  import UserApi from '~/api/userApi'
  import SearchApi from '~/api/searchApi'
  import WritePost from '~/components/post/Write'

  export default {
    name: 'v-header',
    components: {
      WritePost
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
      getAuthCodeBtnText () {
        if (this.signUpStep === 3) {
          return `${this.signUp.timeout}秒后可重新获取`
        } else if (this.signUpStep === 4) {
          return '点击重新获取'
        }
        return '点击获取验证码'
      },
      getResetBtnText () {
        if (this.resetStep === 3) {
          return `${this.resetPassword.timeout}秒后可重新获取`
        } else if (this.resetStep === 4) {
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
        const result = this.user.notification - this.$store.state.users.notifications.checked
        return result < 0 ? 0 : result
      },
      createPostId () {
        return this.$route.name === 'post-show' ? parseInt(this.$route.params.id, 10) : 0
      },
      createBangumiId () {
        return this.$route.name === 'bangumi-show' ? parseInt(this.$route.params.id, 10) : 0
      }
    },
    data () {
      return {
        signDayLoading: false,
        openSearchDrawer: false,
        switchUserDrawer: false,
        switchLoginDrawer: false,
        showRegisterForm: false,
        showForgotForm: false,
        showLoginForm: true,
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
        resetPassword: {
          captcha: false,
          access: '',
          secret: '',
          authCode: '',
          method: 'phone',
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
        signUpStep: 0,
        resetStep: 0,
        q: ''
      }
    },
    watch: {
      switchLoginDrawer (val) {
        if (val) {
          this.showSignInCaptcha()
        }
      },
      signUpStep (val) {
        if (val === 3) {
          this.signUp.timeout = 60
          const timer = setInterval(() => {
            if (!--this.signUp.timeout) {
              this.signUpStep = 4
              clearInterval(timer)
            }
          }, 1000)
        }
      },
      resetStep (val) {
        if (val === 3) {
          this.resetPassword.timeout = 60
          const timer = setInterval(() => {
            if (!--this.resetPassword.timeout) {
              this.resetStep = 4
              clearInterval(timer)
            }
          }, 1000)
        }
      }
    },
    methods: {
      switchSignModal (type) {
        if (type === 'forgot') {
          this.showLoginForm = false
          this.showRegisterForm = false
          this.showForgotForm = true
        } else if (type === 'login') {
          this.showForgotForm = false
          this.showRegisterForm = false
          this.showLoginForm = true
        } else if (type === 'register') {
          this.showForgotForm = false
          this.showLoginForm = false
          this.showRegisterForm = true
        }
      },
      handleFetch () {
        if (this.loading) {
          return
        }
        this.$emit('fetch')
      },
      openSignDrawer () {
        this.switchLoginDrawer = true
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
                    window.location = '/about/hello'
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
      showResetCaptcha () {
        if (!this.resetPassword.captcha) {
          this.$validator.validateAll('reset').then((result) => {
            if (result) {
              this.resetPassword.captcha = true
              this.$captcha({
                type: 'float',
                elem: this.$refs.resetCaptcha,
                success: ({ data, captcha }) => {
                  const api = new UserApi()
                  api.resetPassword({
                    method: this.resetPassword.method,
                    access: this.resetPassword.access,
                    authCode: this.resetPassword.authCode,
                    secret: this.resetPassword.secret,
                    geetest: data
                  }).then((res) => {
                    this.$toast.success(res)
                    this.switchSignModal('login')
                  }).catch((err) => {
                    this.resetPassword.captcha = false
                    this.$toast.error(err)
                    setTimeout(() => {
                      captcha.reset()
                    }, 500)
                  })
                },
                error: () => {
                  this.resetPassword.captcha = false
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
        window.location.href = '/'
      },
      async search (words) {
        const q = words || this.q
        if (!q.length) {
          return
        }
        this.$toast.loading('搜索中...')
        const api = new SearchApi()
        try {
          const url = await api.index({ q })
          window.location = url || '/bangumi/timeline'
          this.$toast.stop()
        } catch (e) {
          this.$toast.error(e)
        }
      },
      handleCreateBtnClick () {
        this.$store.state.login
          ? this.$channel.$emit('drawer-open-write-post')
          : this.$channel.$emit('drawer-open-sign')
      },
      async handleResetAuthCode () {
        const accessIsOK = await this.$validator.validate('reset.access')
        if (accessIsOK) {
          if (this.resetPassword.access !== this.resetPassword.tempAccess) {
            if (this.resetStep === 0 || this.resetStep === 4 || this.resetStep === 5) {
              this.resetStep = 1
              this.$captcha(({ data }) => {
                this.resetStep = 2
                this.getResetAuthCode(data)
              })
            }
          } else {
            this.$toast.warning(`请更换${this.signUp.method === 'email' ? '邮箱' : '手机'}`)
          }
        } else {
          this.$toast.warning(`请填写正确的${this.resetPassword.method === 'email' ? '邮箱' : '手机'}`)
        }
      },
      getResetAuthCode (geetest) {
        const api = new UserApi()
        this.resetPassword.tempAccess = this.resetPassword.access
        api.forgotPassword({
          method: this.resetPassword.method,
          access: this.resetPassword.access,
          nickname: this.resetPassword.nickname,
          mustNew: true,
          geetest
        }).then(() => {
          this.resetPassword.tempAccess = ''
          this.resetStep = 3
          this.$toast.success(`${this.resetPassword.method === 'email' ? '邮件' : '短信'}已发送，请查收`)
        }).catch((err) => {
          this.resetStep = 3
          this.$toast.error(err)
        })
      }
    },
    mounted () {
      this.$channel.$on('switch-to-register', result => {
        this.switchSignModal(result ? 'register' : 'login')
      })
    }
  }
</script>

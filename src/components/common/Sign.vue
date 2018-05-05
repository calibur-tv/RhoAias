<style lang="scss">
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
        width: 60px;
        background-color: #fff;
        font-size: 16px;
        line-height: 48px;
      }

      input {
        display: block;
        overflow: hidden;
        height: 100%;
        padding: 9px 0 9px 65px;
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
</style>

<template>
  <v-drawer
    v-model="openDrawer"
    from="bottom"
    size="100%"
    :header-text="showRegisterForm ? '注册' : '登录'"
    class="sign-drawer"
    id="sign"
    @open="showSignInCaptcha"
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
        >{{ getResetPwdBtnText }}</button>
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

<script>
  import UserApi from '~/api/userApi'

  export default {
    name: 'SignDrawer',
    computed: {
      getAuthCodeBtnText () {
        if (this.signUpStep === 3) {
          return `${this.signUp.timeout}秒后可重新获取`
        } else if (this.signUpStep === 4) {
          return '点击重新获取'
        }
        return '点击获取验证码'
      },
      getResetPwdBtnText () {
        if (this.resetStep === 3) {
          return `${this.resetPassword.timeout}秒后可重新获取`
        } else if (this.resetStep === 4) {
          return '点击重新获取'
        }
        return '点击获取验证码'
      }
    },
    data () {
      return {
        openDrawer: false,
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
         */
        signUpStep: 0,
        resetStep: 0
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
          this.showSignInCaptcha()
        } else if (type === 'register') {
          this.showForgotForm = false
          this.showLoginForm = false
          this.showRegisterForm = true
        }
      },
      showSignUpCaptcha () {
        if (!this.signUp.captcha && this.openDrawer) {
          this.$validator.validateAll('sign-up').then((result) => {
            if (result) {
              if (!(/^([\u4e00-\u9fa5]|[a-z0-9])+$/i.test(this.signUp.nickname))) {
                this.$toast.error('昵称不符合要求')
                return
              }
              if (!(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.signUp.access))) {
                this.$toast.error('错误的手机号格式')
                return
              }
              this.signUp.captcha = true
              const ele = this.$refs.signUpCaptcha
              ele.innerHTML = ''
              this.$toast.loading('加载中')
              this.$captcha({
                type: 'float',
                elem: ele,
                ready: () => {
                  this.$toast.stop()
                },
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
                error: (e) => {
                  this.$toast.error(e)
                  this.signUp.captcha = false
                },
                close: () => {
                  this.signUp.captcha = false
                }
              })
            }
          })
        }
      },
      showSignInCaptcha () {
        if (!this.signIn.captcha && this.openDrawer && this.showLoginForm) {
          this.$validator.validateAll('sign-in').then((result) => {
            if (result) {
              this.signIn.captcha = true
              const ele = this.$refs.signInCaptcha
              ele.innerHTML = ''
              this.$toast.loading('加载中')
              this.$captcha({
                type: 'float',
                elem: ele,
                ready: () => {
                  this.$toast.stop()
                },
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
                error: (e) => {
                  this.$toast.error(e)
                  this.signIn.captcha = false
                },
                close: () => {
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
              const ele = this.$refs.resetCaptcha
              ele.innerHTML = ''
              this.$toast.loading('加载中')
              this.$captcha({
                type: 'float',
                elem: ele,
                ready: () => {
                  this.$toast.stop()
                },
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
                error: (e) => {
                  this.$toast.error(e)
                  this.resetPassword.captcha = false
                },
                close: () => {
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
          if (!(/^([\u4e00-\u9fa5]|[a-z0-9])+$/i.test(this.signUp.nickname))) {
            this.$toast.error('昵称不符合要求')
            return
          }
          if (!(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.signUp.access))) {
            this.$toast.error('错误的手机号格式')
            return
          }
          const accessIsOK = await this.$validator.validate('sign-up.access')
          if (accessIsOK) {
            if (this.signUp.access !== this.signUp.tempAccess) {
              if (this.signUpStep === 0 || this.signUpStep === 4) {
                this.signUpStep = 1
                this.$toast.loading('加载中')
                this.$captcha({
                  ready: () => {
                    this.$toast.stop()
                  },
                  success: ({ data }) => {
                    this.signUpStep = 2
                    this.getRegisterAuthCode(data)
                  },
                  error: (e) => {
                    this.$toast.error(e)
                  }
                })
              }
            } else {
              this.$toast.error(`请更换${this.signUp.method === 'email' ? '邮箱' : '手机'}`)
            }
          } else {
            this.$toast.error(`请填写正确的${this.signUp.method === 'email' ? '邮箱' : '手机'}`)
          }
        } else {
          this.$toast.error('请先填写昵称')
        }
      },
      async getRegisterAuthCode (geetest) {
        const api = new UserApi()
        this.signUp.tempAccess = this.signUp.access
        try {
          await api.sendSignAuthCode({
            method: this.signUp.method,
            access: this.signUp.access,
            nickname: this.signUp.nickname,
            mustNew: true,
            geetest
          })
          this.signUp.tempAccess = ''
          this.$toast.success(`${this.signUp.method === 'email' ? '邮件' : '短信'}已发送，请查收`)
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.signUpStep = 3
          this.signUp.timeout = 60
          const timer = setInterval(() => {
            if (!--this.signUp.timeout) {
              this.signUpStep = 4
              clearInterval(timer)
            }
          }, 1000)
        }
      },
      async handleResetAuthCode () {
        const accessIsOK = await this.$validator.validate('reset.access')
        if (accessIsOK) {
          if (this.resetPassword.access !== this.resetPassword.tempAccess) {
            if (this.resetStep === 0 || this.resetStep === 4) {
              this.resetStep = 1
              this.$toast.loading('加载中')
              this.$captcha({
                ready: () => {
                  this.$toast.stop()
                },
                success: ({ data }) => {
                  this.resetStep = 2
                  this.getResetAuthCode(data)
                },
                error: (e) => {
                  this.$toast.error(e)
                }
              })
            }
          } else {
            this.$toast.error(`请更换${this.signUp.method === 'email' ? '邮箱' : '手机'}`)
          }
        } else {
          this.$toast.error(`请填写正确的${this.resetPassword.method === 'email' ? '邮箱' : '手机'}`)
        }
      },
      async getResetAuthCode (geetest) {
        const api = new UserApi()
        this.resetPassword.tempAccess = this.resetPassword.access
        try {
          await api.forgotPassword({
            method: this.resetPassword.method,
            access: this.resetPassword.access,
            nickname: this.resetPassword.nickname,
            mustNew: true,
            geetest
          })
          this.resetPassword.tempAccess = ''
          this.$toast.success(`${this.resetPassword.method === 'email' ? '邮件' : '短信'}已发送，请查收`)
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.resetStep = 3
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
    mounted () {
      this.$channel.$on('switch-to-register', result => {
        this.switchSignModal(result ? 'register' : 'login')
      })
    }
  }
</script>

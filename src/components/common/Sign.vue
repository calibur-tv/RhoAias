<style lang="scss">
  .sign-drawer {
    text-align: center;
  }
</style>

<template>
  <v-drawer
    v-model="openDrawer"
    from="bottom"
    size="100%"
    :header-text="showSignUp ? '注册' : showReset ? '找回密码' : '登录'"
    class="sign-drawer"
  >
    <div class="container">
      <div v-show="showSignIn">
        <reset-password-form
          v-show="showReset"
          @to-login="showReset = false"
          @to-register="showRegister"
        ></reset-password-form>
        <sign-in-form
          v-show="!showReset"
          @to-reset="showReset = true"
          @to-register="showRegister"
        ></sign-in-form>
      </div>
      <sign-up-form
        v-show="showSignUp"
        @to-login="showLogin"
      ></sign-up-form>
    </div>
    <!--
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
    <button v-show="!showForgotForm" class="switch" @click="showRegisterForm ? switchSignModal('login') : switchSignModal('register')">{{ showRegisterForm ? '回到登录' : '立即注册' }}</button>
    <button class="switch" @click="showForgotForm ? switchSignModal('login') : switchSignModal('forgot')" v-show="!showRegisterForm">{{ showForgotForm ? '返回登录' : '忘记密码' }}</button>
    -->
  </v-drawer>
</template>

<script>
  import SignInForm from '~/components/forms/SignInForm'
  import SignUpForm from '~/components/forms/SignUpForm'
  import ResetPasswordForm from '~/components/forms/ResetPasswordForm'

  export default {
    name: 'SignDrawer',
    components: {
      SignUpForm,
      SignInForm,
      ResetPasswordForm
    },
    data () {
      return {
        openDrawer: false,
        showSignIn: false,
        showSignUp: false,
        showReset: false
      }
    },
    methods: {
      showLogin () {
        this.showReset = false
        this.showSignIn = true
        this.showSignUp = false
        this.openDrawer = true
      },
      showRegister () {
        this.showSignUp = true
        this.showSignIn = false
        this.openDrawer = true
      }
    },
    mounted () {
      this.$channel.$on('sign-up', () => {
        this.showRegister()
      })
      this.$channel.$on('sign-in', (showToast = true) => {
        showToast && this.$toast.error('请先登录')
        this.showLogin()
      })
    }
  }
</script>

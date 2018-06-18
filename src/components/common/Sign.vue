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
    v-if="isGuest"
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
  </v-drawer>
  <user-drawer v-else></user-drawer>
</template>

<script>
  import SignInForm from '~/components/forms/SignInForm'
  import SignUpForm from '~/components/forms/SignUpForm'
  import ResetPasswordForm from '~/components/forms/ResetPasswordForm'
  import UserDrawer from '~/components/layouts/UserDrawer'

  export default {
    name: 'SignDrawer',
    components: {
      SignUpForm,
      SignInForm,
      ResetPasswordForm,
      UserDrawer
    },
    data () {
      return {
        openDrawer: false,
        showSignIn: false,
        showSignUp: false,
        showReset: false
      }
    },
    computed: {
      isGuest () {
        return !this.$store.state.login
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

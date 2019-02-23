<style lang="scss">
.sign-drawer {
  text-align: center;
}
</style>

<template>
  <div>
    <v-drawer
      v-if="isGuest"
      v-model="openDrawer"
      :header-text="showSignUp ? '注册' : showReset ? '找回密码' : '登录'"
      from="bottom"
      size="100%"
      class="sign-drawer"
    >
      <div class="container">
        <div v-show="showSignIn">
          <reset-password-form
            v-show="showReset"
            @to-login="showReset = false"
            @to-register="showRegister"
          />
          <sign-in-form
            v-show="!showReset"
            :invite-code="paramsIsOK ? query.uid : ''"
            @to-reset="showReset = true"
            @to-register="showRegister"
          />
        </div>
        <sign-up-form
          v-show="showSignUp"
          :invite-code="paramsIsOK ? query.uid : ''"
          @to-login="showLogin"
        />
      </div>
    </v-drawer>
    <template v-else>
      <user-drawer />
      <first-sign-drawer />
    </template>
  </div>
</template>

<script>
import SignInForm from '~/components/forms/SignInForm'
import SignUpForm from '~/components/forms/SignUpForm'
import ResetPasswordForm from '~/components/forms/ResetPasswordForm'
import UserDrawer from '~/components/layouts/UserDrawer'
import FirstSignDrawer from '~/components/drawers/FirstSignDrawer'

export default {
  name: 'SignDrawer',
  components: {
    SignUpForm,
    SignInForm,
    ResetPasswordForm,
    UserDrawer,
    FirstSignDrawer
  },
  data() {
    return {
      openDrawer: false,
      showSignIn: false,
      showSignUp: false,
      showReset: false
    }
  },
  computed: {
    isGuest() {
      return !this.$store.state.login
    },
    query() {
      return this.$route.query
    },
    paramsIsOK() {
      return !!(
        this.query.uid &&
        /^\d+$/.test(this.query.uid) &&
        this.query.time &&
        /^\d+$/.test(this.query.time) &&
        Date.now() <= this.query.time * 1000 &&
        this.query.key ===
          this.$md5(`${this.query.uid}-the-world-${this.query.time}`)
      )
    }
  },
  mounted() {
    this.$channel.$on('sign-up', () => {
      this.showRegister()
    })
    this.$channel.$on('sign-in', (showToast = true) => {
      showToast && this.$toast.error('请先登录')
      this.showLogin()
    })
  },
  methods: {
    showLogin() {
      this.showReset = false
      this.showSignIn = true
      this.showSignUp = false
      this.openDrawer = true
    },
    showRegister() {
      this.showSignUp = true
      this.showSignIn = false
      this.openDrawer = true
    }
  }
}
</script>

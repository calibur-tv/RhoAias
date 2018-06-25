<style lang="scss">
  #invite-user {
    .container {
      padding-bottom: $container-padding;
    }

    .sub-title {
      margin-top: 30px;
      margin-bottom: 15px;
      margin-left: 13px;
    }

    .signed {
      height: 75vh;
      text-align: center;
      font-size: 14px;
      color: $color-text-normal;
      padding-top: 100px;
      line-height: 30px;

      a {
        color: $color-blue-normal;
      }
    }
  }
</style>

<template>
  <div id="invite-user">
    <div class="container">
      <template v-if="isGuest">
        <h3 class="sub-title">欢迎注册 calibur.tv</h3>
        <sign-up-form
          :invite-code="inviteUserId"
        ></sign-up-form>
      </template>
      <p class="signed" v-else>
        你已经是注册用户了 (￣3￣)
        <br>
        快来邀请小伙伴一起注册 calibur 吧
        <br>
        点击查看<a href="/me/invite">我的邀请码</a>
      </p>
    </div>
  </div>
</template>

<script>
  import SignUpForm from '~/components/forms/SignUpForm'

  export default {
    name: 'invite-user',
    components: {
      SignUpForm
    },
    computed: {
      inviteUserId () {
        return this.$route.params.id
      },
      isGuest () {
        return !this.$store.state.login
      }
    }
  }
</script>

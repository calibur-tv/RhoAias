<style lang="scss">
#invite-user {
  .container {
    padding-bottom: $container-padding;
  }

  .sub-title {
    margin-top: 20px;
    margin-bottom: 15px;
  }

  .tips {
    background-color: #f4f4f5;
    color: #909399;
    padding: 12px 16px 8px 16px;
    border-radius: 4px;
    margin-bottom: 20px;

    p {
      color: $color-text-normal;
      margin-bottom: 5px;
      font-size: 13px;
      line-height: 18px;
    }

    a {
      color: $color-blue-normal;
      font-size: 13px;
    }
  }

  .sign-wrap {
    margin-top: 20px;
  }

  .signed {
    height: 112px;
    text-align: center;
    font-size: 14px;
    margin-top: 110px;
    line-height: 30px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 20px 20px;
    border-radius: 10px;
    color: $color-text-normal;

    a {
      color: $color-blue-normal;
    }
  }
}
</style>

<template>
  <div id="invite-user">
    <div class="container">
      <p v-if="haveAuthToken" class="signed">
        你已经是注册用户了 (￣3￣)
        <br />
        把这个网址链接发给小伙伴，或者告诉TA你的邀请码就行啦
        <br />
        快来邀请小伙伴一起注册 calibur 吧
        <br />
        点击查看<nuxt-link to="/my/invite">
          我的邀请码
        </nuxt-link>
      </p>
      <div v-else-if="isGuest" class="sign-wrap">
        <h3 class="sub-title">
          欢迎来到 calibur.tv
        </h3>
        <sign-up-form :invite-code="id" />
      </div>
    </div>
  </div>
</template>

<script>
import SignUpForm from '~/components/forms/SignUpForm'

export default {
  name: 'InviteUser',
  components: {
    SignUpForm
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  head: {
    title: '邀请注册'
  },
  computed: {
    haveAuthToken() {
      return this.$store.state.haveAuthToken
    },
    isGuest() {
      return !this.$store.state.login
    }
  }
}
</script>

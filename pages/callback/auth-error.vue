<style lang="scss">
#auth-error {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -$header-hgt;

  p {
    color: $color-pink-deep;
    margin-bottom: 10px;
    font-size: 20px;
  }
}
</style>

<template>
  <div id="auth-error">
    <p v-text="message" />
    <a href="/">点击返回首页</a>
  </div>
</template>

<script>
export default {
  name: 'AuthError',
  computed: {
    message() {
      return this.$route.query.message
    }
  }
}
</script>

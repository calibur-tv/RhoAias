<style lang="scss">
#auth-redirect {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -$header-hgt;

  p {
    color: $color-blue-normal;
    margin-bottom: 10px;
    font-size: 20px;
  }
}
</style>

<template>
  <div id="auth-redirect">
    <p>{{ message }}，正在返回首页</p>
  </div>
</template>

<script>
export default {
  name: 'AuthRedirect',
  data() {
    return {
      timer: 5
    }
  },
  computed: {
    message() {
      return this.$route.query.message
    }
  },
  mounted() {
    this.$cookie.set('JWT-TOKEN', this.$route.query.token, {
      expires: 365
    })
    window.location = 'https://www.calibur.tv'
  }
}
</script>

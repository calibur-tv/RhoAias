<style lang="scss">
#auth-success {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    color: $color-blue-normal;
    margin-bottom: 10px;
    font-size: 20px;
  }
}
</style>

<template>
  <div id="auth-success">
    <p>
      {{ message }}，正在返回首页
    </p>
  </div>
</template>

<script>
export default {
  name: 'AuthSuccess',
  computed: {
    message() {
      return this.$route.query.message
    }
  },
  mounted() {
    window.location = 'https://www.calibur.tv'
  }
}
</script>

<style lang="scss">
#error-404 {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -$header-hgt;

  img {
    border-radius: 50%;
    width: 250px;
    height: 250px;
  }

  p {
    font-size: 13px;
    margin-top: 15px;
  }

  a {
    font-size: 13px;
    color: $color-pink-deep;
  }
}
</style>

<template>
  <div id="error-404">
    <img src="~assets/img/error/404.jpeg">
    <p>你闯入了未知的页面，返回<nuxt-link to="/">首页</nuxt-link>吧，少年！</p>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>

<style lang="scss">
#error-page {
  position: relative;
  height: 100vh;

  .error-main {
    position: absolute;
    text-align: center;
    width: 100%;
    padding: 0 10%;
    top: 50%;
    margin-top: -220px;

    img {
      width: 180px;
      border-radius: 50%;
    }

    h3 {
      margin: 20px 0;
      font-weight: bold;
    }

    .subtitle {
      margin-bottom: 20px;
      font-size: 14px;
    }
  }
}
</style>

<template>
  <div id="error-page">
    <div class="error-main">
      <div v-if="statusCode === 401" id="error-401">
        <img
          src="~assets/img/error/503.jpeg"
          alt="error-401"
          @click="toastMessage"
        >
        <h3>请登录后重新访问</h3>
        <button class="back" @click="handleLogin">
          登录
        </button>
      </div>
      <div v-else-if="statusCode === 403" id="error-403">
        <img src="~assets/img/error/500.jpeg" alt="error-403">
        <h3>您没有权限访问该页面</h3>
        <a href="/" class="back">回到首页</a>
      </div>
      <div v-else-if="statusCode === 404" id="error-404">
        <img
          src="~assets/img/error/404.jpeg"
          alt="error-404"
          @click="toastMessage"
        >
        <h3>您要找的页面不存在</h3>
        <div class="subtitle">
          不存在的，或者正在审核中。
        </div>
        <nuxt-link class="back" to="/">
          返回首页
        </nuxt-link>
      </div>
      <div v-else-if="statusCode === 500" id="error-500">
        <img
          src="~assets/img/error/500.jpeg"
          alt="error-500"
          @click="toastMessage"
        >
        <h3>服务器出错了</h3>
        <div class="subtitle">
          服务器出了点问题，工程师正在加紧抢修ヽ( ° ▽°)ノ
        </div>
        <nuxt-link class="back" to="/">
          返回首页
        </nuxt-link>
      </div>
    </div>
    <SignDrawer />
  </div>
</template>

<script>
import SignDrawer from '~/components/common/Sign'

export default {
  name: 'nuxt-error', // eslint-disable-line
  components: {
    SignDrawer
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head: {
    title: '出错了'
  },
  computed: {
    statusCode() {
      if (this.message === '继续操作前请先登录') {
        return 401
      }
      if (this.message === '请在APP内打开该页面') {
        return 403
      }
      return (this.error && this.error.statusCode) || 404
    },
    message() {
      return (this.error && this.error.message) || '您要找的页面不存在'
    }
  },
  methods: {
    handleLogin() {
      this.$channel.$emit('sign-in')
    },
    toastMessage() {
      this.$toast.error(this.message)
    }
  }
}
</script>

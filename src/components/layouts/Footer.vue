<style lang="scss">
  #footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #999;
    padding-bottom: $container-padding;
    font-size: 13px;
    background-color: #ffffff;

    .panel {
      margin-top: 14px;

      a, button {
        padding: 0 16px;
        color: #666;
        font-size: 12px;

        &:not(:last-child) {
          position: relative;

          &:after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: #ccc;
            right: 0;
          }
        }
      }
    }

    .beian {
      margin-top: 20px;
      padding-bottom: 8px;
    }
  }
</style>

<template>
  <footer id="footer">
    <div class="panel">
      <button @click="logout" v-if="$store.state.login">退出</button>
      <template v-else>
        <button @click="login">登录</button>
        <button @click="register">注册</button>
      </template>
      <button @click="$channel.$emit('open-feedback')">反馈</button>
      <a href="/about/hello">欢迎</a>
      <button @click="$channel.$emit('open-share')">分享</button>
    </div>
    <p class="beian">© 沪ICP备17050785号-1</p>
  </footer>
</template>

<script>
  import UserApi from '~/api/userApi'

  export default {
    name: 'v-footer',
    methods: {
      logout () {
        this.$cookie.remove('JWT-TOKEN')
        const api = new UserApi(this)
        api.logout()
        window.location.reload()
      },
      login () {
        this.$channel.$emit('sign-in', (false))
      },
      register () {
        this.$channel.$emit('sign-up')
      }
    }
  }
</script>

<style lang="scss">
  #error-page {
    .logo {
      position: absolute;
      height: 48px;
      left: 10px;
      top: 10px;
    }

    .main {
      position: absolute;
      text-align: center;
      width: 100%;
      padding: 0 10%;
      top: 50%;
      margin-top: -220px;

      img {
        width: 180px;
      }

      h3 {
        margin: 20px 0;
        font-weight: bold;
      }

      .subtitle {
        margin-bottom: 20px;
        font-size: 14px;
      }

      .back {
        display: inline-block;
        text-align: center;
        padding: 10px 0;
        width: 60%;
        margin: 12px 0;
        background: $color-green;
        border-radius: 50px;
        color: $color-day;
        border: 1px solid $color-green;
      }
    }

    .download {
      position: absolute;
      bottom: 5px;
      width: 90%;
      padding: 15px 0;
      margin: 0 5%;
      border-top: 1px solid #eee;
      text-align: center;

      .ic-appdownload {
        font-size: 48px;
        color: $color-placeholder;
      }

      .info {
        display: inline-block;
        text-align: left;
        font-size: 15px;
        color: $color-text;

        p {
          padding: 0;
          margin: 4px 0;
          font-size: 12px;
          color: $color-placeholder;
        }
      }
    }
  }
</style>

<template>
  <div id="error-page">
    <img src="~assets/img/nav-logo.png" class="logo" alt="error-logo">
    <div class="main main-404" v-if="error.statusCode === 404">
      <img src="~assets/img/error-404.png" alt="error-404">
      <h3>您要找的页面不存在</h3>
      <div class="subtitle">
        可能是因为您的链接地址有误，该页面已经被作者删除或转为私密状态。
      </div>
      <router-link class="back" :to="'/'">返回「简书」首页</router-link>
    </div>
    <div class="main main-500" v-else>
      <img src="~assets/img/error-500.png" alt="error-500">
      <h3>服务器出错了</h3>
      <div class="subtitle">
        服务器出了点问题，工程师正在加紧抢修ヽ( ° ▽°)ノ
      </div>
      <router-link class="back" :to="'/'">返回「简书」首页</router-link>
    </div>
    <div class="download">
      <i class="iconfont ic-appdownload"></i>
      <div class="info">
        免费下载简书手机 App
        <i class="iconfont ic-link"></i>
        <p>随时随地发现和创作内容</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'empty',
    props: ['error']
  }
</script>

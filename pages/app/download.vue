<style lang="scss">
#app-download {
  height: calc(100vh - 48px);
  overflow: hidden;
  position: relative;

  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 200px;

    .info {
      img {
        width: 50px;
        height: 50px;
        float: left;
        margin-right: 10px;
        border-radius: 5px;
      }

      .text {
        height: 50px;
        overflow: hidden;
        font-size: 30px;
        line-height: 30px;

        p {
          margin-top: 4px;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }

    button {
      width: 200px;
      border-radius: 20px;
      background-color: $color-pink-deep;
      color: #fff;
      height: 40px;
      line-height: 40px;
      margin-top: 20px;
      font-size: 16px;
      text-align: center;
      margin-bottom: 25vh;
    }

    .wx-app {
      img {
        width: 200px;
        height: 200px;
      }

      p {
        text-align: center;
        font-size: 12px;
        line-height: 24px;
        margin-top: 20px;
      }
    }
  }
}
</style>

<template>
  <div id="app-download">
    <div class="content">
      <template v-if="info.download_ur">
        <div class="info">
          <img
            src="https://image.calibur.tv/owner/logo/icon-1024.png-share120jpg"
          >
          <div class="text">
            calibur.tv
            <p>天下漫友是一家</p>
          </div>
        </div>
        <a :href="info.download_url" target="_blank">
          <button>立即下载</button>
        </a>
      </template>
      <div
        v-else
        class="wx-app"
      >
        <img
          src="~assets/img/wx-app-qrcode.jpg"
        >
        <p>APP研发中<br>可先通过微信扫码获取小程序</p>
      </div>
    </div>
    <VueParticles />
  </div>
</template>

<script>
import VueParticles from '~/components/particles/index.vue'
import { downloadUrl } from '~/api/appApi'

export default {
  name: 'AppDownload',
  components: {
    VueParticles
  },
  data() {
    return {
      info: null
    }
  },
  asyncData({ app, req }) {
    const userAgent = process.server
      ? req.headers['user-agent'].toLowerCase()
      : window.navigator.userAgent.toLowerCase()
    const iOS = userAgent.match(/iphone|ipad|ipod/) !== null
    return downloadUrl(app, {
      type: iOS ? 2 : 1
    }).then(info => {
      return { info }
    })
  },
  head: {
    title: 'APP下载'
  }
}
</script>

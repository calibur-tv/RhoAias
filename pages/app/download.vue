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

    .not-work {
      background-color: $color-text-light;
    }
  }
}
</style>

<template>
  <div id="app-download">
    <div class="content">
      <div class="info">
        <img
          src="https://image.calibur.tv/owner/logo-new/logo.png?imageMogr2/auto-orient/strip|imageView2/1/w/200/h/200/format/jpg"
        >
        <div class="text">
          calibur.tv
          <p>天下漫友是一家</p>
        </div>
      </div>
      <a
        v-if="info.download_url"
        :href="info.download_url"
        target="_blank"
      >
        <button>立即下载</button>
      </a>
      <button
        v-else
        class="not-work"
      >开发中~TuT</button>
    </div>
    <vue-particles/>
  </div>
</template>

<script>
import VueParticles from '~/components/particles/index.vue'
import { downloadUrl } from '~/api/appApi'

export default {
  name: 'AppDownload',
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
  components: {
    VueParticles
  },
  head: {
    title: 'APP下载'
  },
  data() {
    return {
      info: null
    }
  }
}
</script>

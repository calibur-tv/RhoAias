<style lang="scss">
$main-color: #fb7784;
#app-invite {
  width: 100%;
  height: 100%;
  background-color: $main-color;

  .capture-area {
    width: 100%;
    height: 100%;
    padding-top: 15px;
    position: relative;
    background-color: $main-color;

    #background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .main {
      background-color: white;
      margin: 0 15px 15px;
      border-radius: 10px;
      padding: 50px 0 25px;
      background-image: url(~img/campaign/invite-bg.png);
      background-size: contain;
      background-repeat: no-repeat;

      .avatar {
        margin: 0 auto;
        border: 10px solid white;
        width: 100px;
        height: 100px;
        @extend %avatar;
      }

      .nickname {
        font-size: 21px;
        font-weight: bold;
        margin-top: 5px;
        margin-left: 15px;
        margin-right: 15px;
        text-align: center;
        color: #333;

        strong {
          color: $main-color;
        }
      }

      .info {
        font-size: 14px;
        margin-top: 10px;
        text-align: center;

        strong {
          color: $main-color;
        }
      }

      .tags {
        margin: 20px 10px;
        text-align: center;
        height: 53px;
        overflow: hidden;

        .mint-badge {
          border-radius: 10px;
          font-size: 12px;
          padding: 4px 10px;
          margin: 3px;
          background-color: $main-color;
        }
      }

      .logo {
        margin: 0 auto;
        width: 90px;
        height: 50px;
        background-image: url(~img/campaign/calibur-logo.png);
        background-size: contain;
        background-repeat: no-repeat;
      }
    }

    .qrcode-wrap {
      position: relative;
      margin: 0 15px 15px;
      background-color: white;
      border-radius: 10px;

      .qrcode {
        margin-left: 10px;
        width: 100px;
        height: 100px;
        padding: 15px;
      }

      .tips {
        position: absolute;
        top: 30px;
        left: 110px;
        margin-top: -12px;
        font-size: 13px;
        line-height: 21px;
      }
    }
  }
}
</style>

<template>
  <div id="app-invite">
    <img
      v-if="result"
      :src="result">
    <div
      v-else-if="user"
      class="capture-area">
      <div class="main">
        <div class="avatar">
          <img
            :src="$resize(user.avatar, { width: 200 })"
            crossorigin="anonymous">
        </div>
        <p class="nickname">我是<strong>{{ user.nickname }}</strong></p>
        <p class="info">跟我一起在 <strong>calibur.tv</strong> 追番吧</p>
        <no-ssr>
          <div class="tags">
            <mt-badge
              v-for="(tag, index) in tags"
              :key="index"
              size="large"
              v-text="tag"
            />
          </div>
        </no-ssr>
        <div class="logo"/>
      </div>
      <div class="qrcode-wrap">
        <div
          ref="qr"
          class="qrcode"/>
        <p class="tips">
          <strong>扫描二维码注册</strong><br>
          <strong>邀请者可获得团子奖励</strong><br>
          求扫求转发！
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { Badge } from 'mint-ui'

export default {
  name: 'AppInvite',
  components: {
    'mt-badge': Badge
  },
  head: {
    title: '我的邀请码'
  },
  data() {
    return {
      created: false,
      result: '',
      cartoons: [
        '喰种',
        '死亡笔记',
        '刀剑神域',
        '一拳超人',
        '进击的巨人',
        '海贼王',
        'CLANNAD',
        '叛逆的鲁鲁修',
        '七宗罪',
        'JOJO的奇妙冒险',
        '火影忍者',
        '从零开始的异界生活'
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    link() {
      return this.user
        ? `https://m.calibur.tv/about/invite/${this.user.id}`
        : 'https://m.calibur.tv/'
    },
    tags() {
      return this.$utils.shuffle(this.cartoons).slice(0, 5)
    }
  },
  mounted() {
    if (!this.user) {
      this.$toast.error('请先登录')
      return
    }
    this.$nextTick(() => {
      this.generateQrCode()
    })
  },
  methods: {
    generateQrCode() {
      import('~/assets/js/qrcode').then(ESModule => {
        const QRCode = ESModule.default
        new QRCode(this.$refs.qr, {
          text: this.link,
          width: 300,
          height: 300
        })
        /*
        setTimeout(() => {
          this.create();
        }, 3000);
        */
      })
    },
    create() {
      if (!this.$store.state.ua.ios) {
        return
      }
      html2canvas(document.querySelector('.capture-area'), {
        allowTaint: false,
        useCORS: true,
        backgroundColor: null
      })
        .then(canvas => {
          this.result = canvas.toDataURL('image/png')
          this.created = true
          this.$toast.success('长按图片保存')
        })
        .catch(() => {})
    }
  }
}
</script>

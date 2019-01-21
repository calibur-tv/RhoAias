<style lang="scss">
#app-invite {
  padding-top: 15px;
  position: relative;
  height: 600px;
  margin: 0 auto;
  overflow: hidden;
  background-color: #c73230;
  min-height: 100vh;

  .top-bg {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    background-image: url('~assets/img/invite/top.png');
    background-position: center top;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .bottom-bg {
    position: absolute;
    bottom: -1px;
    right: 0;
    left: 0;
    top: 0;
    background-image: url('~assets/img/invite/bottom.png');
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .capture-area {
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    padding-top: 50px;
    position: relative;
    background-color: #c73230;

    #background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .main {
      position: relative;
      background-color: white;
      margin: 0 30px 30px;
      border-radius: 20px;
      padding-top: 45px;
      padding-bottom: 45px;

      .border-outline {
        position: relative;
        height: 100%;
        margin-left: 44px;
        margin-right: 44px;
        border: 2px solid #c7bfb0;

        &:before {
          position: absolute;
          content: '';
          left: -6px;
          top: -6px;
          right: -6px;
          bottom: -6px;
          border: 2px solid #c7bfb0;
        }
      }

      .avatar-wrap {
        position: relative;
        height: 262px;
        padding-top: 100px;

        .avatar {
          margin: 0 auto;
          border: 6px solid #fb5956;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          position: relative;
          z-index: 2;

          .avatar-hat {
            position: absolute;
            right: -5px;
            top: -45px;
            width: 84px;
            height: 74px;
            background-image: url('~assets/img/invite/hat.png');
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
          }
        }

        .avatar-bg {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 406px;
          height: 136px;
          margin-top: 45px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          transform: translate(-50%, -50%);
          background-image: url('~assets/img/invite/calibur.png');
          z-index: 0;
        }

        img {
          border-radius: 50%;
        }
      }

      .nickname {
        font-size: 38px;
        font-weight: bold;
        margin-top: 12px;
        margin-left: 30px;
        margin-right: 30px;
        text-align: center;
        color: #333;

        strong {
          color: #49689b;
          margin-left: 5px;
        }
      }

      .info {
        font-size: 28px;
        margin-top: 10px;
        text-align: center;

        strong {
          color: #ff6881;
          margin-left: 5px;
          margin-right: 5px;
        }
      }

      .tags {
        margin: 38px 50px;
        text-align: center;
        height: 116px;
        overflow: hidden;

        .badge {
          display: inline-block;
          position: relative;
          height: 50px;
          line-height: 50px;
          background-color: #ff6881;
          padding: 0 20px;
          margin-right: 20px;
          border-radius: 0 8px 0 8px;
          font-size: 0;
          margin-bottom: 16px;

          &:after {
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            right: -8px;
            width: 0;
            height: 0;
            border: 10px solid;
            border-color: transparent;
            border-bottom-color: #ff6881;
          }

          img {
            width: 22px;
            height: 22px;
            margin-right: 8px;
            margin-left: -8px;
            vertical-align: middle;
          }

          span {
            display: inline-block;
            color: #fff;
            font-size: 24px;
            vertical-align: middle;
          }
        }
      }

      .line {
        margin-left: 60px;
        margin-right: 60px;
        height: 1px;
        background-color: #f4f3f0;
        margin-bottom: 50px;
      }

      .intro {
        text-align: center;
        font-size: 24px;
        line-height: 34px;

        span {
          color: #333333;
        }

        strong {
          color: #ff6881;
          font-weight: bold;
          margin-left: 2px;
        }
      }

      .qr {
        width: 180px;
        height: 180px;
        margin: 17px auto 33px;
      }

      .slogan {
        width: 240px;
        height: 50px;
        background-image: url('~assets/img/invite/slogan.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        margin: 0 auto 120px;
      }
    }

    .snow-left {
      position: absolute;
      left: -55px;
      top: -105px;
      width: 220px;
      height: 104px;
      background-image: url('~assets/img/invite/uk-left.png');
      background-repeat: no-repeat;
      background-position: left top;
      background-size: contain;
    }

    .snow-right {
      position: absolute;
      right: -55px;
      top: -90px;
      height: 94px;
      width: 300px;
      background-image: url('~assets/img/invite/uk-right.png');
      background-repeat: no-repeat;
      background-position: left top;
      background-size: contain;
    }
  }
}
</style>

<template>
  <div
    v-if="user"
    id="app-invite"
  >
    <img
      v-if="result"
      :src="result"
    >
    <div
      v-else
      class="capture-area"
    >
      <div class="main">
        <div class="border-outline">
          <div class="avatar-wrap">
            <div class="avatar-bg"/>
            <div class="avatar">
              <div class="avatar-hat"/>
              <img
                :src="$resize(user.avatar, { width: 200 })"
                crossorigin="anonymous"
              >
            </div>
          </div>
          <p class="nickname">我是<strong>{{ user.nickname }}</strong></p>
          <p class="info">和我一起在 <strong>calibur.tv</strong> 追番吧</p>
          <div class="tags">
            <div
              v-for="(tag, index) in tags"
              :key="index"
              class="badge"
            >
              <img src="~assets/img/invite/icon.png">
              <span>{{ tag }}</span>
            </div>
          </div>
          <div class="line"/>
          <div class="intro"><span>快扫码注册(๑˃́ꇴ˂̀๑)，邀请者有</span><strong>团子奖励</strong></div>
          <div class="logo"/>
          <div
            ref="qr"
            class="qr"
          />
          <div class="slogan"/>
          <div class="snow-left"/>
          <div class="snow-right"/>
          <div class="border-out"/>
          <div class="border-inner"/>
        </div>
      </div>
      <div class="top-bg"/>
      <div class="bottom-bg"/>
    </div>
  </div>
</template>

<script>
import serverAuth from '~/mixins/serverAuth'

export default {
  name: 'PageUserInvite',
  layout: 'empty',
  head: {
    title: '邀请码'
  },
  mixins: [serverAuth],
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
        '战栗杀机',
        'CLANNAD',
        'JOJO'
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    link() {
      return this.user ? `http://calibur.tv/about/invite/${this.user.id}` : ''
    },
    tags() {
      return this.$utils.shuffle(this.cartoons).slice(0, 5)
    }
  },
  mounted() {
    if (!this.user) {
      this.$toast.error('请先登录').then(() => {
        window.location.href = '/'
      })
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
          width: 360,
          height: 360
        })
      })
    }
  }
}
</script>

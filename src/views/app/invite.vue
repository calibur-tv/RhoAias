<style lang="scss">
$main-color: #fb7784;
#app-invite {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: $main-color;

  .capture-area {
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    padding-top: 30px;
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
      margin: 0 30px 30px;
      border-radius: 20px;
      padding: 100px 0 50px;
      background-image: url(~img/campaign/invite-bg.png);
      background-size: contain;
      background-repeat: no-repeat;

      .avatar {
        margin: 0 auto;
        border: 10px solid white;
        width: 200px;
        height: 200px;
        @extend %avatar;
      }

      .nickname {
        font-size: 42px;
        font-weight: bold;
        margin-top: 10px;
        margin-left: 30px;
        margin-right: 30px;
        text-align: center;
        color: #333;

        strong {
          color: $main-color;
        }
      }

      .info {
        font-size: 28px;
        margin-top: 20px;
        text-align: center;

        strong {
          color: $main-color;
        }
      }

      .tags {
        margin: 40px 20px;
        text-align: center;
        height: 106px;
        overflow: hidden;

        .mint-badge {
          border-radius: 20px;
          font-size: 24px;
          padding: 8px 20px;
          margin: 6px;
          background-color: $main-color;
        }
      }

      .logo {
        margin: 0 auto;
        width: 180px;
        height: 100px;
        background-image: url(~img/campaign/calibur-logo.png);
        background-size: contain;
        background-repeat: no-repeat;
      }
    }

    .qrcode-wrap {
      position: relative;
      margin: 0 30px 30px;
      background-color: white;
      border-radius: 20px;

      .qrcode {
        margin-left: 20px;
        width: 200px;
        height: 200px;
        padding: 30px;
      }

      .tips {
        position: absolute;
        top: 60px;
        left: 220px;
        margin-top: -24px;
        font-size: 26px;
        line-height: 42px;
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
          <strong>邀请者可获得现金奖励</strong><br>
          求扫求转发！
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  name: "AppInvite",
  data() {
    return {
      created: false,
      result: "",
      cartoons: [
        "喰种",
        "死亡笔记",
        "刀剑神域",
        "一拳超人",
        "进击的巨人",
        "海贼王",
        "CLANNAD",
        "叛逆的鲁鲁修",
        "七宗罪",
        "JOJO的奇妙冒险",
        "火影忍者",
        "从零开始的异界生活"
      ]
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    link() {
      return this.user
        ? `https://m.calibur.tv/about/invite/${this.user.id}`
        : "https://m.calibur.tv/";
    },
    tags() {
      return this.$utils.shuffle(this.cartoons).slice(0, 5);
    }
  },
  mounted() {
    if (!this.user) {
      this.$toast.error("请先登录");
      return;
    }
    this.$nextTick(() => {
      this.generateQrCode();
      setTimeout(() => {
        this.create();
      }, 3000);
    });
  },
  methods: {
    generateQrCode() {
      this.$QRCode(this.$refs.qr, this.link, { width: 300, height: 300 });
    },
    create() {
      html2canvas(document.querySelector(".capture-area"), {
        allowTaint: false,
        useCORS: true,
        backgroundColor: null
      })
        .then(canvas => {
          this.result = canvas.toDataURL("image/png");
          this.created = true;
          if (this.$store.state.ua.ios) {
            this.$toast.success("长按图片保存");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

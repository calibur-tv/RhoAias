<style lang="scss">
#user-invite {
  background-color: #fff;
  padding: 20px 0;

  .capture-wrap {
    box-shadow: 0 4px 10px #ddd;
    width: 300px;
    height: 518px;
    margin: 0 auto 20px auto;
    border-radius: 5px;
    overflow: hidden;

    .capture-area {
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      transform-origin: 0 0;
      padding-top: 30px;
      position: relative;
      background-color: #fd8ab4;

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
            color: $color-pink-deep;
          }
        }

        .info {
          font-size: 28px;
          margin-top: 20px;
          text-align: center;

          strong {
            color: $color-pink-deep;
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
            background-color: #fd8ab4;
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

  .intros {
    li {
      list-style-type: disc;
      font-size: 13px;
      line-height: 15px;
      margin-left: 15px;
      margin-bottom: 5px;
    }
  }
}
</style>

<template>
  <div
    v-if="user"
    id="user-invite"
  >
    <div class="container">
      <h3 class="sub-title">邀请码{{ created ? '（长按图片可保存到手机相册）' : '' }}</h3>
    </div>
    <div class="capture-wrap">
      <img 
        v-if="result" 
        :src="result">
      <div 
        v-else 
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
    <div class="container">
      <h3 class="sub-title">使用介绍</h3>
      <ul class="intros">
        <li>非常感谢大家对 calibur.tv 的支持</li>
        <li>目前网站还在初始阶段，为了促进推广，因此推出了团子功能</li>
        <li>大家除了每日签到、发表原创内容来赚取团子外</li>
        <li>还可以通过邀请朋友注册来赚取团子</li>
        <li>每有一个人通过扫你的二维码注册，你就会获得一个团子，并会收到短信通知</li>
        <li>1团子 = 1人民币，满 100 团子可提现</li>
        <li>大家快去邀请自己的漫友来 calibur 一起玩耍吧！</li>
        <li v-if="created">长按图片可保存到手机相册，更方便分享</li>
      </ul>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { Badge } from "mint-ui";

export default {
  name: "PageUserInvite",
  components: {
    "mt-badge": Badge
  },
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
      return this.user ? `http://calibur.tv/about/invite/${this.user.id}` : "";
    },
    tags() {
      return this.$utils.shuffle(this.cartoons).slice(0, 5);
    }
  },
  mounted() {
    if (!this.user) {
      this.$toast.error("请先登录").then(() => {
        window.location.href = "/";
      });
      return;
    }
    this.$nextTick(() => {
      this.generateQrCode();
    });
  },
  methods: {
    generateQrCode() {
      import("~/assets/js/qrcode").then(ESModule => {
        const QRCode = ESModule.default;
        new QRCode(this.$refs.qr, {
          text: this.link,
          width: 300,
          height: 300
        });
        setTimeout(() => {
          this.create();
        }, 3000);
      });
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
          this.$toast.success("长按图片保存");
        })
        .catch(() => {});
    }
  }
};
</script>

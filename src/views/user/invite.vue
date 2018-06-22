<style lang="scss">
  #user-invite {
    background-color: #fff;
    padding: 20px 0;

    .capture-wrap {
      box-shadow: 0 4px 10px #ddd;
      width: 300px;
      height: 450px;
      margin: 0 auto 20px auto;
      border-radius: 5px;
      overflow: hidden;

      .capture-area {
        width: 200%;
        height: 200%;
        transform: scale(.5);
        transform-origin: 0 0;
        padding-top: 30px;
        position: relative;
        background-color: #fff;

        .header-slide {
          width: 100%;
          height: 42px;
          background-color: #eead20;
          position: absolute;
          left: 0;
          top: 0;

          &:before, &:after {
            content: '';
            position: absolute;
            left: 0;
            width: 100%;
            height: 14px;
          }

          &.slide-left {
            transform: rotate(-40deg);
            left: -35%;

            &:before {
              top: 0;
              background-color: #4b7b91;
            }

            &:after {
              bottom: 0;
              background-color: #f48260;
            }
          }

          &.slide-right {
            transform: rotate(40deg);
            left: 35%;

            &:before {
              top: 0;
              background-color: #4b7b91;
            }

            &:after {
              bottom: 0;
              background-color: #f48260;
            }
          }
        }

        #background {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        .avatar {
          margin: 0 auto;
          @include avatar-2(200px);
        }

        .avatar-decoration {
          width: 260px;
          height: 100px;
          background-image: url(~img/campaign/avatar_decoration.png);
          background-size: contain;
          background-repeat: no-repeat;
          position: absolute;
          left: 50%;
          top: 150px;
          margin-left: -130px;
        }

        .nickname {
          font-size: 28px;
          margin-top: 30px;
          margin-left: 30px;
          margin-right: 30px;
          text-align: center;
          color: $color-text-normal;

          strong {
            color: $color-pink-deep;
          }
        }

        .qrcode {
          width: 300px;
          height: 300px;
          margin: 30px auto 0 auto;
        }

        .tips {
          text-align: center;
          font-size: 26px;
          margin-left: 40px;
          margin-right: 40px;
          margin-top: 24px;
          line-height: 32px;
        }

        .tags {
          margin-top: 10px;
          margin-left: 20px;
          margin-right: 20px;
          text-align: center;
          height: 106px;
          overflow: hidden;

          .mint-badge {
            border-radius: 14px;
            font-size: 24px;
            padding: 8px 20px;
            margin: 4px 14px;
            background-color: $color-pink-light;
          }
        }

        .slogan {
          position: absolute;
          left: 0;
          bottom: 30px;
          width: 100%;
          font-size: 24px;
          text-align: center;
          color: $color-text-normal;
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
  <div id="user-invite">
    <div class="container">
      <h3 class="sub-title">邀请码{{ created ? '（长按图片可保存到手机相册）' : '' }}</h3>
    </div>
    <div class="capture-wrap">
      <img :src="result" v-if="result">
      <div class="capture-area" v-else>
        <div class="header-slide slide-left"></div>
        <div class="header-slide slide-right"></div>
        <canvas id="background" ref="bg"></canvas>
        <div class="avatar">
          <img crossorigin="anonymous" :src="$resize(user.avatar, { width: 200 })">
        </div>
        <div class="avatar-decoration"></div>
        <p class="nickname">来自用户「&nbsp;<strong>{{ user.nickname }}</strong>&nbsp;」的邀请函</p>
        <div class="qrcode" ref="qr"></div>
        <p class="tips">
          扫二维码注册后，邀请者就可获得一枚金币<br>
          1金币 = 1人民币，求扫求转发！
        </p>
        <no-ssr>
          <div class="tags">
            <mt-badge
              size="large"
              v-for="(tag, index) in tags"
              :key="index"
              v-text="tag"
            ></mt-badge>
          </div>
        </no-ssr>
        <p class="slogan">- calibur.tv · 天下漫友是一家 -</p>
      </div>
    </div>
    <div class="container">
      <h3 class="sub-title">使用介绍</h3>
      <ul class="intros">
        <li>非常感谢大家对 calibur.tv 的支持</li>
        <li>目前网站还在初始阶段，为了促进推广，因此推出了金币功能</li>
        <li>大家除了每日签到、发表原创内容来赚取金币外</li>
        <li>还可以通过邀请朋友注册来赚取金币</li>
        <li>每有一个人通过扫你的二维码注册，你就会获得一枚金币，并会收到短信通知</li>
        <li>1金币 = 1人民币，满 100 金币可提现</li>
        <li>大家快去邀请自己的漫友来 calibur 一起玩耍吧！</li>
        <li v-if="created">长按图片可保存到手机相册，更方便分享</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'

  export default {
    name: 'page-user-invite',
    computed: {
      user () {
        return this.$store.state.user
      },
      link () {
        return this.user ? `http://calibur.tv/about/invite/${this.user.id}` : ''
      },
      tags () {
        return this.$utils.shuffle(this.cartoons).slice(0, 5)
      }
    },
    data () {
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
    methods: {
      renderBackground () {
        // eslint-disable-next-line one-var
        var c = this.$refs.bg,
          x = c.getContext('2d'),
          pr = window.devicePixelRatio || 1,
          w = window.innerWidth,
          h = window.innerHeight,
          f = 90,
          q,
          m = Math,
          r = 0,
          u = m.PI * 2,
          v = m.cos,
          z = m.random
        c.width = w * pr
        c.height = h * pr
        x.scale(pr, pr)
        x.globalAlpha = 0.6
        function i () {
          x.clearRect(0, 0, w, h)
          q = [{x: 0, y: h * 0.7 + f}, {x: 0, y: h * 0.7 - f}]
          while (q[1].x < w + f) d(q[0], q[1])
        }
        function d (i, j) {
          x.beginPath()
          x.moveTo(i.x, i.y)
          x.lineTo(j.x, j.y)
          // eslint-disable-next-line one-var
          var k = j.x + (z() * 2 - 0.25) * f,
            n = y(j.y)
          x.lineTo(k, n)
          x.closePath()
          r -= u / -50
          x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16)
          x.fill()
          q[0] = q[1]
          q[1] = {x: k, y: n}
        }
        function y (p) {
          const t = p + (z() * 2 - 1.1) * f
          return (t > h || t < 0) ? y(p) : t
        }
        i()
      },
      generateQrCode () {
        this.$QRCode(this.$refs.qr, this.link, { width: 300, height: 300 })
      },
      create () {
        html2canvas(document.querySelector('.capture-area'), {
          allowTaint: false,
          useCORS: true,
          backgroundColor: null
        }).then((canvas) => {
          this.result = canvas.toDataURL('image/png')
          this.created = true
        }).catch(() => {})
      }
    },
    mounted () {
      if (!this.user) {
        this.$toast.error('请先登录')
        return
      }
      this.$nextTick(() => {
        this.renderBackground()
        this.generateQrCode()
        setTimeout(() => {
          this.create()
        }, 3000)
      })
    }
  }
</script>

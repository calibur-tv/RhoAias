<style lang="scss">
.first-sign-drawer {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  height: 335px;
  background-color: #fff;
  z-index: 100;
  background-image: url('https://image.calibur.tv/owner/first-sign-drawer-bg.jpeg?imageMogr2/auto-orient/strip');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 20px;
  text-align: center;
  font-family: Roboto, Helvetica Neue, Helvetica, Tahoma, Arial,
    FZLanTingHeiS-L-G, PingFang SC, Microsoft YaHei;
  border-radius: 8px;

  .title {
    text-align: center;
    font-size: 20px;
    letter-spacing: 3px;
    line-height: 24px;
    color: rgb(0, 0, 0);
    margin-bottom: 15px;
  }

  .content {
    color: #000;
    font-size: 13px;
    text-shadow: #c8c8c8 1px 1px 2px;
    text-align: center;
    line-height: 22px;
  }

  .control {
    margin-top: 15px;
    text-align: center;

    button {
      display: block;
      height: 50px;
      width: 100%;
      font-size: 16px;
      line-height: 50px;
      border-radius: 25px;
      text-align: center;
      color: #fff;
      margin-top: 10px;
      font-weight: bold;
    }
  }
}
</style>

<template>
  <div
    v-if="show"
    class="first-sign-drawer"
  >
    <h3 class="title">
      欢迎来到<br>
      「calibur.tv」
    </h3>
    <p class="content">
      使用你的“邀请码”带朋友一起来玩吧！<br>
      每邀请一个朋友加入<br>
      你就可以获得一个团子<br>
      1团子=1人民币<br>
      满100就可以提现噢！
    </p>
    <div class="control">
      <a href="/about/hello">
        <button style="background-color: #00ce72">
          查看团子规则
        </button>
      </a>
      <a href="/me/invite">
        <button style="background-color: gold">
          我的邀请码
        </button>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FirstSignDrawer',
  data() {
    return {
      show: false
    }
  },
  mounted() {
    if (/^\/app\//.test(this.$route.fullPath)) {
      return
    }
    if (!this.$cookie.get('display-first-sign-dialog')) {
      try {
        if (!localStorage.getItem('display-first-sign-dialog')) {
          this.show = true
          const id = this.$backdrop.show({
            click: () => {
              this.show = false
              this.$backdrop.hide(id)
            }
          })
          this.$cookie.set('display-first-sign-dialog', 1, {
            expires: 7
          })
          localStorage.setItem('display-first-sign-dialog', 1)
        }
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss">
.fenxiao-btn-container {
  .fenxiao-btn {
    position: fixed;
    right: 0;
    width: 55px;
    line-height: 28px;
    border-radius: 14px 0 0 14px;
    bottom: 100px;
    color: #f25d8e;
    text-align: center;
    z-index: 1;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.16);
    font-size: 14px;
    background-color: #fff;
    padding-left: 5px;
    font-weight: bold;
  }

  .modal-content {
    position: fixed;
    width: 300px;
    height: 390px;
    left: 50%;
    top: 50%;
    background-color: #fff;
    transform: translate(-50%, -50%);
    z-index: 99;
    border-radius: 5px;

    .tips {
      margin-top: 20px;
      margin-bottom: 15px;
      font-size: 14px;
      line-height: 24px;
      padding: 0 20px;
    }

    .join,
    .abort {
      display: block;
      width: 260px;
      height: 40px;
      text-align: center;
      margin: 0 auto;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .join {
      background-color: #f25d8e;
      box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
      color: #fff;
    }

    .abort {
      border: 1px solid $color-text-light;
      color: $color-text-light;
    }
  }
}
</style>

<template>
  <div v-if="login && display"
       class="fenxiao-btn-container"
  >
    <div v-if="showModal"
         class="modal-content"
    >
      <div class="tips">
        <p>这是你的专属邀请码</p>
        <p>把它分享给其他人，只要有人注册，那么你将会获得5个团子</p>
        <p>通过你的邀请码注册的人，将会获得2个团子</p>
        <p>团子可以用来看视频，为偶像应援等</p>
        <p>或经过转化之后提现，1团子相当于1人民币</p>
        <p>更重要的是，calibur 的发展需要你的支持，感谢</p>
      </div>
      <button v-clipboard="shareLink"
              class="join" @success="handleCopyOK"
      >
        获取分享链接
      </button>
      <button class="abort"
              @click="abort"
      >
        但是，我拒绝
      </button>
    </div>
    <button class="fenxiao-btn"
            @click="showIntroModal"
    >
      分享
    </button>
  </div>
</template>

<script>
export default {
  name: 'ShareBtn',
  props: {
    shareData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      backdropId: 0,
      display: true
    }
  },
  computed: {
    login() {
      return this.$store.state.login
    },
    shareLink() {
      return this.shareData
        ? this.shareData.link
        : `https://m.calibur.tv${this.route.path}`
    }
  },
  methods: {
    showIntroModal() {
      this.showModal = true
      this.backdropId = this.$backdrop.show({
        ele: this.$el,
        click: () => {
          this.showModal = false
          this.$backdrop.hide(this.backdropId)
        }
      })
    },
    abort() {
      this.display = false
      this.$backdrop.hide(this.backdropId)
      this.$toast.success('好吧...orz')
    },
    handleCopyOK() {
      this.showModal = false
      this.$backdrop.hide(this.backdropId)
      this.$toast.success('复制成功~快去分享给其他人吧！')
    }
  }
}
</script>

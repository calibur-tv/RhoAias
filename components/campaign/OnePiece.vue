<style lang="scss">
$color: RGB(78, 73, 74);
#campaign-one-piece {
  width: 300px;
  height: 434px;
  margin: 30px auto 0;
  box-shadow: 0 0.3rem 2rem rgba(51, 51, 51, 0.15);
  border-radius: 5px;
  overflow: hidden;

  .canvas-wrap {
    position: relative;
    height: 100%;
    width: 100%;
    display: block;
    background-image: url(~img/campaign/one-piece.png);
    color: $color;

    .file-input-wrap,
    .avatar {
      position: absolute;
      left: 27px;
      top: 90px;
      width: 247px;
      height: 186px;
    }

    .file-input-wrap {
      .text {
        width: 80% !important;
      }
    }

    textarea,
    input {
      background-color: transparent;
      outline-color: $color;
      color: $color;
      text-align: center;
      position: absolute;
      left: 0;
      top: 0;
      font-family: Baskerville, 'Times New Roman', 'Liberation Serif',
        STFangsong, FangSong, FangSong_GB2312, 'CWTEX\-F', serif;
      width: 100%;
      height: 100%;
    }

    .name-wrap {
      position: absolute;
      top: 310px;
      left: 30px;
      right: 30px;
      height: 50px;
      width: auto;

      .name {
        font-size: 42px;
        line-height: 42px;
        font-weight: 700;
        padding: 4px 0;
      }
    }

    .dollar-wrap {
      position: absolute;
      top: 363px;
      left: 30px;
      right: 30px;
      height: 23px;
      width: auto;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .dollar-icon {
        width: 60px;
        height: 60px;
        background-image: url(~img/campaign/dollar.png);
      }

      .dollar-input {
        font-size: 20px;
        font-weight: 600;
        position: relative;
        left: -15px;
      }

      .dollar-tail {
        width: 30px;
        height: 50px;
        line-height: 50px;
        margin-left: -10px;
      }
    }
  }
}
</style>

<template>
  <div id="campaign-one-piece">
    <img v-if="image" :src="image" class="canvas-wrap bg">
    <div v-else class="canvas-wrap bg">
      <div
        v-if="selectedAvatar"
        :style="{ backgroundImage: `url(${selectedAvatar})` }"
        class="avatar bg"
      />
      <div class="file-input-wrap">
        <div class="textarea text">
          点击上传头像
        </div>
        <input
          ref="uploader"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/x-png"
          @change="selectAvatar"
        >
      </div>
      <div class="name-wrap">
        <input
          v-model="name"
          class="textarea name oneline"
          placeholder="名称"
        >
      </div>
      <div class="dollar-wrap">
        <div class="dollar-icon bg" />
        <input
          v-model="dollar"
          :style="dollarInputWidth"
          class="textarea dollar-input"
          placeholder="金"
          type="number"
        >
        <div class="dollar-tail">
          一
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CampaignOnePiece',
  props: {
    image: {
      required: true,
      type: String
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedAvatar: this.avatar,
      name: '',
      dollar: ''
    }
  },
  computed: {
    dollarInputWidth() {
      const length = this.dollar.length
      return {
        width: `${(length + 1) * 10 + 7}px`
      }
    }
  },
  mounted() {
    this.$channel.$on('campaign-canvas-reset', () => {
      this.selectedAvatar = this.avatar
    })
    this.$channel.$on('campaign-canvas-creating', () => {
      if (!this.name) {
        this.name = '無'
      }
      if (!this.dollar) {
        this.dollar = 50
      }
    })
  },
  methods: {
    selectAvatar(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = evt => {
        this.selectedAvatar = evt.target.result
        this.$refs.uploader.value = ''
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style lang="scss">
$color: RGB(78, 73, 74);
#campaign-black-work {
  width: 300px;
  height: 830px;
  margin: 30px auto 60px;
  box-shadow: 0 0.3rem 2rem rgba(51, 51, 51, 0.15);
  border-radius: 5px;
  overflow: hidden;

  .canvas-wrap {
    position: relative;
    height: 100%;
    width: 100%;
    display: block;
    background-image: url(~img/campaign/black-work.png);
    color: $color;

    .the-world {
      position: absolute;
      left: 27px;
      top: 350px;
      width: 245px;

      .file-input-wrap {
        position: relative;
        width: 100%;
        height: 245px;
      }

      .avatar {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 245px;
      }

      .item {
        margin-top: 8px;
        font-size: 13px;
        height: 18px;

        span {
          display: inline-block;
          vertical-align: middle;
          width: 55px;
          text-align: right;
          float: left;
          line-height: 18px;
          margin-left: 10px;
        }

        div {
          overflow: hidden;
          height: 100%;
        }

        input {
          background-color: transparent;
          width: 100%;
          height: 100%;
          font-size: 13px;
          line-height: 18px;
        }
      }
    }
  }
}
</style>

<template>
  <div id="campaign-black-work">
    <img 
      v-if="image" 
      :src="image" 
      class="canvas-wrap bg">
    <div 
      v-else 
      class="canvas-wrap bg">
      <div class="the-world">
        <div
          v-if="selectedAvatar"
          :style="{ backgroundImage: `url(${selectedAvatar})` }"
          class="avatar bg"
        />
        <div class="file-input-wrap textarea">
          <div class="text">点击上传头像</div>
          <input 
            ref="uploader" 
            type="file" 
            accept="image/png, image/jpeg, image/jpg, image/x-png" 
            @change="selectAvatar">
        </div>
        <div class="item sex textarea">
          <span>性别：</span>
          <div><input 
            type="text" 
            maxlength="2"></div>
        </div>
        <div class="item height textarea">
          <span>身長：</span>
          <div><input 
            type="text" 
            maxlength="12"></div>
        </div>
        <div class="item face textarea">
          <span>特徽：</span>
          <div><input 
            type="text" 
            maxlength="12"></div>
        </div>
        <div class="item location textarea">
          <span>所在地：</span>
          <div><input 
            type="text" 
            maxlength="12"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlackWork',
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
        width: `${(length + 1) * 5 + 20}px`
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

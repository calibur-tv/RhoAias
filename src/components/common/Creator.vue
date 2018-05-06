<style lang="scss">
  #creator-menu-wrap {
    z-index: 94;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .backdrop {
      pointer-events: auto;
    }

    .mint-palette-button {
      pointer-events: auto;
      position: absolute;
      left: 50%;
      bottom: 20px;
      margin-left: -25px;
      width: 50px;
      height: 50px;
      color: #fff;
      z-index: 100;
    }

    .mint-main-button {
      background-color: $color-blue-light;
      line-height: 50px;
      font-size: 25px;
    }

    .ic-btn {
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      pointer-events: auto;

      &.icon-tupian {
        background-color: red;
      }

      &.icon-pinglun {
        background-color: #9266f9;
      }

      &.icon-pinglun1 {
        background-color: #16c2c2;
      }
    }
  }
</style>

<template>
  <div class="creators-container">
    <div id="creator-menu-wrap">
      <palette-button
        content="+"
        direction="t"
        @expand="handlePaletteOpen"
        @collapse="handlePaletteClose"
        ref="palette"
      >
        <button
          class="ic-btn iconfont icon-tupian"
          @click="handleImageClick"
        ></button>
        <button
          class="ic-btn iconfont icon-pinglun"
          @click="handlePostClick"
        ></button>
        <button
          class="ic-btn iconfont icon-pinglun1"
          @click="handleFeedClick"
        ></button>
      </palette-button>
    </div>
    <v-post></v-post>
  </div>
</template>

<script>
  import { PaletteButton } from 'mint-ui'
  import vPost from '~/components/creators/PostDrawer'

  export default {
    name: 'v-creator-menu',
    components: {
      PaletteButton,
      vPost
    },
    methods: {
      handlePaletteOpen () {
        this.$backdrop.show({
          ele: this.$refs.palette.$el,
          click: () => {
            this.close()
          }
        })
      },
      close () {
        this.$refs.palette.collapse()
      },
      handlePaletteClose () {
        this.$backdrop.hide()
      },
      handleImageClick () {
        this.close()
        this.$toast.error('图片功能开发中')
      },
      handlePostClick () {
        this.close()
        if (this.$store.state.login) {
          this.$channel.$emit('drawer-open-write-post')
        } else {
          this.$toast.info('继续操作前请先登录')
          this.$channel.$emit('drawer-open-sign')
        }
      },
      handleFeedClick () {
        this.close()
        this.$channel.$emit('open-feedback')
      }
    }
  }
</script>

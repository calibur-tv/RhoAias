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
      right: $container-padding;
      bottom: $container-padding;
      margin-left: -25px;
      width: 50px;
      height: 50px;
      color: #fff;
      z-index: 100;
    }

    .mint-main-button {
      background-color: $color-pink-normal;
      line-height: 50px;
      box-shadow: 0 2px 5px rgba(26,26,26,.25);
      
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 40%;
        height: 2px;
        transform: translate(-50%, -1px);
        background-color: #fff;
        border-radius: 2px;
      }

      &:before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2px;
        height: 40%;
        transform: translate(-1px, -50%);
        background-color: #fff;
        border-radius: 2px;
      }
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
        content=""
        direction="lt"
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
    <v-image></v-image>
  </div>
</template>

<script>
  import { PaletteButton } from 'mint-ui'
  import vPost from '~/components/creators/PostDrawer'
  import vImage from '~/components/creators/ImageDrawer'

  export default {
    name: 'v-creator-menu',
    components: {
      PaletteButton,
      vPost,
      vImage
    },
    data () {
      return {
        backdropId: 0
      }
    },
    computed: {
      isGuest () {
        return !this.$store.state.login
      },
      pageName () {
        return this.$route.name
      }
    },
    methods: {
      handlePaletteOpen () {
        this.backdropId = this.$backdrop.show({
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
        this.$backdrop.hide(this.backdropId)
      },
      handleImageClick () {
        this.close()
        if (this.isGuest) {
          this.$channel.$emit('sign-in')
          return
        }
        this.$channel.$emit('open-create-image-drawer')
      },
      handlePostClick () {
        this.close()
        if (this.isGuest) {
          this.$channel.$emit('sign-in')
          return
        }
        if (~['post-show'].indexOf(this.pageName)) {
          this.$channel.$emit('open-create-comment-drawer')
          return
        }
        this.$channel.$emit('drawer-open-write-post')
      },
      handleFeedClick () {
        this.close()
        this.$channel.$emit('open-feedback')
      }
    }
  }
</script>

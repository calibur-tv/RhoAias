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

  .palette-button {
    pointer-events: auto;
    position: absolute;
    bottom: 20px;
    left: 50%;
    width: 48px;
    height: 48px;
    margin-left: -24px;
    z-index: 100;
    color: #fff;
    transform: translateY(200px);

    &.isScrollTop {
      transform: translateY(0);
    }
  }

  .mint-main-button {
    background-color: $color-pink-normal;
    line-height: 48px;
    box-shadow: 0 2px 5px rgba(26, 26, 26, 0.25);

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

    &.el-icon-picture {
      background-color: #ec414d;
    }

    &.score-btn {
      background-color: #30a080;

      a {
        width: 100%;
        height: 100%;
        display: block;
      }

      i {
        font-weight: bold;
      }
    }

    &.icon-pinglun {
      background-color: RGB(60, 134, 247);
      font-weight: bold;
    }

    &.el-icon-question {
      background-color: #0084ff;
      color: #fff;
    }
  }
}
</style>

<template>
  <div 
    v-if="showCreator" 
    class="creators-container">
    <div id="creator-menu-wrap">
      <palette-button
        ref="palette"
        :class="{ isScrollTop }"
        content=""
        direction="t"
        class="palette-button"
        @expand="handlePaletteOpen"
        @collapse="handlePaletteClose"
      >
        <button 
          class="ic-btn el-icon-picture" 
          @click="handleImageClick" />
        <button 
          v-if="userLevel > 2" 
          class="ic-btn score-btn">
          <a :href="$alias.createScore"> <i class="el-icon-edit" /> </a>
        </button>
        <button 
          v-else 
          class="ic-btn score-btn" 
          @click="handleScoreClick">
          <i class="el-icon-edit" />
        </button>
        <button 
          class="ic-btn iconfont icon-pinglun" 
          @click="handlePostClick" />
        <button 
          class="ic-btn el-icon-question" 
          @click="handleQuestionClick" />
      </palette-button>
    </div>
    <template v-if="!isGuest">
      <create-post-drawer />
      <create-image-drawer />
      <create-question-drawer />
    </template>
  </div>
</template>

<script>
import { PaletteButton } from 'mint-ui'
import CreatePostDrawer from '~/components/creators/CreatePostDrawer'
import CreateImageDrawer from '~/components/creators/CreateImageDrawer'
import CreateQuestionDrawer from '~/components/creators/CreateQuestionDrawer'

export default {
  name: 'VCreatorMenu',
  components: {
    PaletteButton,
    CreatePostDrawer,
    CreateImageDrawer,
    CreateQuestionDrawer
  },
  data() {
    return {
      backdropId: 0,
      lastScroll: 0,
      isScrollTop: true
    }
  },
  computed: {
    isGuest() {
      return !this.$store.state.login
    },
    pageName() {
      return this.$route.name
    },
    showCreator() {
      return ['index', 'download-app'].indexOf(this.pageName) === -1
    },
    userLevel() {
      if (this.isGuest) {
        return 0
      }
      return this.$store.state.user.exp.level
    }
  },
  mounted() {
    window.addEventListener(
      'scroll',
      this.$utils.throttle(() => {
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop
        this.isScrollTop = this.lastScroll > scrollTop
        this.lastScroll = scrollTop
      }, 200)
    )
  },
  methods: {
    handlePaletteOpen() {
      this.backdropId = this.$backdrop.show({
        ele: this.$refs.palette.$el,
        click: () => {
          this.close()
        }
      })
    },
    close() {
      this.$refs.palette.collapse()
    },
    handlePaletteClose() {
      this.$backdrop.hide(this.backdropId)
    },
    handleImageClick() {
      this.close()
      if (this.isGuest) {
        this.$channel.$emit('sign-in')
        return
      }
      this.$channel.$emit('open-create-image-drawer')
    },
    handlePostClick() {
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
    handleQuestionClick() {
      this.close()
      if (this.isGuest) {
        this.$channel.$emit('sign-in')
        return
      }
      if (this.userLevel < 3) {
        this.$toast.error('3级以上才能提问')
        return
      }
      this.$channel.$emit('drawer-open-write-question')
    },
    handleScoreClick() {
      window.location = this.$alias.createScore
    }
  }
}
</script>

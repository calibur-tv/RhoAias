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
    bottom: 45px;
    margin-left: -25px;
    width: 48px;
    height: 48px;
    color: #fff;
    z-index: 100;
  }

  .mint-main-button {
    background-color: $color-pink-normal;
    line-height: 50px;
    box-shadow: 0 2px 5px rgba(26, 26, 26, 0.25);

    &:after {
      content: "";
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
      content: "";
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
      background-color: #ec414d;
    }

    &.score-btn {
      background-color: #30a080;

      a {
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    &.icon-pinglun1 {
      background-color: RGB(60, 134, 247);
    }
  }
}
</style>

<template>
  <div
    v-if="pageName !== 'homepage'"
    class="creators-container"
  >
    <div id="creator-menu-wrap">
      <palette-button
        ref="palette"
        content=""
        direction="lt"
        @expand="handlePaletteOpen"
        @collapse="handlePaletteClose"
      >
        <button
          class="ic-btn iconfont icon-tupian"
          @click="handleImageClick"
        />
        <button class="ic-btn score-btn">
          <a :href="$alias.createScore">
            <i class="iconfont icon-pinglun"/>
          </a>
        </button>
        <button
          class="ic-btn iconfont icon-pinglun1"
          @click="handlePostClick"
        />
      </palette-button>
    </div>
    <v-post/>
    <v-image/>
  </div>
</template>

<script>
import { PaletteButton } from "mint-ui";
import vPost from "~/components/creators/PostDrawer";
import vImage from "~/components/creators/ImageDrawer";

export default {
  name: "VCreatorMenu",
  components: {
    PaletteButton,
    vPost,
    vImage
  },
  data() {
    return {
      backdropId: 0
    };
  },
  computed: {
    isGuest() {
      return !this.$store.state.login;
    },
    pageName() {
      return this.$route.name;
    }
  },
  methods: {
    handlePaletteOpen() {
      this.backdropId = this.$backdrop.show({
        ele: this.$refs.palette.$el,
        click: () => {
          this.close();
        }
      });
    },
    close() {
      this.$refs.palette.collapse();
    },
    handlePaletteClose() {
      this.$backdrop.hide(this.backdropId);
    },
    handleImageClick() {
      this.close();
      if (this.isGuest) {
        this.$channel.$emit("sign-in");
        return;
      }
      this.$channel.$emit("open-create-image-drawer");
    },
    handlePostClick() {
      this.close();
      if (this.isGuest) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (~["post-show"].indexOf(this.pageName)) {
        this.$channel.$emit("open-create-comment-drawer");
        return;
      }
      this.$channel.$emit("drawer-open-write-post");
    }
  }
};
</script>

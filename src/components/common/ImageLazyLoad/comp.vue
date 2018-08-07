<style lang="scss">
$transition: 0.4s linear;
$placeholder-color: #ddd;

.lazy-flow-image,
.lazy-full-image {
  background-color: transparent;
  transition: $transition;
  overflow: hidden;

  img {
    display: block;
  }
}

.lazy-image-retry {
  background-color: $placeholder-color;
  opacity: 0.3;
  position: relative;
  cursor: pointer;

  .lazy-image-shim {
    display: none;
  }

  .lazy-image-message {
    color: #000;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.lazy-full-image {
  width: 100%;

  .lazy-image-shim {
    height: 100%;
    margin: 0 auto;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.lazy-image-fade {
  background-color: $placeholder-color;
  opacity: 0.3;
}
</style>

<template>
  <div
    v-if="full"
    :class="{ 'lazy-image-fade': !loaded, 'lazy-image-retry': error }"
    :style="{ height: `${computeContainerHeight}px` }"
    class="lazy-full-image"
  >
    <div
      ref="shim"
      :style="{ width: computeShimWidth }"
      class="lazy-image-shim"
    >
      <img
        ref="img"
        :src="$isServer ? '' : loaded ? fullImageSrc : placeholderImage"
        @error="handleImageLoadError"
        @load="handleImageLoadSuccess"
      >
    </div>
    <div
      v-if="error"
      class="lazy-image-error"
    >
      <span
        class="lazy-image-message"
        v-text="message"
      />
    </div>
  </div>
  <div
    v-else
    :class="{ 'lazy-image-fade': !loaded }"
    :style="normalImageStyle"
    class="lazy-flow-image"
  >
    <img
      ref="img"
      :src="error ? errorPlaceholder : $isServer ? '' : loaded ? flowImageSrc : placeholderImage"
      @error="handleImageLoadError"
    >
  </div>
</template>

<script>
import utils from "./utils";

// TODO large height image cropper & click show all
// TODO large GIF click load
// TODO test render when use v-show
// TODO watch src change

export default {
  name: "VImg",
  props: {
    src: {
      required: true,
      type: String,
      default: ""
    },
    width: {
      type: [Number, String],
      default: 0
    },
    height: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: 0
    },
    full: {
      type: Boolean,
      default: false
    },
    mime: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loaded: false,
      error: false,
      containerWidth: 0,
      message: "",
      placeholderImage: "",
      errorPlaceholder: "",
      errorMessage: "",
      retryMessage: "",
      heightLimit: 0,
      loadLimit: 0,
      retryLimit: 0
    };
  },
  computed: {
    computeContainerHeight() {
      if (this.$isServer) {
        return 0;
      }
      return parseInt((this.height / this.width) * this.containerWidth, 10);
    },
    computeShimWidth() {
      return this.width >= this.containerWidth ? "100%" : `${this.width}px`;
    },
    convertImageReallyWidth() {
      const numberWidth = +this.width
        .toString()
        .replace("px", "")
        .replace("%", "");
      return parseInt(
        /%$/.test(this.width)
          ? (this.containerWidth / 50) * numberWidth
          : numberWidth * 2,
        10
      );
    },
    normalImageStyle() {
      return this.size
        ? {
            width: this.convertSize(this.size),
            height: this.convertSize(this.size)
          }
        : {
            width: this.convertSize(this.width),
            height: this.convertSize(this.height)
          };
    },
    shouldClickToLoad() {
      return !!(
        this.size &&
        this.mime &&
        this.loadLimit &&
        /gif/i.test(this.mime) &&
        this.size - this.loadLimit > 0
      );
    },
    fullImageSrc() {
      return this.width > this.containerWidth
        ? this.$resize(this.src, {
            width: this.containerWidth * 2,
            height: this.computeContainerHeight * 2
          })
        : this.$resize(this.src, {
            width: this.width,
            height: this.height
          });
    },
    flowImageSrc() {
      if (this.full) {
        return this.width > this.containerWidth
          ? this.$resize(this.src, {
              width: this.containerWidth * 2,
              height: this.computeContainerHeight * 2
            })
          : this.$resize(this.src, {
              width: this.width,
              height: this.height
            });
      }
      return this.$resize(
        this.src,
        this.size
          ? {
              width: +this.size * 2
            }
          : {
              width: this.convertImageReallyWidth,
              height: +this.height * 2
            }
      );
    }
  },
  mounted() {
    this.containerWidth = this.$el.parentNode.offsetWidth;
    if (utils.checkInView(this.$el)) {
      this.loadImageResource();
    } else {
      this.bindLazyEvent();
    }
  },
  methods: {
    bindLazyEvent() {
      const eventId = utils.on(
        document,
        "scroll",
        utils.throttle(() => {
          if (utils.checkInView(this.$el)) {
            this.loadImageResource(false);
            utils.off(eventId);
          }
        }, 200),
        false
      );
    },
    bindRetryEvent() {
      const eventId = utils.on(
        this.$el,
        "click",
        e => {
          this.retryLimit--;
          this.message = this.retryMessage;
          this.loadImageResource(true);
          utils.off(eventId);
          e.stopPropagation();
        },
        false
      );
    },
    loadImageResource(force) {
      if (!this.shouldClickToLoad || force) {
        this.loaded = true;
      }
    },
    convertSize(size) {
      if (/px$/.test(size)) {
        return size;
      }
      if (/%$/.test(size)) {
        return size;
      }
      return `${size}px`;
    },
    handleImageLoadSuccess() {
      this.error = false;
    },
    handleImageLoadError() {
      this.error = true;
      if (this.full && this.retryLimit >= 0) {
        this.message = this.errorMessage;
        this.bindRetryEvent();
      }
    }
  }
};
</script>

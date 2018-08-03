<style lang="scss">
.image-reader-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: #000;

  .index {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    margin-top: 15px;
    font-size: 12px;
  }

  .images-wrapper {
    width: 100%;
    height: 80%;
    margin-top: 15%;
    position: relative;

    .mint-swipe {
      overflow: visible;
    }

    .mint-swipe-indicators {
      bottom: -5%;

      .is-active {
        opacity: 0.5;
      }
    }

    .view-image {
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: block;

      &.is-width {
        width: 98%;
        height: auto;
      }

      &.is-height {
        height: 100%;
        width: auto;
      }
    }
  }

  #download-btn {
    position: absolute;
    bottom: 15px;
    width: 80px;
    color: #fff;
    text-align: center;
    font-size: 12px;
    opacity: 0.8;
    padding: 10px 0;
    left: 50%;
    margin-left: -40px;
  }
}
</style>

<template>
  <div
    v-if="open"
    class="image-reader-wrapper"
    @click="open = false"
  >
    <div class="index">{{ index + 1 }} / {{ images.length }}</div>
    <div class="images-wrapper">
      <mt-swipe
        :auto="0"
        :speed="50"
        :default-index="index"
        :show-indicators="false"
        :continuous="false"
        @change="handleChange"
      >
        <mt-swipe-item
          v-for="(item, index) in images"
          :key="index"
        >
          <v-img
            :class="[ computeImageType(item) === 3 ? 'is-height' : 'is-width' ]"
            :src="computeImageSize(item)"
            :id="`image-reader-${index}`"
            :loading="true"
            :full="true"
            :source="item"
            class="view-image"
          />
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <a 
      id="download-btn" 
      :href="imageHref" 
      :download="imageName" 
      target="_blank" 
      @click.stop>下载原图</a>
  </div>
</template>

<script>
export default {
  name: "ImageReader",
  data() {
    return {
      images: [],
      index: 0,
      open: false,
      maxWidth: 0,
      maxHeight: 0,
      maxWidthHeightRate: 0,
      maxHeightWidthRate: 0
    };
  },
  computed: {
    imageHref() {
      if (!this.images.length) {
        return "";
      }
      return this.images[this.index].url;
    },
    imageName() {
      return this.imageHref
        ? `calibur-tv-${Date.now()}.${this.imageHref.split(".").pop()}`
        : "";
    }
  },
  mounted() {
    this.computeMaxSize();
    this.$channel.$on("open-image-reader", ({ images, image }) => {
      if (!images || !image) {
        return;
      }
      let index = 0;
      this.images = Array.isArray(images) ? images : [images];
      this.images.forEach((img, idx) => {
        if (img.url === image.url) {
          index = idx;
        }
      });
      this.index = index || 0;
      this.open = true;
      setTimeout(() => {
        const length = images.length;
        // 如果图片大于一张，要 hack 懒加载
        if (length > 1) {
          if (length - 1 === index) {
            // 预览的是最后一张，加载上一张
            this.$channel.$emit(`image-load-image-reader-${index - 1}`);
          } else if (index === 0) {
            // 预览的是第一张，加载下一张
            this.$channel.$emit(`image-load-image-reader-1`);
          } else {
            // 预览的是中间的图，加载上一张和下一张
            this.$channel.$emit(`image-load-image-reader-${index + 1}`);
            this.$channel.$emit(`image-load-image-reader-${index - 1}`);
          }
        }
      }, 500);
    });
  },
  methods: {
    handleChange(index) {
      this.index = index;
      this.$channel.$emit(`image-load-image-reader-${index + 1}`);
      this.$channel.$emit(`image-load-image-reader-${index - 1}`);
    },
    computeMaxSize() {
      this.maxWidth = parseInt(document.body.offsetWidth * 0.98, 10);
      this.maxHeight = parseInt(document.body.offsetHeight * 0.8, 10);
      this.maxWidthHeightRate = this.maxWidth / this.maxHeight;
      this.maxHeightWidthRate = this.maxHeight / this.maxWidth;
    },
    computeImageType(image) {
      const width = image.width;
      const height = image.height;

      if (!width || !height) {
        return 0;
      }

      // 图片太小了，直接返回
      if (width < this.maxWidth && height < this.maxHeight) {
        return 1;
      }

      const imageWidthHeightRate = width / height;
      const imageHeightWidthRate = height / width;

      // 图片太大，但没有溢出屏幕
      if (
        this.maxWidthHeightRate > imageWidthHeightRate &&
        this.maxHeightWidthRate > imageHeightWidthRate
      ) {
        return 2;
      }

      // 图片太长
      if (this.maxHeightWidthRate < imageHeightWidthRate) {
        return 3;
      }

      // 图片太宽
      if (this.maxWidthHeightRate < imageWidthHeightRate) {
        return 4;
      }

      return 5;
    },
    computeImageSize(image) {
      const type = this.computeImageType(image);
      if (type === 4) {
        return this.$resize(image.url, { width: this.maxWidth, mode: 2 });
      }
      return this.$resize(image.url, { height: this.maxHeight, mode: 2 });
    }
  }
};
</script>

<style lang="scss">
  .image-reader-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    .images-wrapper {
      width: 100%;
      height: 85%;
      margin-top: 10%;

      .mint-swipe {
        overflow: visible;
      }

      .mint-swipe-indicators {
        bottom: -5%;

        .is-active {
          opacity: .5;
        }
      }

      img {
        width: 100%;
        height: auto;
      }
    }
  }
</style>

<template>
  <div
    class="image-reader-wrapper"
    v-if="open"
    @click="close"
  >
    <div class="images-wrapper">
      <mt-swipe
        :auto="0"
        :speed="150"
        :defaultIndex="index"
        :continuous="false"
        :prevent="true"
        @change="handleChange"
      >
        <mt-swipe-item
          v-for="(item, index) in images"
          :key="index"
        >
          <v-img
            :src="item"
            :id="`image-reader-${index}`"
          ></v-img>
        </mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ImageReader',
    data () {
      return {
        images: [],
        index: 0,
        open: false
      }
    },
    mounted () {
      this.$channel.$on('open-image-reader', ({ images, index }) => {
        if (!images) {
          return
        }
        this.images = Array.isArray(images) ? images : [images]
        this.index = index || 0
        this.$backdrop.show()
        this.open = true
        setTimeout(() => {
          const length = images.length
          // 如果图片大于一张，要 hack 懒加载
          if (length > 1) {
            if (length - 1 === index) {
              // 预览的是最后一张，加载上一张
              this.$channel.$emit(`image-load-image-reader-${index - 1}`)
            } else if (index === 0) {
              // 预览的是第一张，加载下一张
              this.$channel.$emit(`image-load-image-reader-1`)
            } else {
              // 预览的是中间的图，加载上一张和下一张
              this.$channel.$emit(`image-load-image-reader-${index + 1}`)
              this.$channel.$emit(`image-load-image-reader-${index - 1}`)
            }
          }
        }, 1000)
      })
    },
    methods: {
      close () {
        this.$backdrop.hide()
        this.open = false
      },
      handleChange (index) {
        this.$channel.$emit(`image-load-image-reader-${index + 1}`)
        this.$channel.$emit(`image-load-image-reader-${index - 1}`)
      }
    }
  }
</script>

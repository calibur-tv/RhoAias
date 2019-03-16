<style lang="scss">
#image-content {
  .album-header {
    margin-top: $container-padding;
    margin-bottom: $container-padding;

    .title {
      font-size: 20px;
      margin-bottom: 15px;
    }

    .user {
      font-size: 13px;
      display: flex;
      align-items: center;

      .author {
        display: flex;
        align-items: center;

        .avatar {
          margin-right: 5px;

          img {
            border: 1px solid $color-avatar-border;
          }
        }
      }

      .dot {
        margin: 0 5px;
      }
      .flex1 {
        flex: 1;
      }
      .tool-btn {
        line-height: 30px;
      }
    }
  }

  .album-body {
    background-color: #fff;

    .images-wrap {
      .image-package {
        position: relative;
      }
    }

    .no-image {
      text-align: center;
      padding-top: 30px;
      padding-bottom: 20px;
      color: $color-text-normal;
      font-size: 13px;
    }

    .cartoon-list {
      margin-top: 20px;
      position: relative;

      .sub-title {
        margin-left: 10px;

        .next {
          float: right;
          font-size: 13px;
          margin-right: 10px;
          margin-left: 15px;
          color: $color-text-normal;
        }

        .more {
          float: right;
          font-size: 13px;
          margin-right: 10px;
          margin-left: 15px;
          color: $color-text-normal;
        }
      }

      li {
        width: 50%;
        display: inline-block;
        text-align: center;
        margin-bottom: 7px;
        padding: 0 5px;

        a {
          border: 1px solid $color-avatar-border;
          height: 30px;
          color: $color-link;
          border-radius: 4px;
          display: block;
          font-size: 12px;
          line-height: 28px;

          &.active {
            border-color: $color-blue-light;
            background-color: $color-blue-light;
            color: #fff;
          }
        }
      }
    }

    .reward-panel {
      text-align: center;
      margin-top: 30px;
      margin-bottom: 30px;

      button {
        margin: 0 5px;
        font-size: 13px;

        i {
          font-size: 12px;
          line-height: 16px;
        }
      }

      .album-rewarded-btn {
        @include btn-empty(#eb9e05);
      }

      .album-reward-btn {
        @include btn-empty(#ffffff, #eb9e05);
      }

      .album-liked-btn {
        @include btn-empty(#fa5555);
      }

      .album-like-btn {
        @include btn-empty(#ffffff, #fa5555);
      }
    }
  }
}
</style>

<template>
  <div id="image-content">
    <div class="container">
      <div class="album-header">
        <h1 class="title oneline">
          [{{ info.is_creator ? '原创' : '转载' }}] [{{
            info.is_cartoon ? '漫画' : '相册'
          }}]
          {{ info.name }}
        </h1>
        <FlowHeaderUser :user="info.user" :time="info.created_at" />
      </div>
    </div>
    <div class="album-body">
      <ImagePreview
        v-if="info.is_album"
        :images="info.images"
        class="images-wrap"
      >
        <div v-for="img in info.images" :key="img.id" class="image-package">
          <v-img
            :src="img.url"
            :full="true"
            :width="img.width"
            :height="img.height"
            class="image"
          />
        </div>
        <p v-if="!info.image_count" class="no-image">
          还没有上传图片
        </p>
      </ImagePreview>
      <ImagePreview v-else :images="[info.source]">
        <div class="image-package">
          <v-img
            :src="source.url"
            :width="source.width"
            :height="source.height"
            :full="true"
            class="image"
          />
        </div>
      </ImagePreview>
      <div v-if="info.is_cartoon" class="cartoon-list">
        <h3 class="sub-title">
          选集（{{ info.parts.length }}）
          <nuxt-link v-if="nextPartUrl" :to="nextPartUrl" class="next">
            下一话
          </nuxt-link>
          <div v-if="showMoreBtn" class="more" @click="showAll = !showAll">
            {{ showAll ? '收起' : '展开' }}
          </div>
        </h3>
        <ul>
          <li v-for="item in sortCartoons" :key="item.id">
            <nuxt-link
              :to="$alias.image(item.id)"
              :class="{ active: item.id === id }"
              class="oneline"
              v-text="item.name"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ImagePreview from '~/components/common/ImagePreview/ImagePreview'
import FlowHeaderUser from '~/components/layouts/FlowHeaderUser'

export default {
  name: 'ImageContent',
  components: {
    FlowHeaderUser,
    ImagePreview
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      take: 4,
      page: 0,
      part: 0,
      showAll: false
    }
  },
  computed: {
    cartoon() {
      return this.info.parts
    },
    showMoreBtn() {
      return this.take < this.cartoon.length
    },
    sortCartoons() {
      const begin = (this.page - 1) * this.take
      return this.showAll
        ? this.cartoon
        : this.cartoon.slice(begin, begin + this.take)
    },
    nextPartUrl() {
      if (!this.info.is_cartoon || !this.cartoon.length) {
        return ''
      }
      let index = 0
      this.cartoon.forEach((item, idx) => {
        if (item.id === this.info.id) {
          index = idx
        }
      })
      if (index >= this.cartoon.length - 1) {
        return ''
      }
      return this.$alias.image(this.cartoon[index + 1].id)
    }
  },
  mounted() {
    this.computePage()
  },
  methods: {
    computePage() {
      if (!this.info.is_cartoon) {
        return
      }
      this.cartoon.forEach((meta, index) => {
        if (meta.id === this.info.id) {
          this.part = index + 1
        }
      })
      this.page = Math.ceil(this.part / this.take)
    }
  }
}
</script>

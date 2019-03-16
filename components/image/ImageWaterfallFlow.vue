<style lang="scss">
#image-waterfall-flow {
  margin-right: -5px;
  background-color: #fff;

  .vue-waterfall {
    @media screen and (max-width: 469.98px) {
      width: 310px;
    }
    @media screen and (min-width: 470px) {
      width: 470px;
    }
    @media screen and (min-width: 630px) {
      width: 630px;
    }
    margin: 0 auto;
  }

  .vue-waterfall-slot {
    padding-right: 10px;
    padding-bottom: 10px;
    margin-left: 3px;
    margin-top: 10px;
  }

  .image {
    width: 100%;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(80, 80, 80, 0.11);
    background-color: #f2f3f5;
    border-radius: 4px;

    .image-box {
      position: relative;
      overflow: hidden;
      display: block;
      font-size: 0;

      &.album-box:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        opacity: 0.3;
        background-color: transparent;
        background-image: linear-gradient(
          transparent,
          rgba(0, 0, 0, 0.1) 20%,
          rgba(0, 0, 0, 0.2) 35%,
          rgba(0, 0, 0, 0.6) 65%,
          rgba(0, 0, 0, 0.9)
        );
      }

      .is-creator {
        font-size: 20px;
        position: absolute;
        left: 5px;
        top: 2px;
        z-index: 1;
        color: $color-yellow;
      }

      .is-album {
        position: absolute;
        left: 7px;
        bottom: 4px;
        z-index: 1;
        color: #fff;
        line-height: 20px;

        i {
          font-size: 20px;
          vertical-align: middle;
        }

        .image-count {
          margin-left: 5px;
          font-size: 14px;
          vertical-align: middle;
        }
      }
    }

    .intro {
      height: 55px;
      padding: 5px 15px;
      background-color: #fff;

      .name,
      .social {
        height: 20px;
        font-size: 12px;
        line-height: 20px;
      }

      .social {
        color: $color-text-light;
        margin-top: 5px;

        .done {
          color: $color-pink-deep;
        }
      }
    }

    .about {
      display: flex;
      align-items: center;
      height: 51px;
      padding: 10px 15px;
      border-top: 1px solid #f2f2f2;

      .user-avatar {
        border-radius: 50%;
        overflow: hidden;
        width: 30px;
        height: 30px;
        border: 1px solid #e5e9ef;
      }

      .bangumi-avatar {
        width: 30px;
        height: 30px;
      }

      .user-avatar,
      .bangumi-avatar {
        display: block;
        margin-right: 10px;
        overflow: hidden;
        float: left;
      }

      .main-name {
        line-height: 30px;
        font-size: 12px;
        word-wrap: break-word;
        color: $color-text-normal;
      }

      .main-name-user {
        flex: 1;
        max-height: 30px;
        line-height: 14px;
        font-size: 12px;
        word-wrap: break-word;
        color: $color-text-normal;
      }

      .info {
        overflow: hidden;
        font-size: 12px;
        line-height: 15px;

        .main-info {
          margin-bottom: 2px;

          span {
            color: $color-text-light;
            float: left;
          }
        }

        a {
          color: $color-text-normal;
          font-size: 12px;
          display: block;
        }
      }
    }
  }
}
</style>

<template>
  <div id="image-waterfall-flow">
    <not-ssr>
      <waterfall v-if="list.length" :line-gap="width + 10" :auto-resize="true">
        <waterfall-slot
          v-for="(item, index) in list"
          :key="item.id"
          :order="index"
          :width="width"
          :height="computeBoxHeight(item.source)"
        >
          <div v-if="computeImageHeight(item.source)" class="image">
            <nuxt-link
              :to="$alias.image(item.id)"
              :class="{ 'album-box': item.is_album }"
              class="image-box"
            >
              <i
                v-if="item.is_creator"
                class="is-creator iconfont icon-huangguan"
              />
              <v-img
                :src="item.source.url"
                :lazy="false"
                :width="width"
                :height="computeImageHeight(item.source)"
              />
              <div v-if="item.is_album" class="is-album">
                <i class="el-icon-picture-outline" />
                <span class="image-count" v-text="item.image_count" />
              </div>
            </nuxt-link>
            <div class="intro">
              <p class="name oneline" v-text="item.name" />
              <div class="social">
                <span v-if="item.is_creator">
                  <i class="iconfont icon-fantuan" />
                  <span>{{ item.reward_count }}</span>
                </span>
                <span v-else>
                  <i class="iconfont icon-like" />
                  <span>{{ item.like_count }}</span>
                </span>
                <span>
                  <i class="iconfont icon-mark" />
                  <span>{{ item.mark_count }}</span>
                </span>
                <span>
                  <i class="iconfont icon-talk" />
                  <span>{{ item.comment_count }}</span>
                </span>
              </div>
            </div>
            <div class="about">
              <template v-if="userZone">
                <nuxt-link
                  :to="$alias.bangumi(item.bangumi.id)"
                  class="bangumi-avatar"
                >
                  <v-img :lazy="false" :src="item.bangumi.avatar" width="60" />
                </nuxt-link>
                <div class="info">
                  <nuxt-link
                    :to="$alias.bangumi(item.bangumi.id)"
                    class="main-name oneline"
                    v-text="item.bangumi.name"
                  />
                </div>
              </template>
              <template v-else-if="bangumiId">
                <nuxt-link
                  :to="$alias.user(item.user.zone)"
                  class="user-avatar"
                >
                  <v-img
                    :src="item.user.avatar"
                    :lazy="false"
                    width="30"
                    height="30"
                  />
                </nuxt-link>
                <nuxt-link
                  :to="$alias.user(item.user.zone)"
                  class="main-name-user"
                  v-text="item.user.nickname"
                />
              </template>
              <template v-else>
                <nuxt-link
                  :to="$alias.bangumi(item.bangumi.id)"
                  class="bangumi-avatar"
                >
                  <v-img :lazy="false" :src="item.bangumi.avatar" width="30" />
                </nuxt-link>
                <div class="info">
                  <p class="main-info">
                    <span>UP：</span>
                    <nuxt-link
                      :to="$alias.user(item.user.zone)"
                      class="oneline"
                      v-text="item.user.nickname"
                    />
                  </p>
                  <nuxt-link
                    :to="$alias.bangumi(item.bangumi.id)"
                    class="oneline"
                    v-text="item.bangumi.name"
                  />
                </div>
              </template>
            </div>
          </div>
        </waterfall-slot>
      </waterfall>
    </not-ssr>
  </div>
</template>

<script>
export default {
  name: 'ImageWaterfallFlow',
  components: {
    waterfall: () => {
      if (typeof window === 'undefined') {
        return import('~/assets/js/empty')
      }
      return import('vue-waterfall/lib/waterfall')
    },
    'waterfall-slot': () => {
      if (typeof window === 'undefined') {
        return import('~/assets/js/empty')
      }
      return import('vue-waterfall/lib/waterfall-slot')
    }
  },
  props: {
    list: {
      required: true,
      type: Array,
      default: () => []
    },
    bangumiId: {
      type: [Number, String],
      default: 0
    },
    userZone: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 145
    }
  },
  methods: {
    computeBoxHeight(image) {
      return this.computeImageHeight(image) + 106
    },
    computeImageHeight(image) {
      if (!image) {
        return 0
      }
      const result = parseInt((image.height / image.width) * this.width, 10)
      if (result > 240) {
        return 240
      }
      return result
    }
  }
}
</script>

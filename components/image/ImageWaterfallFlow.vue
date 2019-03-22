<style lang="scss">
#image-waterfall-flow {
  background-color: #fff;
  padding-top: $container-padding;

  .waterfall-wrap {
    @media screen and (max-width: 469.98px) {
      width: 300px;
    }
    @media screen and (min-width: 470px) {
      width: 470px;
    }
    @media screen and (min-width: 630px) {
      width: 630px;
    }
    margin: 0 auto;
  }

  .image-item {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 1px solid $color-avatar-border;
    overflow: hidden;

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

      .image {
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
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

    .panel {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 106px;
      background-color: #fff;

      .intro {
        height: 55px;
        padding: 5px 15px;

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

        .user-avatar {
          border-radius: 50%;
        }

        .bangumi-avatar {
          border-radius: 3px;
        }

        .user-avatar,
        .bangumi-avatar {
          overflow: hidden;
          width: 30px;
          height: 30px;
          display: block;
          margin-right: 10px;
          border: 1px solid #e5e9ef;
          text-align: center;
          float: left;
          font-size: 0;

          img {
            width: 30px;
            height: 30px;
          }
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
}
</style>

<template>
  <div id="image-waterfall-flow">
    <div class="waterfall-wrap">
      <FlowRender
        line-width="50%"
        :line-count="2"
        :margin-bottom="10"
        :margin-right="10"
        :vw-viewport="375"
        :extra-height="106"
        :max-height="436"
        :list="items"
      >
        <div slot="item" slot-scope="{ item }" class="image-item">
          <nuxt-link
            :to="$alias.image(item.id)"
            :class="{ 'album-box': item.is_album }"
            class="image-box"
          >
            <i
              v-if="item.is_creator"
              class="is-creator iconfont icon-huangguan"
            />
            <div
              :style="{
                backgroundImage: `url(${$resize(item.url, { width: 400, mode: 2 })})`,
                paddingTop: `${item.height / item.width * 100}%`
              }"
              class="image"
            />
            <div v-if="item.is_album" class="is-album">
              <i class="el-icon-picture-outline" />
              <span class="image-count" v-text="item.image_count" />
            </div>
          </nuxt-link>
          <div class="panel">
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
                  <img :src="$resize(item.bangumi.avatar, { width: 60 })">
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
                  <img :src="$resize(item.user.avatar, { width: 60 })">
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
                  <img :src="$resize(item.bangumi.avatar, { width: 60 })">
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
        </div>
      </FlowRender>
    </div>
  </div>
</template>

<script>
import FlowRender from 'vue-flow-render'

export default {
  name: 'ImageWaterfallFlow',
  components: {
    FlowRender
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
    }
  },
  computed: {
    items() {
      return this.list.map(_ => {
        return Object.assign(_, { ..._.source })
      })
    }
  }
}
</script>

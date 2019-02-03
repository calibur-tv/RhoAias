<style lang="scss">
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
          border: 1px solid $color-gray-normal;
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
        border: 1px solid $color-gray-deep;
        height: 30px;
        color: $color-link;
        border-radius: 4px;
        display: block;
        font-size: 12px;
        line-height: 28px;

        &.active {
          border-color: $color-blue-light;
          background-color: $color-blue-light;
          color: $color-white;
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

.album-footer {
  .bangumi-panel {
    padding-top: $container-padding;
    padding-bottom: $container-padding;

    .summary {
      font-size: 12px;
      color: #666;
      @include twoline(13px);
    }
  }
}
</style>

<template>
  <div id="image-album">
    <div class="container">
      <div class="album-header">
        <h1 class="title oneline">
          [{{ info.is_creator ? '原创' : '转载' }}]
          [{{ info.is_cartoon ? '漫画' : '相册' }}]
          {{ info.name }}
        </h1>
        <div class="user">
          <nuxt-link
            :to="$alias.user(user.zone)"
            class="author">
            <v-img
              :src="user.avatar"
              :avatar="true"
              width="30"
              height="30"
              class="avatar"
            />
            {{ user.nickname }}
          </nuxt-link>
          <span class="dot"> · </span>
          <v-time v-model="info.created_at"/>
          <div class="flex1"/>
          <v-popover
            :report-id="info.id"
            :is-creator="info.is_creator"
            report-type="image"
          >
            <button class="tool-btn">···</button>
          </v-popover>
        </div>
      </div>
    </div>
    <div class="album-body">
      <image-preview
        v-if="info.is_album"
        :images="images"
        class="images-wrap">
        <div
          v-for="img in images"
          :key="img.id"
          class="image-package"
        >
          <v-img
            :src="img.url"
            :full="true"
            :width="img.width"
            :height="img.height"
            class="image"
          />
        </div>
        <p
          v-if="!info.image_count"
          class="no-image"
        >
          还没有上传图片
        </p>
      </image-preview>
      <image-preview
        v-else
        :images="[source]"
      >
        <div class="image-package">
          <v-img
            :src="source.url"
            :width="source.width"
            :height="source.height"
            :full="true"
            class="image"
          />
        </div>
      </image-preview>
      <div 
        v-if="info.is_cartoon" 
        class="cartoon-list">
        <h3 class="sub-title">
          选集（{{ cartoon.length }}）
          <nuxt-link
            v-if="nextPartUrl" 
            :to="nextPartUrl"
            class="next">下一话</nuxt-link>
          <div 
            v-if="showMoreBtn" 
            class="more" 
            @click="showAll = !showAll">{{ showAll ? '收起' : '展开' }}</div>
        </h3>
        <ul>
          <li
            v-for="item in sortCartoons"
            :key="item.id"
          >
            <nuxt-link
              :to="$alias.image(item.id)"
              :class="{ 'active': item.id === id }"
              class="oneline"
              v-text="item.name"
            />
          </li>
        </ul>
      </div>
      <div class="container">
        <social-panel
          :id="info.id"
          :is-creator="info.is_creator"
          :is-mine="isMine"
          type="image"
        />
      </div>
    </div>
    <div class="container">
      <v-lazy>
        <comment-main
          :id="id"
          :master-id="user.id"
          type="image"
        />
      </v-lazy>
      <div class="hr"/>
      <div class="album-footer">
        <div class="bangumi-panel">
          <h3 class="sub-title">所属番剧：</h3>
          <bangumi-panel
            :id="bangumi.id"
            :name="bangumi.name"
            :avatar="bangumi.avatar"
          >
            <p 
              class="summary" 
              v-text="bangumi.summary"/>
          </bangumi-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getImageInfo } from '~/api/imageApi'
import CommentMain from '~/components/comments/CommentMain'
import SocialPanel from '~/components/common/SocialPanel'
import ImagePreview from '~/components/common/ImagePreview/ImagePreview'
import BangumiPanel from '~/components/panel/BangumiPanel'
import VPopover from '~/components/common/Popover'

export default {
  name: 'ImageAlbum',
  async asyncData({ app, store, params, error }) {
    const { id } = params
    return getImageInfo(app, { id })
      .then(info => {
        const { bangumi } = info
        store.commit('social/SET_STATE', {
          type: 'image',
          id,
          data: {
            like: info.liked,
            reward: info.rewarded,
            mark: info.marked,
            like_users: info.like_users,
            mark_users: info.mark_users,
            reward_users: info.reward_users
          }
        })
        store.commit('social/SET_STATE', {
          type: 'bangumi',
          id: bangumi.id,
          data: {
            follow: bangumi.followed
          }
        })
        return {
          info,
          bangumi,
          user: info.user,
          source: info.source,
          images: info.images
        }
      })
      .catch(error)
  },
  head() {
    return {
      title: this.info.name
    }
  },
  components: {
    CommentMain,
    SocialPanel,
    ImagePreview,
    BangumiPanel,
    VPopover
  },
  props: {
    id: {
      type: String,
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
    isMine() {
      return this.$store.state.login
        ? this.user.id === this.$store.state.user.id
        : false
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
        if (item.id === this.id) {
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
        if (meta.id === this.id) {
          this.part = index + 1
        }
      })
      this.page = Math.ceil(this.part / this.take)
    }
  }
}
</script>

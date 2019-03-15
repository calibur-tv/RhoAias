<style lang="scss">
#post-content {
  .title {
    color: #000;
    font-size: 18px;
    font-weight: 700;
    line-height: 28px;
    margin: 8px 0 15px;

    .nice_badge {
      float: left;
      height: 22px;
      line-height: 20px;
      color: #fff;
      cursor: default;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 1px 6px;
      border-radius: 4px;
      margin: 4px 5px 0 0;
      background-color: $color-pink-deep;
    }
  }

  .user {
    position: relative;
    .avatar {
      float: left;
      margin-right: 9px;
    }

    .tool-btn {
      position: absolute;
      right: 5px;
      top: 0;
      line-height: 16px;
      font-size: 12px;
      color: #535353;
    }

    .summary {
      overflow: hidden;

      .nickname {
        overflow: hidden;
        display: inline-block;
        font-size: 14px;
        color: #333;
      }

      .info {
        line-height: 16px;
        font-size: 12px;
        color: #999;

        span {
          margin-right: 5px;
        }
      }
    }
  }

  .content {
    color: #000;
    font-size: 16px;
    margin: 14px 0 22px;
    line-height: 24px;

    .text-area {
      p {
        margin-bottom: 12px;
      }
    }

    .image-area {
      margin: 16px 0;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .tags {
    margin-bottom: -10px;

    > * {
      display: inline-block;
      padding-left: 5px;
      padding-right: 5px;
      height: 18px;
      font-size: 12px;
      border-radius: 9px;
      line-height: 18px;
      background-color: $color-background-container;
      color: $color-text-normal;
      margin-right: 5px;
    }

    i {
      margin-right: 2px;
    }
  }

  .footer {
    text-align: center;
    margin-bottom: 30px;
  }
}
</style>

<template>
  <div id="post-content">
    <h1 class="title">
      <div v-if="post.is_nice" class="nice_badge">
        精
      </div>
      {{ post.title }}
    </h1>
    <FlowHeaderUser :user="user" :is-followed="false" :time="post.created_at" />
    <div class="content">
      <ImagePreview :images="post.images" :download="false" class="image-area">
        <div
          v-for="(img, index) in post.images"
          :key="index"
          class="image-package"
        >
          <v-img
            :src="img.url"
            :full="true"
            :width="img.width"
            :height="img.height"
          />
        </div>
      </ImagePreview>
      <div class="text-area" v-html="post.content" />
    </div>
    <div class="tags">
      <router-link :to="$alias.bangumi(bangumi.id)">
        <i class="iconfont icon-tag" />
        <span v-text="bangumi.name" />
      </router-link>
      <router-link v-if="post.idol" :to="$alias.cartoonRole(post.idol.id)">
        <i class="iconfont icon-tag" />
        <span v-text="post.idol.name" />
      </router-link>
      <BuyContentBtn
        v-else-if="post.is_idol_manager && post.is_creator"
        :id="post.id"
        :title="post.title"
        :author="user.nickname"
        type="post"
      />
      <span
        v-for="tag in post.tags"
        :key="tag.id"
        class="tag"
        v-text="tag.name"
      />
    </div>
    <div class="footer">
      <SocialPanel
        :id="post.id"
        :is-creator="post.is_creator"
        :is-mine="isMaster"
        type="post"
      />
    </div>
  </div>
</template>

<script>
import SocialPanel from '~/components/common/SocialPanel'
import ImagePreview from '~/components/common/ImagePreview/ImagePreview'
import BuyContentBtn from '~/components/idol/BuyContentBtn'
import FlowHeaderUser from '~/components/layouts/FlowHeaderUser'

export default {
  name: 'PostContent',
  components: {
    SocialPanel,
    ImagePreview,
    BuyContentBtn,
    FlowHeaderUser
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    bangumi: {
      type: Object,
      required: true
    }
  },
  computed: {
    total() {
      return this.$store.state.comment.total + 1
    },
    onlySeeMaster() {
      return !!parseInt(this.$route.query.only, 10)
    },
    isMaster() {
      if (!this.$store.state.login) {
        return false
      }
      return this.$store.state.user.id === this.user.id
    }
  }
}
</script>

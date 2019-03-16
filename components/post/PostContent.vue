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
      background-color: $color-pink-normal;
    }
  }

  .buy-content-btn {
    margin-top: 6px;
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
}
</style>

<template>
  <div id="post-content">
    <div class="container">
      <h1 class="title">
        <div v-if="post.is_nice" class="nice_badge">
          精
        </div>
        {{ post.title }}
      </h1>
      <FlowHeaderUser :user="user" :time="post.created_at">
        <BuyContentBtn
          v-if="!post.idol && post.is_idol_manager && post.is_creator"
          :id="post.id"
          :title="post.title"
          :author="user.nickname"
          type="post"
        />
      </FlowHeaderUser>
      <div class="content">
        <ImagePreview
          :images="post.images"
          :download="false"
          class="image-area"
        >
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
      <FlowTags
        :bangumi="bangumi"
        :idol="post.idol"
        :tags="post.tags"
      />
    </div>
  </div>
</template>

<script>
import ImagePreview from '~/components/common/ImagePreview/ImagePreview'
import BuyContentBtn from '~/components/idol/BuyContentBtn'
import FlowHeaderUser from '~/components/layouts/FlowHeaderUser'
import FlowTags from '~/components/flow/FlowTags'

export default {
  name: 'PostContent',
  components: {
    ImagePreview,
    BuyContentBtn,
    FlowHeaderUser,
    FlowTags
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
  }
}
</script>

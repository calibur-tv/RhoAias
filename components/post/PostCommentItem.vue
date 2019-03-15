<style lang="scss">
.post-reply-item {
  position: relative;
  margin-top: $container-padding;
  padding-bottom: $container-padding;
  @include border-bottom();

  .avatar {
    float: left;
    margin-right: 9px;
  }

  .content {
    overflow: hidden;

    .header {
      .tools-btn {
        float: right;
        line-height: 16px;
        font-size: 12px;
        color: #535353;
        padding-top: 9px;
        padding-left: 4px;
      }

      .user {
        .nickname {
          font-size: 14px;
          height: 20px;
          line-height: 20px;
          display: block;
          color: #333;
          margin-bottom: 1px;

          span {
            margin-right: 2px;
          }

          .icon-leader {
            color: $color-pink-deep;
            font-size: 14px;
          }

          .icon-master {
            color: $color-blue-normal;
            font-size: 13px;
          }
        }

        .info {
          color: #999;
          line-height: 14px;
          font-size: 12px;

          span {
            margin-right: 5px;
          }
        }
      }
    }

    .main {
      font-size: 16px;
      margin: 10px 0 4px;
      color: #333;
      line-height: 24px;
      min-height: 65px;

      .image-area {
        margin: 10px 0;

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .footer {
      .social {
        font-size: 12px;

        .reply-liked-btn {
          color: $color-blue-deep;
        }

        button {
          color: #666;
          padding-left: 3px;
          padding-top: 11px;
        }
      }
    }
  }
}
</style>

<template>
  <div :id="`comment-${post.id}`" class="post-reply-item">
    <nuxt-link :to="$alias.user(post.from_user_zone)" class="avatar">
      <v-img :src="post.from_user_avatar" :avatar="true" width="35" />
    </nuxt-link>
    <div class="content">
      <div class="header">
        <VPopover
          :actions="actions"
          :report-id="post.id"
          report-type="post_comment"
        >
          <button class="tools-btn">
            ···
          </button>
        </VPopover>
        <div class="user">
          <nuxt-link
            :to="$alias.user(post.from_user_zone)"
            class="nickname oneline"
          >
            <span v-text="post.from_user_name" />
            <span v-if="post.is_owner">(楼主)</span>
            <i v-if="post.is_leader" class="iconfont icon-leader" />
            <i v-else-if="post.is_master" class="iconfont icon-master" />
          </nuxt-link>
          <div class="info">
            <span>第{{ post.floor_count }}楼</span> <span>·</span>
            <v-time v-model="post.created_at" />
          </div>
        </div>
      </div>
      <div class="main">
        <ImagePreview
          :images="post.images"
          :download="false"
          class="image-area"
        >
          <div
            v-for="(img, idx) in post.images"
            :key="idx"
            class="image-package"
          >
            <v-img
              :src="img.url"
              :width="img.width"
              :height="img.height"
              :full="true"
            />
          </div>
        </ImagePreview>
        <div class="text-area" v-html="post.content" />
      </div>
      <div class="footer">
        <SubCommentList :parent-comment="post" type="post" />
        <div class="social">
          <button
            :class="[post.liked ? 'reply-liked-btn' : 'reply-like-btn']"
            @click="toggleLike"
          >
            <i class="iconfont icon-icon_good" />
            {{ post.liked ? '已赞' : '赞' }}
            <span v-if="post.like_count">({{ post.like_count }})</span>
          </button>
          <button class="reply-btn fr" @click="handleCommentBtnClick">
            回复
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubCommentList from '~/components/comments/SubCommentList'
import ImagePreview from '~/components/common/ImagePreview/ImagePreview'
import VPopover from '~/components/common/Popover'

export default {
  name: 'PostCommentItem',
  components: {
    SubCommentList,
    ImagePreview,
    VPopover
  },
  props: {
    post: {
      required: true,
      type: Object
    },
    masterId: {
      required: true,
      type: Number
    },
    preview: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      deleting: false,
      liking: false
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    isMine() {
      return this.currentUserId === this.post.from_user_id
    },
    canDelete() {
      return this.isMine || this.currentUserId === this.masterId
    },
    actions() {
      const result = []
      if (this.canDelete) {
        result.push({
          name: '删除',
          method: this.deletePost
        })
      }
      result.push({
        name: this.post.liked ? '取消赞' : '点赞',
        method: this.toggleLike
      })

      return result
    }
  },
  methods: {
    async toggleLike() {
      if (!this.currentUserId) {
        this.$channel.$emit('sign-in')
        return
      }
      if (this.liking) {
        return
      }
      this.liking = true
      try {
        await this.$store.dispatch('comment/toggleLikeMainComment', {
          ctx: this,
          type: 'post',
          id: this.post.id
        })
      } finally {
        this.liking = false
      }
    },
    deletePost() {
      if (this.deleting) {
        return
      }
      this.deleting = true
      this.$confirm('删除后无法找回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('comment/deleteMainComment', {
            type: 'post',
            ctx: this,
            id: this.post.id
          })
        })
        .catch(() => {
          this.deleting = false
        })
    },
    handleCommentBtnClick() {
      this.$channel.$emit('reply-comment', {
        id: this.post.id,
        targetUserId: this.post.from_user_id,
        targetUserName: this.post.from_user_name
      })
    }
  }
}
</script>

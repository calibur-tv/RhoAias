<style lang="scss">
.comment-item {
  position: relative;
  margin-top: $container-padding;

  &:after {
    content: '';
    position: absolute;
    left: -$container-padding;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: $color-line;
    transform: scaleY(0.5);
  }

  .avatar {
    margin-right: 10px;
    float: left;
  }

  .content {
    overflow: hidden;
    padding-right: 20px;
    user-select: text;

    .header {
      margin-bottom: 5px;

      .user-nickname {
        overflow: hidden;

        .oneline {
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
          color: $color-text-gray;
        }
      }

      .right-btn {
        float: right;
        margin-left: 15px;

        .tool-btn-wrap {
          display: block;
          position: relative;
          width: 20px;
          height: 20px;

          button {
            position: absolute;
            left: -10px;
            top: -10px;
            width: 40px;
            height: 40px;
          }

          img {
            width: 20px;
            height: 20px;
          }
        }

        .user-follow-button {
          font-size: 12px;
          height: 20px;
          line-height: 18px;
          border-radius: 10px;
          padding-left: 12px;
          padding-right: 12px;
        }
      }
    }

    .main {
      font-size: 15px;
      color: $color-text-normal;
      line-height: 21px;
      min-height: 65px;

      .image-area {
        margin: 10px 0;
        position: relative;

        .image {
          border-radius: 2px;

          &:not(:nth-child(3n)) {
            margin-right: 2%;
          }

          &:nth-child(n + 4) {
            margin-top: 2%;
          }
        }

        .mask {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 32%;
          border-radius: 2px;
          background-color: rgba(#2f2f2f, 0.6);
          overflow: hidden;
          pointer-events: none;

          span {
            font-size: 15px;
            color: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            text-align: center;
          }
        }
      }
    }

    .footer {
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 12px;
      color: $color-text-light;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .info {
        font-size: 12px;
        line-height: 20px;
        color: $color-text-light;
      }

      .social {
        position: relative;
        width: 20px;
        height: 20px;

        button {
          display: block;
          height: 40px;
          width: 80px;
          position: absolute;
          left: -50px;
          top: -10px;
          padding: 10px;
          text-align: right;

          &.is-active {
            color: $color-red;
          }
        }

        i {
          font-size: 20px;
        }
      }
    }
  }
}
</style>

<template>
  <div class="comment-item">
    <div class="avatar">
      <UserAvatar :size="35" :user="computeFromUser" />
    </div>
    <div class="content">
      <div class="header">
        <div class="right-btn">
          <div v-if="canDelete" class="tool-btn-wrap">
            <button @click.stop="deleteComment">
              <img src="~assets/img/comment/dots.png">
            </button>
          </div>
        </div>
        <UserNickname :user="computeFromUser" :is-master="comment.is_owner" />
      </div>
      <div class="main">
        <div
          class="text-area"
          @click="handleCommentBtnClick"
          v-html="comment.content"
        />
        <div v-if="imageCount" class="image-area">
          <div v-if="imageCount === 1">
            <v-img
              v-for="(item, index) in comment.images"
              :key="index"
              :src="item.url"
              :height="106"
              width=""
              class="image"
            />
          </div>
          <div v-else>
            <div>
              <v-img
                v-for="(item, index) in filterImages"
                :key="index"
                :src="item.url"
                :rect="true"
                width="32%"
                class="image"
              />
            </div>
            <div v-if="imageCount > 3" class="mask">
              <span>共{{ imageCount }}张图片</span>
            </div>
          </div>
        </div>
      </div>
      <slot name="extra" />
      <div class="footer">
        <div class="info">
          <span>{{ comment.floor_count }}楼</span>
          <VTime v-model="comment.created_at" />
        </div>
        <div class="social">
          <button
            :class="{ 'is-active': comment.liked }"
            @click.stop="toggleLike"
          >
            <span v-if="comment.like_count">{{
              $utils.shortenNumber(comment.like_count)
            }}</span>
            <i class="iconfont icon-icon_good" />
          </button>
        </div>
      </div>
      <SubCommentList :parent-comment="comment" :type="type" />
    </div>
  </div>
</template>

<script>
import SubCommentList from './SubCommentList'
import UserAvatar from '~/components/user/UserAvatar'
import UserNickname from '~/components/user/UserNickname'

export default {
  name: 'CommentCommentItem',
  components: {
    SubCommentList,
    UserAvatar,
    UserNickname
  },
  props: {
    comment: {
      required: true,
      type: Object
    },
    masterId: {
      required: true,
      type: Number
    },
    type: {
      required: true,
      type: String
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
      return this.currentUserId === this.comment.from_user_id
    },
    canDelete() {
      return this.isMine || this.currentUserId === this.masterId
    },
    computeFromUser() {
      return {
        id: this.comment.from_user_id,
        avatar: this.comment.from_user_avatar,
        nickname: this.comment.from_user_name,
        zone: this.comment.from_user_zone
      }
    },
    imageCount() {
      return this.comment.images.length
    },
    filterImages() {
      return this.inDetail
        ? this.comment.images
        : this.comment.images.slice(0, 3)
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
          type: this.type,
          id: this.comment.id
        })
      } finally {
        this.liking = false
      }
    },
    deleteComment() {
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
            ctx: this,
            type: this.type,
            id: this.comment.id
          })
          this.$emit('delete')
        })
        .catch(() => {
          this.deleting = false
        })
    },
    handleCommentBtnClick() {
      this.$channel.$emit('reply-comment', {
        id: this.comment.id,
        targetUserId: this.computeFromUser.id,
        targetUserName: this.computeFromUser.nickname
      })
    }
  }
}
</script>

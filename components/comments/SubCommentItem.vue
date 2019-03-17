<style lang="scss">
.sub-comment-item {
  padding: 2px 10px;
  font-size: 14px;
  line-height: 18px;

  .nickname {
    color: $color-blue-deep;
  }

  .comment-content {
    margin-right: 6px;
    word-break: break-all;
  }
}
</style>

<style lang="scss" module>
.item {
  position: relative;
  padding-top: 15px;
  padding-bottom: 15px;

  &.in-detail {
    &:first-child {
      &:before {
        content: none;
      }
    }
    &:before {
      left: -$container-padding;
    }

    .avatar {
      margin-right: 10px;
    }

    .main .header {
      margin-bottom: 3px;
    }
  }

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: -20px;
    height: 1px;
    background-color: $color-line;
    transform: scaleY(0.5);
  }

  .avatar {
    float: left;
    margin-right: 8px;

    img {
      pointer-events: none;
    }
  }

  .main {
    overflow: hidden;

    .header {
      font-size: 16px;
      margin-bottom: 7px;

      span {
        line-height: 15px;
        display: inline-block;
        vertical-align: top;
      }

      .nickname {
        color: $color-text-normal;
        font-weight: 500;
      }

      .to-user {
        color: $color-link;
      }
    }

    .content {
      line-height: 21px;
      color: $color-text-normal;
      font-size: 15px;
      user-select: text;
    }
  }
}
</style>

<template>
  <div :class="$style.item">
    <nuxt-link
      :class="$style.avatar"
      :to="$alias.user(comment.from_user_zone)"
      tag="div"
    >
      <VImg
        :src="comment.from_user_avatar"
        :width="22"
        :height="22"
        :avatar="true"
      />
    </nuxt-link>
    <div :class="$style.main">
      <div :class="$style.header" class="oneline">
        <template v-if="showToUser">
          <nuxt-link
            :class="$style.nickname"
            :to="$alias.user(comment.from_user_zone)"
            tag="span"
          >
            {{ comment.from_user_name }}:
          </nuxt-link>
          <nuxt-link
            :class="$style.toUser"
            :to="$alias.user(comment.to_user_zone)"
            tag="span"
          >
            @{{ comment.to_user_name }}
          </nuxt-link>
        </template>
        <nuxt-link
          v-else
          :class="$style.nickname"
          :to="$alias.user(comment.from_user_zone)"
          tag="span"
          v-text="comment.from_user_name"
        />
      </div>
      <p
        :class="$style.content"
        @click="handleSubCommentClick"
        v-text="comment.content"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubCommentItem',
  props: {
    comment: {
      required: true,
      type: Object
    },
    parentUserId: {
      required: true,
      type: Number
    },
    parentCommentId: {
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
      deleting: false
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    isMine() {
      return this.currentUserId === this.comment.from_user_id
    },
    showToUser() {
      return (
        this.comment.to_user_id && this.comment.to_user_id !== this.parentUserId
      )
    },
    canDelete() {
      return this.isMine || this.currentUserId === this.parentUserId
    }
  },
  methods: {
    handleSubCommentClick() {
      if (this.isMine) {
        this.deleteComment()
        this.$nextTick(() => {
          document.getElementById('reply-comment-textarea').style.display =
            'none'
        })
        return
      }
      if (this.currentUserId) {
        this.$channel.$emit('reply-comment', {
          id: this.parentCommentId,
          targetUserId: this.comment.from_user_id,
          targetUserName: this.comment.from_user_name
        })
      }
    },
    deleteComment() {
      if (!this.canDelete) {
        return
      }
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
          this.$store.dispatch('comment/deleteSubComment', {
            ctx: this,
            type: this.type,
            id: this.comment.id,
            parentId: this.comment.parent_id
          })
        })
        .catch(() => {
          this.deleting = false
        })
    }
  }
}
</script>

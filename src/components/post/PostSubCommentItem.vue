<style lang="scss">
  .post-sub-comment-item {
    padding: 2px 10px;
    font-size: 14px;
    line-height: 18px;

    .nickname {
      color: $color-blue-deep
    }

    .comment-content {
      margin-right: 6px;
      word-break: break-all;
    }
  }
</style>

<template>
  <div class="post-sub-comment-item">
    <a class="nickname" :href="$alias.user(comment.from_user_zone)" v-text="comment.from_user_name"></a>
    <template v-if="comment.to_user_zone">
      回复
      <a class="nickname" :href="$alias.user(comment.to_user_zone)" v-text="comment.to_user_name"></a>
    </template>
    :
    <span class="comment-content" @click="deleteComment">{{ comment.content }}</span>
  </div>
</template>

<script>
  export default {
    name: 'post-sub-comment-item',
    props: {
      comment: {
        required: true,
        type: Object
      },
      parentUserId: {
        required: true,
        type: Number
      }
    },
    computed: {
      currentUserId () {
        return this.$store.state.login
          ? this.$store.state.user.id
          : 0
      },
      isMine () {
        return this.currentUserId === this.comment.from_user_id
      },
      canDelete () {
        return this.isMine || this.currentUserId === this.parentUserId
      }
    },
    data () {
      return {
        deleting: false
      }
    },
    methods: {
      deleteComment () {
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
        }).then(() => {
          this.$store.dispatch('comment/deleteSubComment', {
            type: 'post',
            ctx: this,
            id: this.comment.id,
            parentId: this.comment.parent_id
          })
        }).catch((e) => {
          this.deleting = false
          if (e === 'cancel') {
            return
          }
          this.$toast.error(e)
        })
      }
    }
  }
</script>

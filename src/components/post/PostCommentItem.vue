<style lang="scss">
  .post-item {

    .user {
      width: 180px;
      float: left;

      .avatar {
        display: block;
        margin: 34px auto 5px auto;
        border: 1px solid $color-gray-normal;
        @include avatar(80px);
      }

      .nickname {
        display: block;
        background: #fff;
        width: 98px;
        height: 28px;
        line-height: 24px;
        margin: 0 auto;
        text-align: center;
      }
    }

    .content {
      overflow: hidden;
      background: #fff;
      border-top: 1px solid #e5e9ef;
      padding-top: 22px;
      margin-top: 14px;

      .main {
        min-height: 80px;
      }

      .image {
        width: 100%;
        height: auto;
        margin-bottom: 12px;
        cursor: zoom-in;
      }

      .text-package {
        line-height: 24px;
        padding: 2px 0;
        font-size: 14px;
        overflow: hidden;
        word-wrap: break-word;
      }

      .likes-wrap {
        text-align: center;
        margin: 50px 0;
      }

      .footer {
        color: #99a2aa;
        line-height: 26px;
        font-size: 12px;

        .info-bar {
          height: 40px;
          line-height: 40px;

          .delete-btn,
          .floor-count,
          .like-btn {
            margin-right: 20px;
          }

          .v-share {
            float: right;
          }
        }
      }
    }
  }

  .post-reply-item {
    position: relative;
    margin-top: $container-padding;
    padding-bottom: $container-padding;
    @include border-bottom();

    .avatar {
      float: left;
      margin-right: 9px;
      @include avatar-2(35px);
    }

    .content {
      overflow: hidden;

      .header {
        .tools-btn {
          float: right;
          line-height: 16px;
          font-size: 12px;
          color: #535353;
          margin-top: 9px;
          margin-left: 4px;
        }

        .user {
          .nickname {
            font-size: 14px;
            line-height: 21px;
            display: block;
            color: #333;
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
          margin-top: 15px;
          font-size: 12px;

          .reply-liked-btn {
            color: $color-blue-deep;
          }

          button {
            color: #666;
            margin-left: 3px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="post-reply-item" :id="`post-reply-${post.id}`">
    <a class="avatar" :href="$alias.user(post.from_user_zone)">
      <v-img :src="post.from_user_avatar" :width="80" :height="80"></v-img>
    </a>
    <div class="content">
      <div class="header">
        <button class="tools-btn" @click="showControlPanel = true">···</button>
        <div class="user">
          <a
            class="nickname oneline"
            :href="$alias.user(post.from_user_zone)"
            v-text="post.from_user_name"
          ></a>
          <div class="info">
            <span>第{{ post.floor_count }}楼</span>
            <span>·</span>
            <v-time v-model="post.created_at"></v-time>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="text-area" v-html="post.content"></div>
        <div class="image-area">
          <div
            class="image-package"
            v-for="(img, idx) in post.images"
            :key="idx"
            @click="$previewImages(preview, img)"
          >
            <v-img
              :src="img.url"
              width="150"
              mode="2"
              :aspect="$computeImageAspect(img)"
            ></v-img>
          </div>
        </div>
      </div>
      <div class="footer">
        <post-sub-comment-list
          :parent-comment="post"
        ></post-sub-comment-list>
        <div class="social">
          <button
            :class="[ post.liked ? 'reply-liked-btn' : 'reply-like-btn' ]"
            @click="toggleLike"
          >
            <i class="iconfont icon-icon_good"></i>
            {{ post.liked ? '已赞' : '赞' }}
            <span v-if="post.like_count">({{ post.like_count }})</span>
          </button>
          <button ref="replyBtn" class="fr" @click="handleCommentBtnClick">
            回复
          </button>
        </div>
      </div>
      <mt-actionsheet
        :actions="actions"
        v-model="showControlPanel"
      ></mt-actionsheet>
    </div>
  </div>
</template>

<script>
  import PostSubCommentList from '~/components/post/PostSubCommentList'

  export default {
    name: 'post-comment-item',
    props: {
      post: {
        required: true,
        type: Object
      },
      masterId: {
        required: true,
        type: Number
      }
    },
    components: {
      PostSubCommentList
    },
    computed: {
      currentUserId () {
        return this.$store.state.login
          ? this.$store.state.user.id
          : 0
      },
      isMine () {
        return this.currentUserId === this.post['from_user_id']
      },
      canDelete () {
        return this.isMine || this.currentUserId === this.masterId
      },
      actions () {
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
    data () {
      return {
        deleting: false,
        liking: false,
        showControlPanel: false
      }
    },
    methods: {
      async toggleLike () {
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
        } catch (e) {
        } finally {
          this.liking = false
        }
      },
      deletePost () {
        if (this.deleting) {
          return
        }
        this.deleting = true
        this.$confirm('删除后无法找回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('comment/deleteMainComment', {
            type: 'post',
            ctx: this,
            id: this.post.id
          })
        }).catch((e) => {
          this.deleting = false
          if (e === 'cancel') {
            return
          }
          this.$toast.error(e)
        })
      },
      handleCommentBtnClick () {
        this.$emit('reply', {
          id: this.post.id,
          targetUserId: this.post.from_user_id,
          targetUserName: this.post.from_user_name
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$utils.hackFocus({
          button: this.$refs.replyBtn,
          input: document.getElementById('reply-comment-textarea'),
          statement: !!this.currentUserId
        })
      })
    }
  }
</script>

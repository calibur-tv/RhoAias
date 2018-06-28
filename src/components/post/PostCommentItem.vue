<style lang="scss">
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
  <div class="post-reply-item" :id="`comment-${post.id}`">
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
              width="150"
              mode="2"
              :src="img.url"
              :full="true"
              :source="img"
              :aspect="$computeImageAspect(img)"
            ></v-img>
          </div>
        </div>
      </div>
      <div class="footer">
        <sub-comment-list
          :parent-comment="post"
          type="post"
        ></sub-comment-list>
        <div class="social">
          <button
            :class="[ post.liked ? 'reply-liked-btn' : 'reply-like-btn' ]"
            @click="toggleLike"
          >
            <i class="iconfont icon-icon_good"></i>
            {{ post.liked ? '已赞' : '赞' }}
            <span v-if="post.like_count">({{ post.like_count }})</span>
          </button>
          <button class="reply-btn fr" @click="handleCommentBtnClick">
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
  import SubCommentList from '~/components/comments/SubCommentList'

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
      },
      preview: {
        type: Array,
        required: true
      }
    },
    components: {
      SubCommentList
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
        this.$channel.$emit('reply-comment', {
          id: this.post.id,
          targetUserId: this.post.from_user_id,
          targetUserName: this.post.from_user_name
        })
      }
    }
  }
</script>

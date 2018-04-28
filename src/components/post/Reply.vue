<style lang="scss">
  .post-reply-item {
    position: relative;
    margin-top: $container-padding;
    padding-bottom: $container-padding;
    @include border-bottom();

    .avatar {
      float: left;
      margin-right: 9px;
      @include avatar(35px);
    }

    .content {
      overflow: hidden;

      .header {

        .selector {
          width: 102px;
          float: right;
          line-height: 16px;
          font-size: 12px;
          color: #535353;
          margin-top: 9px;

          .v-select-options-wrap {
            background-color: #fff;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            top: 18px;
          }

          .v-select-options-item {
            height: 36px;
            line-height: 35px;
            color: #535353;
            font-size: 12px;
            padding-left: 15px;

            &:not(:last-child) {
              border-bottom: 1px solid #f0f0f0;
            }
          }
        }

        .user {
          .nickname {
            font-size: 14px;
            line-height: 18px;
            color: #333;
          }

          .info {
            color: #999;
            line-height: 16px;
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
        .comments {
          padding: 7px 0 7.5px;
          margin-top: 5px;
          position: relative;
          background-color: #F5F5F5;

          ul {
            li {
              padding: 1.5px 10px 0;
              font-size: 14px;
              line-height: 19px;

              .nickname {
                color: $color-blue-deep
              }

              .comment-content {
                margin-right: 6px;
              }
            }
          }

          .load-all-comment {
            position: relative;
            margin-top: 6px;
            font-size: 12px;
            margin-bottom: 0;
            padding: 0 10px;
            color: #999;
            width: 100%;
            text-align: left;

            &:after {
              content: '';
              position: absolute;
              top: 50%;
              border: 3px solid #f5f5f5;
              border-left-color: #999;
              transform: translateY(-50%);
              margin-left: 4px;
            }
          }
        }

        .social {
          margin-top: 15px;
          font-size: 12px;

          .reply-liked-btn {
            color: $color-blue-deep;
          }

          button {
            color: #666;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="post-reply-item" :id="`post-reply-${post.id}`">
    <router-link class="avatar" :to="$alias.user(post.user.zone)">
      <v-img :src="post.user.avatar" :width="80" :height="80"></v-img>
    </router-link>
    <div class="content">
      <div class="header">
        <v-select
          class="selector"
          placeholder=""
          :abort="true"
          :options="options"
          @submit="handleSelectSubmit"
        >
          <template slot="tail">···</template>
        </v-select>
        <div class="user">
          <router-link
            class="nickname oneline"
            :to="$alias.user(post.user.zone)"
            v-text="post.user.nickname"
          ></router-link>
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
            :key="img"
            @click="$previewImages(preview, img)"
          >
            <v-img
              :src="img"
              width="150"
              mode="2"
              :aspect="$computeImageAspect(img)"
            ></v-img>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="comments" v-if="comments.length">
          <ul>
            <li
              v-for="item in comments"
              @click="handleCommentClick(item)"
            >
              <router-link class="nickname" :to="$alias.user(item.from_user_zone)" v-text="item.from_user_name"></router-link>
              <template v-if="item.to_user_zone">
                回复
                <router-link class="nickname" :to="$alias.user(item.to_user_zone)" v-text="item.to_user_name"></router-link>
              </template>
              :
              <span class="comment-content">{{ item.content }}</span>
            </li>
          </ul>
          <button
            v-if="post.comment_count > 10"
            class="load-all-comment"
            @click="loadAllComment"
          >
            查看全部{{ post.comment_count }}条评论
          </button>
        </div>
        <div class="social">
          <button
            :class="[ post.liked ? 'reply-liked-btn' : 'reply-like-btn' ]"
            @click="toggleLike"
          >
            <i class="iconfont icon-icon_good"></i>
            {{ post.liked ? '已赞' : '赞' }}
            <span v-if="post.like_count">({{ post.like_count }})</span>
          </button>
          <button class="fr" @click="handleCommentBtnClick">
            回复
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'post-reply-item',
    props: {
      post: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
      },
      preview: {
        type: Array,
        default: [],
        required: true
      }
    },
    data () {
      return {
        loadingToggleLike: false
      }
    },
    computed: {
      canDelete () {
        return this.isMine || this.isMaster
      },
      currentUserId () {
        return this.$store.state.login ? this.$store.state.user.id : 0
      },
      isMine () {
        return this.currentUserId === this.post.user.id
      },
      isMaster () {
        return this.currentUserId === this.$store.state.post.show.info.user.id
      },
      comments () {
        return this.post.comments
      },
      options () {
        const result = ['回复']
        if (this.canDelete) {
          result.push('删除')
        }
        if (!this.isMine) {
          result.push(this.post.liked ? '取消赞' : '赞')
        }

        return result
      }
    },
    methods: {
      async toggleLike () {
        if (!this.$store.state.login) {
          this.$channel.$emit('drawer-open-sign')
          return
        }
        if (this.isMine) {
          this.$toast.error('不能给自己点赞')
          return
        }
        if (this.loadingToggleLike) {
          return
        }
        this.loadingToggleLike = true
        try {
          await this.$store.dispatch('post/toggleLike', {
            ctx: this,
            id: this.post.id
          })
        } catch (err) {
          this.$toast.error(err)
        } finally {
          this.loadingToggleLike = false
        }
      },
      loadAllComment () {
        this.$emit('loadcomment', {
          id: this.post.id,
          index: this.index
        })
      },
      handleCommentBtnClick () {
        this.$emit('addcomment', {
          postId: this.post.id,
          targetUserId: this.isMine ? 0 : this.post.user.id
        })
      },
      handleSelectSubmit (option) {
        if (option === '删除') {
          this.$emit('delete')
        } else if (option === '赞' || option === '取消赞') {
          this.toggleLike()
        } else if (option === '回复') {
          this.handleCommentBtnClick()
        }
      },
      handleCommentClick (comment) {
        if (!this.currentUserId) {
          return
        }
        if (this.currentUserId === comment.from_user_id) {
          return
        }
        this.$emit('reply', {
          postId: this.post.id,
          targetUserId: comment.from_user_id,
          to_user_name: comment.from_user_name
        })
      }
    }
  }
</script>

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
  <!--
  <el-row class="post-item" :id="`post-reply-${post.id}`">
    <div class="user" :span="5">
      <a :href="$alias.user(post.from_user_zone)" target="_blank">
        <v-img class="avatar" :src="post.from_user_avatar" :width="80" :height="80"></v-img>
      </a>
      <a
        :href="$alias.user(post.from_user_zone)"
        class="nickname oneline"
        target="_blank"
        v-text="post.from_user_name"
      ></a>
    </div>
    <div class="content">
      <div class="main">
        <div
          class="image-package"
          v-for="(img, idx) in post.images"
          :key="idx"
          @click="$previewImages(post.images, idx)"
        >
          <v-img
            class="image"
            :src="img.url"
            width="350"
            mode="2"
            :aspect="$computeImageAspect(img)"
          ></v-img>
        </div>
        <div class="text-package" v-html="post.content"></div>
      </div>
      <div class="footer">
        <div class="info-bar">
          <button class="like-btn" @click="toggleLike">
            {{ post.liked ? '已赞' : '赞' }}
            <span v-if="post.like_count">({{ post.like_count }})</span>
          </button>
          <button class="delete-btn" v-if="canDelete" @click="deletePost">删除</button>
          <span class="floor-count">{{ post.floor_count }}楼</span>
          <v-time v-model="post.created_at"></v-time>
        </div>
      </div>
    </div>
  </el-row>
  -->
  <div class="post-reply-item" :id="`post-reply-${post.id}`">
    <a class="avatar" :href="$alias.user(post.from_user_zone)">
      <v-img :src="post.from_user_avatar" :width="80" :height="80"></v-img>
    </a>
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
          <button class="fr" @click="handleCommentBtnClick">
            回复
          </button>
        </div>
      </div>
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
    data () {
      return {
        deleting: false,
        liking: false
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
      handleSelectSubmit (option) {
        if (option === '删除') {
          this.$emit('delete')
        } else if (option === '赞' || option === '取消赞') {
          this.toggleLike()
        } else if (option === '回复') {
          this.handleCommentBtnClick()
        }
      },
      handleCommentBtnClick () {

      }
    }
  }
</script>

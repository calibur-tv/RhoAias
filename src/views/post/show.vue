<style lang="scss">
#post-show {
  .post {
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
        @include avatar(35px);
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
      margin: 22px 0;
      line-height: 24px;

      .image-area {
        margin: 16px 0;

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .footer {
      text-align: center;
      margin-bottom: 30px;

      button {
        margin: 0 5px;
        font-size: 13px;

        i {
          font-size: 12px;
          line-height: 16px;
        }
      }

      .post-like-btn {
        @include btn-empty(#ffffff, #fa5555);
      }

      .post-liked-btn {
        @include btn-empty(#fa5555);
      }

      .post-mark-btn {
        @include btn-empty(#ffffff, #eb9e05);
      }

      .post-marked-btn {
        @include btn-empty(#eb9e05);
      }

      .post-comment-btn {
        @include btn-empty(#ffffff, $color-blue-normal);
      }
    }
  }

  .post-comment-drawer {
    .reply {
      .user {
        padding-top: $container-padding;

        .avatar {
          float: left;
          margin-right: 9px;
          @include avatar(35px);
        }

        .summary {
          overflow: hidden;

          .nickname {
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
        font-size: 16px;
        line-height: 24px;
        padding-top: 16px;
        padding-bottom: 16px;
        color: #000;

        .image-area {
          margin: 16px 0;

          img {
            width: 100%;
            height: auto;
          }
        }
      }
    }

    .total {
      height: 40px;
      line-height: 40px;
      color: #000;
      font-size: 16px;
    }

    .comments {
      li {
        padding: 17px 0 13px;
        position: relative;
        @include border-bottom();

        .from-user {
          .avatar {
            float: left;
            display: block;
            margin-right: 9px;
            @include avatar(35px);
          }

          .summary {
            overflow: hidden;

            .nickname {
              display: inline-block;
              font-size: 14px;
              line-height: 14px;
              margin-bottom: 6px;
              margin-top: 2px;
              color: $color-blue-deep;
            }

            .info {
              font-size: 12px;
              line-height: 12px;
              color: #999;
            }
          }
        }

        .content {
          padding-top: 11px;
          font-size: 16px;
          line-height: 24px;
          margin-left: 45px;

          a {
            font-size: 16px;
          }
        }
      }
    }
  }

  .create-post-comment-drawer {
    border-radius: 0 0 5px 5px;

    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin-top: -46px;
      padding-top: 46px;
      z-index: -1;
    }

    textarea {
      font-size: 16px;
      line-height: 24px;
      color: #000;
      font-weight: 400;
      padding-top: 10px;
      flex-grow: 1;
    }

    .btn-submit {
      margin-top: $container-padding;
      margin-bottom: $container-padding;
    }
  }

  .bangumi-panel {
    padding-top: $container-padding;
    padding-bottom: $container-padding;

    .summary {
      font-size: 12px;
      color: #666;
      @include twoline(13px);
    }
  }
}
</style>

<template>
  <div id="post-show">
    <div class="container">
      <div class="post">
        <h1 class="title">
          <div
            v-if="post.is_nice"
            class="nice_badge"
          >精</div>
          {{ post.title }}
        </h1>
        <div class="user">
          <a 
            :href="$alias.user(master.zone)" 
            class="avatar">
            <img :src="$resize(master.avatar, { width: 70 })">
          </a>
          <button 
            class="tool-btn" 
            @click="showPostActionSheet = true">···</button>
          <div class="summary">
            <a
              :href="$alias.user(master.zone)"
              class="nickname"
              v-text="master.nickname"
            />
            <div class="info">
              <span>第1楼</span>
              <span>·</span>
              <template v-if="total > 1">
                <span>共{{ total }}楼</span>
                <span>·</span>
              </template>
              <v-time v-model="post.created_at"/>
              <span 
                v-if="post.view_count" 
                class="fr">
                <i class="iconfont icon-yuedu"/>
                {{ $utils.shortenNumber(post.view_count) }}
              </span>
            </div>
          </div>
        </div>
        <div class="content">
          <div 
            class="text-area" 
            v-html="post.content"/>
          <div class="image-area">
            <div
              v-for="(img, idx) in post.images"
              :key="idx"
              class="image-package"
              @click="$previewImages(post.preview_images, img)"
            >
              <v-img
                :src="img.url"
                :full="true"
                :source="img"
                :aspect="$computeImageAspect(img)"
                width="300"
                mode="2"
              />
            </div>
          </div>
        </div>
        <div class="footer">
          <social-panel
            :id="post.id"
            :is-creator="post.is_creator"
            :user-id="master.id"
            :liked="post.liked"
            :marked="post.marked"
            :rewarded="post.rewarded"
            :reward-count="post.reward_count"
            :like-count="post.like_count"
            :mark-count="post.mark_count"
            :users="post.is_creator ? post.reward_users : post.like_users"
            type="post"
          />
        </div>
        <mt-actionsheet
          :actions="actions"
          v-model="showPostActionSheet"
        />
      </div>
      <div class="hr"/>
      <comment-main
        :id="post.id"
        :only-see-master="onlySeeMaster"
        :bottom-append-comment="false"
        :master-id="master.id"
        type="post"
        empty-text=""
      >
        <div slot="header"/>
        <post-comment-item
          slot="comment-item"
          slot-scope="{ comment }"
          :post="comment"
          :master-id="master.id"
          :preview="post.preview_images"
        />
        <post-comment-form
          slot="reply-form"
          slot-scope="{ close }"
          :id="post.id"
          type="post"
          @close="close"
        />
      </comment-main>
    </div>
    <div class="hr"/>
    <div class="container bangumi-panel">
      <h3 class="sub-title">所属番剧：</h3>
      <v-bangumi-panel
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
        :followed="bangumi.followed"
        @follow="handleBangumiFollow"
      >
        <p 
          class="summary" 
          v-text="bangumi.summary"/>
      </v-bangumi-panel>
    </div>
  </div>
</template>

<script>
import CommentMain from "~/components/comments/CommentMain";
import PostCommentItem from "~/components/post/PostCommentItem";
import PostCommentForm from "~/components/post/PostCommentForm";
import SocialPanel from "~/components/common/SocialPanel";

export default {
  name: "PostShow",
  async asyncData({ route, store, ctx }) {
    const only = route.query.only
      ? parseInt(route.query.only, 10)
        ? 1
        : 0
      : 0;
    const id = route.params.id;
    await Promise.all([
      store.dispatch("post/getPost", {
        id,
        ctx,
        only
      }),
      store.dispatch("comment/getMainComments", {
        ctx,
        id,
        type: "post",
        onlySeeMaster: only,
        seeReplyId: route.query.reply
      })
    ]);
  },
  components: {
    CommentMain,
    PostCommentItem,
    PostCommentForm,
    SocialPanel
  },
  head() {
    return {
      title: `${this.post.title} - 帖子`
    };
  },
  data() {
    return {
      loadingToggleLike: false,
      loadingToggleMark: false,
      showPostActionSheet: false
    };
  },
  computed: {
    resource() {
      return this.$store.state.post.info;
    },
    bangumi() {
      return this.resource.bangumi;
    },
    post() {
      return this.resource.post;
    },
    master() {
      return this.resource.user;
    },
    total() {
      return this.$store.state.comment.total + 1;
    },
    onlySeeMaster() {
      return !!parseInt(this.$route.query.only, 10);
    },
    isMaster() {
      if (!this.$store.state.login) {
        return false;
      }
      return this.$store.state.user.id === this.master.id;
    },
    actions() {
      const result = [
        {
          name: "回复",
          method: this.handleReplyBtnClick
        }
      ];
      if (this.isMaster) {
        result.push({
          name: "删除",
          method: this.deletePost
        });
      } else {
        result.push({
          name: this.post.liked ? "取消喜欢" : "喜欢",
          method: this.toggleLike
        });
        result.push({
          name: this.post.marked ? "取消收藏" : "收藏",
          method: this.toggleMark
        });
      }
      result.push({
        name: this.onlySeeMaster ? "取消只看楼主" : "只看楼主",
        method: this.switchOnlyMaster
      });

      return result;
    }
  },
  mounted() {
    this.scrollToReply();
  },
  methods: {
    handleBangumiFollow(result) {
      this.$store.commit("post/FOLLOW_BANGUMI", {
        id: this.post.id,
        result
      });
    },
    switchOnlyMaster() {
      window.location = this.$alias.post(this.post.id, {
        only: this.onlySeeMaster ? 0 : 1
      });
    },
    deletePost() {
      this.$confirm("删除后无法找回, 是否继续?")
        .then(async () => {
          await this.$store.dispatch("post/deletePost", {
            ctx: this,
            id: this.post.id
          });
          window.location = this.$alias.bangumi(this.bangumi.id);
        })
        .catch(e => {
          this.$toast.error(e);
        });
    },
    async toggleLike() {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (this.isMaster) {
        this.$toast.error("不能赞赏自己的帖子");
        return;
      }
      const notLike = !this.post.liked;
      if (notLike && !this.$store.state.user.coin) {
        this.$toast.error("金币不足");
        return;
      }
      if (this.loadingToggleLike) {
        return;
      }
      this.loadingToggleLike = true;
      try {
        await this.$store.dispatch("post/toggleLike", {
          ctx: this,
          id: this.post.id
        });
        if (notLike) {
          this.$store.commit("USE_COIN");
        }
      } catch (err) {
        this.$toast.error(err);
      } finally {
        this.loadingToggleLike = false;
      }
    },
    async toggleMark() {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (this.isMaster) {
        this.$toast.error("不能收藏自己的帖子");
        return;
      }
      if (this.loadingToggleMark) {
        return;
      }
      this.loadingToggleMark = true;
      try {
        await this.$store.dispatch("post/toggleMark", {
          ctx: this,
          id: this.post.id
        });
      } catch (err) {
        this.$toast.error(err);
      } finally {
        this.loadingToggleMark = false;
      }
    },
    handleReplyBtnClick() {
      this.$channel.$emit("open-create-comment-drawer");
    },
    scrollToReply() {
      const replyId = this.$route.query.reply;
      if (!replyId) {
        return;
      }
      const reply = document.getElementById(`comment-${replyId}`);
      if (!reply) {
        return;
      }
      setTimeout(() => {
        this.$scrollToY(this.$utils.getOffsetTop(reply) - 100, 600);
      }, 400);
    }
  }
};
</script>

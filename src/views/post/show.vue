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
            <v-img
              :src="master.avatar"
              :avatar="true"
              size="35"
            />
          </a>
          <v-popover
            :actions="actions"
            :report-id="post.id"
            :is-creator="post.is_creator"
            report-type="post"
          >
            <button class="tool-btn">···</button>
          </v-popover>
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
          <image-preview
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
                :full="true"
                :width="img.width"
                :height="img.height"
              />
            </div>
          </image-preview>
          <div
            class="text-area"
            v-html="post.content"/>
        </div>
        <div class="footer">
          <social-panel
            :id="post.id"
            :is-creator="post.is_creator"
            :user-id="master.id"
            :liked="post.liked"
            :marked="post.marked"
            :rewarded="post.rewarded"
            :reward-users="post.reward_users"
            :like-users="post.like_users"
            :mark-users="post.mark_users"
            type="post"
          >
            <el-button
              type="primary"
              class="el-button-primary"
              size="mini"
              round
              @click="handleReplyBtnClick"
            >
              <i class="iconfont icon-talk"/>
              回复
            </el-button>
          </social-panel>
        </div>
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
          :master-id="master.id"
          type="post"
          @close="close"
        />
      </comment-main>
    </div>
    <div class="hr"/>
    <div class="container bangumi-panel">
      <h3 class="sub-title">所属番剧：</h3>
      <bangumi-panel
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
        :followed="bangumi.followed"
        @follow="handleBangumiFollow"
      >
        <p 
          class="summary" 
          v-text="bangumi.summary"/>
      </bangumi-panel>
    </div>
  </div>
</template>

<script>
import CommentMain from "~/components/comments/CommentMain";
import PostCommentItem from "~/components/post/PostCommentItem";
import PostCommentForm from "~/components/post/PostCommentForm";
import SocialPanel from "~/components/common/SocialPanel";
import ImagePreview from "~/components/common/ImagePreview/ImagePreview";
import BangumiPanel from "~/components/panel/BangumiPanel";
import VPopover from "~/components/common/Popover";

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
        seeReplyId: route.query["comment-id"]
      })
    ]);
  },
  components: {
    CommentMain,
    PostCommentItem,
    PostCommentForm,
    SocialPanel,
    ImagePreview,
    BangumiPanel,
    VPopover
  },
  head() {
    return {
      title: `${this.post.title} - 帖子`
    };
  },
  data() {
    return {
      loadingToggleLike: false,
      loadingToggleMark: false
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
      }
      result.push({
        name: this.onlySeeMaster ? "取消只看楼主" : "只看楼主",
        method: this.switchOnlyMaster
      });

      return result;
    }
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
          if (e !== "cancel") {
            this.$toast.error(e);
          }
        });
    },
    handleReplyBtnClick() {
      this.$channel.$emit(`open-create-comment-drawer-post-${this.post.id}`);
    }
  }
};
</script>

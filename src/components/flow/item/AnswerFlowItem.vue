<style lang="scss">
.answer-flow-item {
  padding: 16px 0;
  position: relative;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(26, 26, 26, 0.1);
  overflow: hidden;

  .answer-header {
    height: 40px;
    margin-bottom: 10px;
    padding: 0 $container-padding;

    .avatar {
      float: left;
      margin-right: 10px;
      width: 38px;
      height: 38px;
      @extend %avatar;
    }

    .info {
      overflow: hidden;

      .nickname {
        color: #444;
        font-weight: 600;
        font-size: 15px;
        line-height: 1.4;
      }

      .signature {
        line-height: 1.3;
        font-size: 14px;
        color: #646464;
      }
    }
  }

  .answer-meta {
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 10px;
    color: #8590a6;
    padding: 0 $container-padding;

    a {
      font-size: inherit;
    }
  }

  .answer-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 54px;
    padding: 10px $container-padding;

    .el-button {
      margin-left: 10px;
      color: $color-text-normal;
    }
  }
}
</style>

<template>
  <div
    :id="`answer-${item.id}`"
    class="answer-flow-item"
  >
    <header class="answer-header">
      <a
        :href="$alias.user(item.user.zone)"
        class="avatar"
      >
        <v-img
          :src="item.user.avatar"
          size="38"
        />
      </a>
      <div class="info">
        <a
          :href="$alias.user(item.user.zone)"
          class="nickname"
          v-text="item.user.nickname"
        />
        <p
          class="oneline signature"
          v-text="item.user.signature"
        />
      </div>
    </header>
    <div
      v-if="item.vote_count"
      class="answer-meta"
    >
      <span v-if="item.source_url">
        <a
          :href="item.source_url"
          target="_blank"
        >
          原文链接
        </a>
        ·
      </span>
      <span v-if="item.created_at === item.published_at">
        发布于
        <v-time
          v-model="item.created_at"
        />
      </span>
      <span v-else>
        编辑于
        <v-time v-model="item.published_at"/>
      </span>
      ·
      <span>
        {{ item.vote_count }} 赞同了该回答
      </span>
    </div>
    <main class="answer-content">
      <json-content :content="item.content"/>
      <social-panel
        :id="item.id"
        :is-creator="!item.source_url"
        :user-id="item.user.id"
        :liked="item.liked"
        :marked="item.marked"
        :rewarded="item.rewarded"
        :reward-users="item.reward_users"
        :like-users="item.like_users"
        :mark-users="item.mark_users"
        type="answer"
        social-commit-path="question/ANSWER_SOCIAL_TOGGLE"
        user-commit-path="question/FETCH_ANSWER_SOCIAL_USERS"
      />
    </main>
    <footer class="answer-footer">
      <vote-button
        :id="item.id"
        :total="item.vote_count"
        :score="item.voted"
        :author-id="item.user.id"
        type="answer"
        @vote="handleVoted"
      />
      <el-button
        type="text"
        size="medium"
        @click="loadAnswerComment"
      >
        <i class="iconfont icon-pinglun1"/>
        {{ item.comment_count ? item.comment_count + ' 条评论' : '添加评论' }}
      </el-button>
      <template v-if="isMine">
        <el-button
          type="text"
          size="medium"
          @click="$channel.$emit('open-write-answer-dialog', true)"
        >
          编辑
        </el-button>
        <el-button
          type="text"
          size="medium"
          @click="deleteAnswer"
        >
          删除
        </el-button>
      </template>
    </footer>
    <v-drawer
      v-model="showCommentModal"
      from="bottom"
      size="100%"
    >
      <div class="container">
        <comment-main
          :id="item.id"
          :master-id="item.user.id"
          :auto="true"
          empty-text="还没有评论"
          type="answer"
          @delete-main-comment="handleCommentChange(-1)"
          @create-main-comment="handleCommentChange(1)"
        >
          <button
            slot="header-btn"
            class="write-btn"
            style="margin-left: 15px"
            @click="showCommentModal = false"
          >关闭</button>
        </comment-main>
      </div>
    </v-drawer>
  </div>
</template>

<script>
import JsonContent from "~/components/jsonEditor/JsonContent";
import VoteButton from "~/components/common/VoteButton";
import CommentMain from "~/components/comments/CommentMain";
import SocialPanel from "~/components/common/SocialPanel";
import Api from "~/api/questionApi";

export default {
  name: "AnswerFlowItem",
  components: {
    JsonContent,
    VoteButton,
    CommentMain,
    SocialPanel
  },
  props: {
    item: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      showCommentModal: false
    };
  },
  computed: {
    qaq() {
      return this.$store.state.question.qaq;
    },
    isMine() {
      return this.$store.state.login
        ? this.$store.state.user.id === this.item.user.id
        : false;
    }
  },
  methods: {
    handleVoted(result) {
      this.$store.commit("question/TOGGLE_ANSWER_VOTE", {
        id: this.item.id,
        data: result
      });
    },
    loadAnswerComment() {
      this.showCommentModal = true;
      this.$nextTick(() => {
        this.$channel.$emit(`fire-load-comment-answer-${this.item.id}`);
      });
    },
    deleteAnswer() {
      this.$confirm("删除后无法找回, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const api = new Api(this);
          try {
            await api.deleteAnswer({
              id: this.item.id
            });
            window.location.reload();
          } catch (e) {
            this.$toast.error(e);
          }
        })
        .catch(() => {});
    },
    handleCommentChange(count) {
      this.$store.commit("question/COMMENT_CHANGE_COUNT", {
        id: this.item.id,
        key: "answer",
        value: count
      });
    }
  }
};
</script>

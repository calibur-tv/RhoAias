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

  .answer-content {
    margin-bottom: 38px;
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
  <div :id="`answer-${item.id}`"
       class="answer-flow-item"
  >
    <header class="answer-header">
      <nuxt-link :to="$alias.user(item.user.zone)"
                 class="avatar"
      >
        <v-img :src="item.user.avatar"
               :avatar="true" width="38" height="38"
        />
      </nuxt-link>
      <div class="info">
        <nuxt-link
          :to="$alias.user(item.user.zone)"
          class="nickname"
          v-text="item.user.nickname"
        />
        <p class="oneline signature"
           v-text="item.user.signature"
        />
      </div>
    </header>
    <div v-if="item.vote_count"
         class="answer-meta"
    >
      <span v-if="item.source_url">
        <nuxt-link :href="item.source_url"
                   target="_blank"
        >
          原文链接
        </nuxt-link>
        ·
      </span>
      <span v-if="item.created_at === item.published_at">
        发布于
        <v-time v-model="item.created_at" />
      </span>
      <span v-else>
        编辑于
        <v-time v-model="item.published_at" />
      </span>
      ·
      <span> {{ item.vote_count }} 赞同了该回答 </span>
    </div>
    <main class="answer-content">
      <JsonContent :content="item.content" />
    </main>
    <footer class="answer-footer">
      <VoteButton
        :id="item.id"
        :total="item.vote_count"
        :score="item.voted"
        :author-id="item.user.id"
        type="answer"
      />
      <el-button type="text"
                 size="medium" @click="loadAnswerComment"
      >
        <i class="iconfont icon-talk" />
        {{ item.comment_count ? item.comment_count + ' 条评论' : '添加评论' }}
      </el-button>
      <VPopover
        :report-id="item.id"
        :is-creator="!item.source_url"
        report-type="answer"
      >
        <el-button type="text"
                   size="medium"
        >
          <i class="el-icon-phone" />
          举报
        </el-button>
      </VPopover>
    </footer>
    <v-drawer v-model="showCommentModal"
              from="bottom" size="80%"
    >
      <div class="container">
        <CommentMain
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
          >
            关闭
          </button>
        </CommentMain>
      </div>
    </v-drawer>
  </div>
</template>

<script>
import JsonContent from '~/components/jsonEditor/JsonContent'
import VoteButton from '~/components/common/VoteButton'
import CommentMain from '~/components/comments/CommentMain'
import VPopover from '~/components/common/Popover'

export default {
  name: 'AnswerFlowItem',
  components: {
    JsonContent,
    VoteButton,
    CommentMain,
    VPopover
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
    }
  },
  methods: {
    loadAnswerComment() {
      this.showCommentModal = true
      this.$nextTick(() => {
        this.$channel.$emit(`fire-load-comment-answer-${this.item.id}`)
      })
    },
    handleCommentChange(count) {
      this.item.comment_count += count
    }
  }
}
</script>

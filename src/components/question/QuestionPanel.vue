<style lang="scss">
#question-panel {
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  padding: 16px $container-padding;
  margin-bottom: 10px;

  .qaq-question {
    .qaq-tags {
      @extend %clearfix;

      li {
        float: left;
        margin-right: 8px;
        margin-bottom: 6px;
      }

      a {
        display: inline-block;
        padding: 0 5px;
        height: 24px;
        line-height: 22px;
        font-size: 12px;
        color: $color-pink-normal;
        border-radius: 4px;
        border: 1px solid $color-pink-normal;
        font-weight: 700;
      }
    }

    .title {
      h1 {
        margin-top: 2px;
        margin-bottom: 4px;
        font-weight: 500;
        font-size: 17px;
        line-height: 1.6;
        color: #1a1a1a;
      }
    }

    .content {
      .collapsed-content {
        margin-bottom: 1em;
        font-size: 15px;
        line-height: 1.6;
        @extend %breakWord;
      }

      .text-area {
        p {
          margin: 1em 0;
          font-size: 15px;
          line-height: 1.6;
          @extend %breakWord;

          &:first-child {
            margin-top: 0;
          }
        }
      }

      .image-package {
        .image {
          margin: 15px 0;
        }
      }
    }

    .panel {
      .footer-btn {
        margin-left: 7px;
        @include btn-empty($color-text-normal);
      }

      .collapse-btn {
        color: $color-text-normal;
        font-size: 14px;
        margin-left: 10px;
        margin-top: 10px;
      }
    }
  }
}
</style>

<template>
  <div
    v-if="qaq"
    id="question-panel"
  >
    <div class="qaq-question">
      <ul class="qaq-tags">
        <li
          v-for="tag in qaq.tags"
          :key="tag.id"
        >
          <a
            :href="$alias.bangumi(tag.id)"
            v-text="tag.name"
          />
        </li>
      </ul>
      <div class="title">
        <h1 v-text="qaq.title"/>
      </div>
      <div class="content">
        <div
          v-if="collapsed"
          class="collapsed-content"
        >
          {{ collapsedContent }}
          <el-button
            type="text"
            size="mini"
            @click="collapsed = false"
          >
            显示全部
            <i class="el-icon-arrow-down"/>
          </el-button>
        </div>
        <template v-else>
          <div
            class="text-area"
            v-html="qaq.content"
          />
          <div
            v-for="(img, idx) in qaq.images"
            :key="idx"
            class="image-package"
          >
            <v-img
              :src="img.url"
              :width="img.width"
              :height="img.height"
              :full="true"
              class="image"
            />
          </div>
        </template>
      </div>
      <div class="panel">
        <follow-button
          :id="id"
          :followed="qaq.followed"
          :theme="qaq.followed ? 'info' : 'primary'"
          :round="false"
          followed-text="取消关注"
          un-follow-text="关注问题"
          size="medium"
          type="question"
          @submit="toggleFollowQAQ"
        />
        <template v-if="qaq.my_answer">
          <template v-if="answerPage">
            <button
              v-if="isMyAnswer"
              class="footer-btn"
              @click="editMyAnswer"
            >
              <i class="el-icon-edit"/>
              编辑回答
            </button>
            <a
              v-else-if="qaq.my_answer.published_at"
              :href="$alias.answer(qaq.my_answer.id)"
              class="footer-btn"
            >
              <i class="el-icon-view"/>
              查看回答
            </a>
          </template>
          <template v-else>
            <a
              v-if="qaq.my_answer.published_at"
              :href="$alias.answer(qaq.my_answer.id)"
              class="footer-btn"
            >
              <i class="el-icon-view"/>
              查看回答
            </a>
            <button
              v-else
              class="footer-btn"
              @click="editMyAnswer"
            >
              <i class="el-icon-edit"/>
              编辑回答
            </button>
          </template>
        </template>
        <button
          v-else
          class="footer-btn"
          @click="beginWriteAnswer"
        >
          <i class="el-icon-edit"/>
          写回答
        </button>
        <button
          class="footer-btn"
          @click="loadQAQComment"
        >
          <i class="iconfont icon-talk"/>
          {{ qaq.comment_count ? qaq.comment_count + '条评论' : '添加评论' }}
        </button>
        <div v-if="!collapsed">
          <button
            class="collapse-btn"
            @click="collapsedQAQ"
          >
            <i class="el-icon-arrow-up"/>
            收起
          </button>
          <v-popover
            :report-id="qaq.id"
            report-type="question"
          >
            <button class="collapse-btn">
              <i class="el-icon-phone"/>
              举报
            </button>
          </v-popover>
        </div>
      </div>
    </div>
    <create-answer-form
      v-model="showCreateAnswerForm"
      :title="qaq.title"
      :question-id="id"
      :answer-id="qaq.my_answer ? qaq.my_answer.id : 0"
      :published="qaq.my_answer ? !!qaq.published_at : false"
    />
    <v-drawer
      v-model="showCommentModal"
      from="bottom"
      size="100%"
    >
      <div class="container">
        <comment-main
          :id="id"
          :master-id="qaq.user_id"
          :auto="true"
          empty-text="还没有评论"
          type="question"
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
import FollowButton from '~/components/common/FollowButton'
import CreateAnswerForm from '~/components/question/CreateAnswerForm'
import QuestionApi from '~/api/questionApi'
import CommentMain from '~/components/comments/CommentMain'
import VPopover from '~/components/common/Popover'

export default {
  name: 'QuestionPanel',
  components: {
    VPopover,
    FollowButton,
    CommentMain,
    CreateAnswerForm
  },
  data() {
    return {
      collapsed: true,
      showCommentModal: false,
      showCreateAnswerForm: false
    }
  },
  computed: {
    id() {
      return this.qaq.id
    },
    qaq() {
      return this.$store.state.question.qaq
    },
    collapsedContent() {
      let text = this.qaq.intro.substring(0, 78)
      if (this.qaq.images.length) {
        text += '[图片]'
      }
      return `${text}...`
    },
    answerPage() {
      return this.$route.name === 'answer-show'
    },
    answer() {
      return this.$store.state.question.answers.list[0]
    },
    isGuest() {
      return !this.$store.state.login
    },
    isMyAnswer() {
      if (this.isGuest || !this.answerPage) {
        return false
      }
      return this.answer.user.id === this.$store.state.user.id
    },
    isMyQAQ() {
      if (this.isGuest || this.answerPage) {
        return false
      }
      return this.qaq.user.id === this.$store.state.user.id
    }
  },
  created() {
    this.collapsed = this.qaq.intro || this.qaq.images.length
  },
  mounted() {
    this.$channel.$on('open-write-answer-dialog', (isEdit = false) => {
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      if (isEdit) {
        this.editMyAnswer()
      } else {
        this.showCreateAnswerForm = true
      }
    })
  },
  methods: {
    toggleFollowQAQ(result) {
      const user = this.$store.state.user
      this.$store.commit('question/QAQ_SOCIAL_TOGGLE', {
        key: 'follow',
        value: result,
        user: {
          id: user.id,
          zone: user.zone,
          nickname: user.nickname,
          avatar: user.avatar
        }
      })
    },
    async editMyAnswer() {
      try {
        await this.$store.dispatch('editor/getData', {
          api: new QuestionApi(this),
          id: this.qaq.my_answer.id
        })
        this.showCreateAnswerForm = true
      } catch (e) {
        this.$toast.error(e)
      }
    },
    loadQAQComment() {
      this.showCommentModal = true
      this.$nextTick(() => {
        this.$channel.$emit(`fire-load-comment-question-${this.id}`)
      })
    },
    collapsedQAQ() {
      this.collapsed = true
      window.scrollTo(0, 0)
    },
    handleCommentChange(count) {
      this.$store.commit('question/COMMENT_CHANGE_COUNT', {
        id: this.id,
        key: 'qaq',
        value: count
      })
    },
    beginWriteAnswer() {
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      this.showCreateAnswerForm = true
    }
  }
}
</script>

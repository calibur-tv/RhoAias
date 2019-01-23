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
    }

    .panel {
      margin-top: 15px;

      .footer-btn {
        margin-left: 3px;
        @include btn-empty($color-text-normal);
      }

      .collapse-btn {
        color: $color-text-normal;
        font-size: 14px;
        margin-left: 5px;
      }

      .others {
        float: right;
        line-height: 24px;
      }
    }
  }
}
</style>

<template>
  <div 
    v-if="qaq" 
    id="question-panel">
    <div class="qaq-question">
      <ul class="qaq-tags">
        <li 
          v-for="tag in qaq.tags" 
          :key="tag.id">
          <a 
            :href="$alias.bangumi(tag.id)" 
            v-text="tag.name" />
        </li>
      </ul>
      <div class="title"><h1 v-text="qaq.title" /></div>
      <div class="content">
        <div 
          v-if="collapsed" 
          class="collapsed-content">
          {{ collapsedContent }}
          <el-button 
            type="text" 
            size="mini" 
            @click="collapsed = false">
            显示全部 <i class="el-icon-arrow-down" />
          </el-button>
        </div>
        <template v-else>
          <div 
            class="text-area" 
            v-html="qaq.content" />
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
          type="question"
        />
        <button 
          class="footer-btn" 
          @click="loadQAQComment">
          <i class="iconfont icon-talk" />
          {{ qaq.comment_count ? qaq.comment_count + '条评论' : '添加评论' }}
        </button>
        <div
          v-if="!collapsed"
          class="others"
        >
          <button 
            class="collapse-btn" 
            @click="collapsedQAQ">
            <i class="el-icon-arrow-up" /><span>收起</span>
          </button>
          <v-popover 
            :report-id="id"
            report-type="question">
            <button class="collapse-btn">
              <i class="el-icon-phone" /><span>举报</span>
            </button>
          </v-popover>
        </div>
      </div>
    </div>
    <v-drawer 
      v-model="showCommentModal" 
      from="bottom" 
      size="100%">
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
          >
            关闭
          </button>
        </comment-main>
      </div>
    </v-drawer>
  </div>
</template>

<script>
import FollowButton from '~/components/common/FollowButton'
import CommentMain from '~/components/comments/CommentMain'
import VPopover from '~/components/common/Popover'

export default {
  name: 'QuestionPanel',
  components: {
    VPopover,
    FollowButton,
    CommentMain
  },
  props: {
    qaq: {
      required: true,
      type: Object
    },
    answer: {
      type: Object,
      default: null
    }
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
    collapsedContent() {
      let text = this.qaq.intro.substring(0, 78)
      if (this.qaq.images.length) {
        text += '[图片]'
      }
      return `${text}...`
    },
    isGuest() {
      return !this.$store.state.login
    }
  },
  created() {
    this.collapsed = this.qaq.intro || this.qaq.images.length
  },
  methods: {
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
      this.qaq.comment_count += count
    }
  }
}
</script>
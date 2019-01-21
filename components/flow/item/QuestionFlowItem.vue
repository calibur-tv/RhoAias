<style lang="scss">
.question-flow-item {
  padding: $container-padding;
  border-bottom: 1px dotted #e4e6eb;

  &:last-child {
    border-bottom: none;
  }

  .qaq-flow-header {
    height: 24px;
    margin-bottom: 8px;

    .avatar {
      float: left;
      margin-right: 10px;
      width: 24px;
      height: 24px;
    }

    .nickname {
      font-size: 13px;
      line-height: 24px;
      color: #1a1a1a;
    }
  }

  .title {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 6px;
    @include twoline(20px);
  }

  .content {
    @extend %clearfix;
    margin-bottom: 10px;

    .poster {
      margin-bottom: 4px;
      border-radius: 4px;
      overflow: hidden;
    }

    .text {
      font-size: 14px;
      color: #1a1a1a;
      @include twoline(19px);
    }
  }

  .footer {
    color: $color-text-normal;

    .vote-button {
      margin-right: 5px;
    }

    .stats {
      margin-right: 5px;
      font-size: 12px;
    }
  }
}
</style>

<template>
  <li class="question-flow-item">
    <header class="qaq-flow-header">
      <a
        :href="$alias.user(item.user.zone)"
        class="avatar"
      >
        <v-img
          :src="item.user.avatar"
          :avatar="true"
          width="24"
          height="24"
        />
      </a>
      <a
        :href="$alias.user(item.user.zone)"
        class="nickname"
        v-text="item.user.nickname"
      />
    </header>
    <a :href="$alias.question(item.id)">
      <h3
        class="title"
        v-text="item.title"
      />
    </a>
    <div class="content">
      <a
        v-if="item.answer"
        :href="$alias.answer(item.answer.id)"
      >
        <div
          v-if="item.answer.poster"
          class="poster"
        >
          <v-img
            :src="item.answer.poster.url"
            width="100%"
            height="140"
          />
        </div>
        <div
          class="text"
          v-text="item.answer.intro"
        />
      </a>
      <a
        v-else
        :href="$alias.question(item.id)"
        class="text"
        v-text="item.intro"
      />
    </div>
    <div class="footer">
      <a
        v-if="item.answer"
        :href="$alias.answer(item.answer.id)"
      >
        <vote-button
          :id="item.answer.id"
          :total="item.answer.vote_count"
          :author-id="item.user.id"
          :score="0"
          :disabled="true"
          type="answer"
        />
      </a>
      <span class="stats">
        <i
          v-if="!item.answer_count"
          class="el-icon-edit"
        />
        {{ item.answer_count ? item.answer_count + '个回答' : '还没有回答' }}
      </span>
      <span class="stats">
        <i
          v-if="!item.comment_count"
          class="iconfont icon-talk"
        />
        {{ item.comment_count ? item.comment_count + '条评论' : '还没有评论' }}
      </span>
      <span
        v-if="item.follow_count"
        class="stats"
      >
        {{ item.follow_count }}人关注
      </span>
    </div>
  </li>
</template>

<script>
import VoteButton from '~/components/common/VoteButton'

export default {
  name: 'QuestionFlowItem',
  components: {
    VoteButton
  },
  props: {
    item: {
      required: true,
      type: Object
    },
    bangumiId: {
      required: true,
      type: [String, Number]
    },
    userZone: {
      required: true,
      type: String
    }
  }
}
</script>

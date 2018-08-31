<style lang="scss">
#user-draft-list {
  .label {
    font-size: 0;

    button {
      display: inline-block;
      width: 50%;
      height: 40px;
      font-size: 13px;
      background-color: $color-gray-light;
      color: $color-text-normal;
    }

    .active {
      background-color: $color-gray-normal;
    }
  }

  .score-draft {
    padding-bottom: 15px;
    padding-top: 20px;
    @extend %clearfix;

    &:not(:last-child) {
      border-bottom: 1px solid #f4f5f7;
    }

    .bangumi {
      float: right;

      img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        margin-left: 10px;
      }
    }

    .content {
      overflow: hidden;
      display: block;

      .title {
        line-height: 18px;
        font-size: 14px;
      }

      .intro {
        display: block;
        font-size: 12px;
        color: $color-text-normal;
        @include twoline(16px);
      }
    }
  }

  .answer-draft {
    padding-bottom: 15px;
    padding-top: 20px;
    &:not(:last-child) {
      border-bottom: 1px solid #f4f5f7;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.6;
      color: #1a1a1a;
      margin-bottom: 6px;

      &:hover {
        color: $color-blue-deep;
      }
    }

    .intro {
      line-height: 25px;
      max-height: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

<template>
  <div id="user-draft-list">
    <div class="label">
      <button
        :class="{ active: active === '漫评' }"
        @click="switchTab('漫评')"
      >发帖</button>
      <button
        :class="{ active: active === '回答' }"
        @click="switchTab('回答')"
      >回帖</button>
    </div>
    <div class="container">
      <template v-if="active === '漫评'">
        <div
          v-for="item in scoreList"
          :key="item.id"
          class="score-draft"
        >
          <a
            :href="$alias.bangumi(item.bangumi.id)"
            class="bangumi"
          >
            <img :src="$resize(item.bangumi.avatar, { width: 100 })">
          </a>
          <a
            :href="$alias.editScore(item.id)"
            class="content"
          >
            <div class="title oneline">
              写给《{{ item.bangumi.name }}》的漫评
            </div>
            <div
              class="intro"
              v-text="item.intro"
            />
          </a>
        </div>
        <more-btn
          :no-more="true"
          :loading="loadingScore"
          :length="1"
        >
          <a :href="$alias.createScore">
            <button>写漫评</button>
          </a>
        </more-btn>
      </template>
      <template v-else-if="active === '回答'">
        <div
          v-for="item in answerList"
          :key="item.id"
          class="answer-draft"
        >
          <a :href="$alias.question(item.question.id)">
            <h5
              class="title"
              v-text="item.question.title"
            />
          </a>
          <a
            :href="$alias.answer(item.id)"
            class="intro"
            v-text="item.intro"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ScoreApi from "~/api/scoreApi";
import QuestionApi from "~/api/questionApi";

export default {
  name: "UserDraftList",
  props: {
    userZone: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      active: "漫评",
      scoreList: [],
      loadingScore: false,
      fetchedScore: false,
      answerList: [],
      loadingAnswer: false,
      fetchedAnswer: false
    };
  },
  mounted() {
    this.$channel.$on("user-tab-switch-draft", () => {
      this.getUserScoreDraft(true);
    });
  },
  methods: {
    switchTab(value) {
      this.active = value;
      if (value === "漫评") {
        this.getUserScoreDraft(true);
      } else if (value === "回答") {
        this.getUserAnswerDraft(true);
      }
    },
    async getUserScoreDraft(init = false) {
      if (init && this.fetchedScore) {
        return;
      }
      if (this.loadingScore) {
        return;
      }
      this.loadingScore = true;
      const api = new ScoreApi(this);
      try {
        this.scoreList = await api.drafts();
        this.fetchedScore = true;
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingScore = false;
      }
    },
    async getUserAnswerDraft(init = false) {
      if (init && this.fetchedAnswer) {
        return;
      }
      if (this.loadingAnswer) {
        return;
      }
      this.loadingAnswer = true;
      const api = new QuestionApi(this);
      try {
        this.answerList = await api.answerDraft();
        this.fetchedAnswer = true;
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingAnswer = false;
      }
    }
  }
};
</script>

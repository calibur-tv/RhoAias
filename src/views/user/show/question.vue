<style lang="scss">
#user-question {
  .label {
    font-size: 0;

    button {
      display: inline-block;
      width: 50%;
      height: 40px;
      font-size: 13px;
      background-color: #fff;
      color: $color-text-normal;
    }

    .active {
      background-color: $color-gray-normal;
    }
  }
}
</style>

<template>
  <div id="user-question">
    <div class="label">
      <button
        :class="{ active: active === 0 }"
        @click="switchTab(0)"
      >提问</button>
      <button
        :class="{ active: active === 1 }"
        @click="switchTab(1)"
      >回答</button>
    </div>
    <question-flow-list
      v-if="active === 0"
      :user-zone="zone"
    />
    <div v-else>
      <ul>
        <question-flow-item
          v-for="item in answerList"
          :key="item.id"
          :item="item"
        />
      </ul>
      <more-btn
        :no-more="noMoreAnswer"
        :loading="loadingAnswer"
        :length="answerList.length"
        :auto="true"
        @fetch="getUserAnswers(false)"
      />
    </div>
  </div>
</template>

<script>
import QuestionFlowList from "~/components/flow/list/QuestionFlowList";
import QuestionFlowItem from "~/components/flow/item/QuestionFlowItem";
import Api from "~/api/flowApi";

export default {
  name: "UserQuestion",
  async asyncData({ store, route, ctx }) {
    await store.dispatch("flow/initData", {
      type: "question",
      sort: "news",
      userZone: route.params.zone,
      ctx
    });
  },
  components: {
    QuestionFlowList,
    QuestionFlowItem
  },
  data() {
    return {
      active: 0,
      answerList: [],
      loadingAnswer: false,
      fetchedAnswer: false,
      noMoreAnswer: false,
      page: 0
    };
  },
  computed: {
    zone() {
      return this.$route.params.zone;
    }
  },
  methods: {
    switchTab(value) {
      this.active = value;
      if (value === 1) {
        this.getUserAnswers(true);
      }
    },
    async getUserAnswers(init = false) {
      if (init && this.fetchedAnswer) {
        return;
      }
      if (this.loadingAnswer) {
        return;
      }
      this.loadingAnswer = true;
      const api = new Api(this);
      try {
        const data = await api.fetch({
          sort: "news",
          type: "answer",
          take: 10,
          page: this.page,
          minId: 0,
          seenIds: "",
          bangumiId: 0,
          userZone: this.zone
        });
        this.fetchedAnswer = true;
        this.answerList = this.answerList.concat(data.list);
        this.noMoreAnswer = data.noMore;
        this.page++;
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingAnswer = false;
      }
    }
  }
};
</script>

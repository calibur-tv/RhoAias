<style lang="scss">
#question-show {
  background-color: #f6f6f6;

  .answers-title {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #f6f6f6;
    background-color: #fff;
    box-shadow: 0 -1px 3px rgba(26, 26, 26, 0.1);

    h2 {
      font-weight: 600;
      font-size: 15px;
    }
  }

  .no-answer {
    padding-top: 40px;
    padding-bottom: 40px;
    text-align: center;
    background-color: #f6f6f6;
    font-size: 14px;
  }
}
</style>

<template>
  <div id="question-show">
    <question-panel/>
    <div
      v-if="qaq.answer_count"
      class="answers"
    >
      <div class="answers-title">
        <h2>
          {{ qaq.answer_count }} 个回答
        </h2>
      </div>
      <answer-flow-list
        :bangumi-id="id"
      />
    </div>
    <div
      v-else
      class="no-answer"
    >
      <button @click="$channel.$emit('open-write-answer-dialog')">开始写第一个回答</button>
    </div>
  </div>
</template>

<script>
import AnswerFlowList from "~/components/flow/list/AnswerFlowList";
import QuestionPanel from "~/components/question/QuestionPanel";

export default {
  name: "QuestionShow",
  async asyncData({ store, route, ctx }) {
    const id = route.params.id;
    await Promise.all([
      store.dispatch("question/getQAQ", {
        id,
        ctx
      }),
      store.dispatch("question/getAnswers", {
        questionId: id,
        ctx
      })
    ]);
  },
  head() {
    return {
      title: `${this.qaq.title} - 提问`
    };
  },
  components: {
    AnswerFlowList,
    QuestionPanel
  },
  computed: {
    id() {
      return +this.$route.params.id;
    },
    qaq() {
      return this.$store.state.question.qaq;
    }
  }
};
</script>

<style lang="scss">
#question-show {
  background-color: #f6f6f6;
  padding-bottom: 10px;

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
}
</style>

<template>
  <div id="question-show">
    <question-panel :qaq="qaq" />
    <div v-if="qaq.answer_count" class="answers">
      <div class="answers-title">
        <h2>{{ qaq.answer_count }} 个回答</h2>
      </div>
      <flow-list
        :id="id"
        func="getQuestionAnswers"
        sort="active"
        type="seenIds"
      >
        <ul slot-scope="{ flow }" class="answer-flow-list">
          <answer-flow-item
            v-for="item in flow"
            :key="item.id"
            :item="item"
            :qaq="qaq"
          />
        </ul>
      </flow-list>
    </div>
    <more-btn v-else :no-more="true" :loading="false" :length="0" />
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import AnswerFlowItem from '~/components/flow/item/AnswerFlowItem'
import QuestionPanel from '~/components/question/QuestionPanel'
import { getQuestionInfo } from '~/api/questionApi'

export default {
  name: 'QuestionShow',
  components: {
    FlowList,
    AnswerFlowItem,
    QuestionPanel
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      qaq: null
    }
  },
  async asyncData({ app, store, params, error }) {
    const { id } = params
    return getQuestionInfo(app, { id })
      .then(qaq => {
        store.commit('social/SET_STATE', {
          type: 'question',
          id: qaq.id,
          data: {
            follow: qaq.followed,
            follow_users: qaq.follow_users
          }
        })
        return { qaq }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  },
  async fetch({ store, params }) {
    await store.dispatch('flow/initData', {
      id: params.id,
      func: 'getQuestionAnswers',
      type: 'seenIds',
      sort: 'active'
    })
  },
  head() {
    return {
      title: this.qaq.title
    }
  }
}
</script>

<style lang="scss">
.answer-show {
  background-color: #f6f6f6;

  .read-all-btn {
    width: 100%;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
    height: 40px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>

<template>
  <div id="answer-show" class="answer-show">
    <question-panel :qaq="qaq" :answer="answer" />
    <div v-if="answer" class="answer">
      <answer-flow-item :item="answer" :qaq="qaq" />
      <nuxt-link :to="$alias.question(qaq.id)">
        <button v-if="qaq.answer_count > 1" class="read-all-btn">
          查看全部 {{ qaq.answer_count }} 个回答
        </button>
      </nuxt-link>
    </div>
    <no-content v-else>
      <nuxt-link :to="$alias.question(qaq.id)">
        <el-button type="primary" round>
          这个答案在审核中或已被删除，查看其它答案
        </el-button>
      </nuxt-link>
    </no-content>
  </div>
</template>

<script>
import QuestionPanel from '~/components/question/QuestionPanel'
import AnswerFlowItem from '~/components/flow/item/AnswerFlowItem'
import { getAnswerInfo } from '~/api/answerApi'

export default {
  name: 'AnswerShow',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  components: {
    QuestionPanel,
    AnswerFlowItem
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      qaq: null,
      answer: null
    }
  },
  asyncData({ app, store, params, error }) {
    const { id } = params
    return getAnswerInfo(app, { id })
      .then(data => {
        const { question } = data
        store.commit('social/SET_STATE', {
          type: 'question',
          id: question.id,
          data: {
            follow: question.followed,
            follow_users: question.follow_users
          }
        })
        return {
          answer: data.answer,
          qaq: question
        }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  },
  head() {
    return {
      title: this.qaq.title
    }
  }
}
</script>

<template>
  <div id="bangumi-question-flow">
    <flow-list
      :id="id"
      func="getBangumiQAQ"
      type="seenIds"
      sort="active"
    >
      <ul slot-scope="{ flow }">
        <question-flow-item
          v-for="item in flow"
          :key="item.id"
          :item="item"
          :bangumi-id="id"
          user-zone=""
        />
      </ul>
    </flow-list>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import QuestionFlowItem from '~/components/flow/item/QuestionFlowItem'

export default {
  name: 'BangumiQuestionFlow',
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      id: params.id,
      func: 'getBangumiQAQ',
      type: 'seenIds',
      sort: 'active'
    })
  },
  components: {
    FlowList,
    QuestionFlowItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  }
}
</script>

<template>
  <div id="bangumi-question-flow">
    <FlowList :id="id" func="getBangumiQAQ" type="seenIds" sort="active">
      <ul slot-scope="{ flow }">
        <QuestionFlowItem
          v-for="item in flow"
          :key="item.id"
          :item="item"
          :bangumi-id="id"
          user-zone=""
        />
      </ul>
    </FlowList>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import QuestionFlowItem from '~/components/flow/item/QuestionFlowItem'

export default {
  name: 'BangumiQuestionFlow',
  components: {
    FlowList,
    QuestionFlowItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      id: params.id,
      func: 'getBangumiQAQ',
      type: 'seenIds',
      sort: 'active'
    })
  }
}
</script>

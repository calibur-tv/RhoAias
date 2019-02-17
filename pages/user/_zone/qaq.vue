<template>
  <div id="user-question">
    <header class="tab-header">
      <el-radio-group
        v-model="active"
        size="mini"
        @change="switchTab"
      >
        <el-radio-button label="回答"/>
        <el-radio-button label="提问"/>
      </el-radio-group>
    </header>
    <flow-list
      v-if="active === '回答'"
      :id="zone"
      func="getUserAnswer"
      type="page"
      sort="news"
    >
      <ul slot-scope="{ flow }">
        <question-flow-item
          v-for="item in flow"
          :key="item.id"
          :item="item"
          :user-zone="zone"
          bangumi-id=""
        />
      </ul>
    </flow-list>
    <flow-list
      v-else
      :id="zone"
      func="getUserQAQ"
      type="page"
      sort="news"
    >
      <ul slot-scope="{ flow }">
        <question-flow-item
          v-for="item in flow"
          :key="item.id"
          :item="item"
          :user-zone="zone"
          bangumi-id=""
        />
      </ul>
    </flow-list>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import QuestionFlowItem from '~/components/flow/item/QuestionFlowItem'

export default {
  name: 'UserFAQ',
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getUserAnswer',
      type: 'page',
      sort: 'news',
      id: params.zone
    })
  },
  components: {
    FlowList,
    QuestionFlowItem
  },
  props: {
    zone: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      active: '回答'
    }
  },
  methods: {
    switchTab(value) {
      this.active = value
      if (value === '回答') {
        this.getUserFAQ('getUserAnswer')
      } else {
        this.getUserFAQ('getUserQAQ')
      }
    },
    getUserFAQ(func) {
      this.$store.dispatch('flow/initData', {
        func,
        type: 'page',
        sort: 'news',
        id: this.zone
      })
    }
  }
}
</script>

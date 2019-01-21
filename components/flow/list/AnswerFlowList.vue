<style lang="scss">
#answer-flow-list {
  overflow: hidden;

  .nomore-wraper {
    background-color: #fff;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>

<template>
  <div 
    v-if="source" 
    id="answer-flow-list">
    <ul>
      <answer-flow-item
        v-for="item in source.list"
        :key="item.id"
        :item="item"
        :bangumi-id="bangumiId"
        :user-zone="userZone"
      />
    </ul>
    <more-btn
      :no-more="source.noMore"
      :length="source.list.length"
      :loading="loading"
      :auto="true"
      @fetch="loadMore"
    />
  </div>
</template>

<script>
import AnswerFlowItem from '../item/AnswerFlowItem'

export default {
  name: 'AnswerFlowList',
  components: {
    AnswerFlowItem
  },
  props: {
    bangumiId: {
      type: Number,
      default: 0
    },
    userZone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    source() {
      return this.$store.state.question.answers
    }
  },
  methods: {
    async loadMore() {
      if (this.loading) {
        return
      }
      this.loading = true
      try {
        await this.$store.dispatch('question/getAnswers', {
          ctx: this,
          userZone: this.userZone,
          questionId: this.bangumiId
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

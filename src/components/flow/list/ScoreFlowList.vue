<template>
  <div
    v-if="source"
    id="score-flow-list"
  >
    <ul>
      <score-flow-item
        v-for="item in source.list"
        :key="item.id"
        :item="item"
        :bangumi-id="bangumiId"
        :user-zone="userZone"
      />
    </ul>
    <more-btn
      :no-more="source.noMore"
      :loading="source.loading"
      :length="source.list.length"
      :auto="true"
      @fetch="loadMore"
    >
      <template v-if="showNoContentTips">
        <a
          v-if="bangumiId"
          :href="`${$alias.createScore}?bid=${bangumiId}`"
        >
          <button>
            {{ '写下《' + bangumiName + '》的第一篇漫评' }}
          </button>
        </a>
        <a
          v-else
          :href="$alias.createScore"
        >
          <button>写漫评</button>
        </a>
      </template>
    </more-btn>
  </div>
</template>

<script>
import flowMixin from './_flowListMixin'
import ScoreFlowItem from '../item/ScoreFlowItem'

export default {
  name: 'ScoreFlowList',
  components: {
    ScoreFlowItem
  },
  mixins: [flowMixin],
  data() {
    return {
      flowType: 'score'
    }
  }
}
</script>

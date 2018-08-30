<template>
  <div
    v-if="source"
    id="score-flow-list"
  >
    <ul>
      <question-flow-item
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
      @fetch="loadMore"
    >
      <template v-if="showNoContentTips">
        <button
          v-if="bangumiId"
          @click="openCreateQAQModal"
        >我有《{{ bangumiName }}》的一些疑问</button>
        <a
          v-else-if="isMe"
          :href="$alias.world('qaq')"
          target="_blank"
        >
          <button>查看问题列表</button>
        </a>
      </template>
    </more-btn>
  </div>
</template>

<script>
import flowMixin from "./_flowListMixin";
import QuestionFlowItem from "../item/QuestionFlowItem";

export default {
  name: "QuestionFlowList",
  components: {
    QuestionFlowItem
  },
  mixins: [flowMixin],
  data() {
    return {
      flowType: "question"
    };
  },
  methods: {
    openCreateQAQModal() {
      console.log("openCreateQAQModal");
    }
  }
};
</script>

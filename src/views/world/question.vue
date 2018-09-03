<style lang="scss">
#question-world {
  .img {
    background-color: #0084ff;
  }
}
</style>

<template>
  <div id="question-world">
    <div class="intro">
      <div class="img">知</div>
      <div class="summary">
        <h2 class="title">问答</h2>
        <div
          v-if="meta"
          class="extra"
        >共 <strong v-text="meta.collection"/> 个提问&nbsp;·&nbsp;收到了 <strong v-text="meta.total"/> 个回答</div>
        <button @click="showTips = !showTips">
          {{ showTips ? '收起' : '查看' }}板块介绍
          <i :class="showTips ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"/>
        </button>
      </div>
    </div>
    <div
      v-if="showTips"
      class="detail"
    >
      <p>
        就是动漫版知乎
      </p>
      <p>
        话题内容仅限二次元，其余讨论的一切都会被删除
      </p>
    </div>
    <div class="control">
      <button @click="openCreateQAQ">提问</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuestionWorld",
  async asyncData({ store, ctx }) {
    await Promise.all([
      store.dispatch("world/initData", {
        type: "question",
        sort: "active",
        ctx
      }),
      store.dispatch("world/getMeta", { type: "question" })
    ]);
  },
  data() {
    return {
      showTips: false
    };
  },
  computed: {
    meta() {
      return this.$store.state.world.question.meta;
    }
  },
  methods: {
    openCreateQAQ() {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      this.$channel.$emit("drawer-open-write-question");
    }
  }
};
</script>

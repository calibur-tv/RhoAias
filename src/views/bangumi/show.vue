<style lang="scss">
#bangumi-show {
  .bangumi-tabs {
    background-color: #ffffff;
    position: relative;
    height: 40px;
    padding-left: $container-padding;
    padding-right: $container-padding;
    width: 100%;
    font-size: 0;
    @include border-bottom();

    button {
      height: 40px;
      line-height: 40px;
      color: #000;
      font-size: 14px;
      display: inline-block;
      text-align: center;
      width: 14%;

      &.active {
        position: relative;

        &:before {
          content: "";
          position: absolute;
          left: 0;
          bottom: 1px;
          width: 100%;
          height: 2px;
          background: #333;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>

<template>
  <div id="bangumi-show">
    <bangumi-header/>
    <div>
      <div class="bangumi-tabs">
        <button 
          :class="{ 'active': sort === 'post' }" 
          @click="switchTab('post')">帖子</button>
        <button 
          v-if="info.has_video" 
          :class="{ 'active': sort === 'video' }" 
          @click="switchTab('video')">视频</button>
        <button 
          v-if="info.has_cartoon" 
          :class="{ 'active': sort === 'cartoon' }" 
          @click="switchTab('cartoon')">漫画</button>
        <button 
          :class="{ 'active': sort === 'role' }" 
          @click="switchTab('role')">偶像</button>
        <button 
          :class="{ 'active': sort === 'image' }" 
          @click="switchTab('image')">相册</button>
        <button
          :class="{ 'active': sort === 'question' }"
          @click="switchTab('question')">问答</button>
        <button 
          :class="{ 'active': sort === 'score' }" 
          @click="switchTab('score')">漫评</button>
      </div>
      <post-flow-list
        v-if="sort === 'post'"
        :bangumi-id="id"
        :bangumi-name="info.name"
      />
      <bangumi-video-flow
        v-else-if="sort === 'video'"
      />
      <bangumi-cartoon-flow
        v-else-if="sort === 'cartoon'"
      />
      <cartoon-role-flow-list
        v-else-if="sort === 'role'"
        :bangumi-id="id"
        :bangumi-name="info.name"
      />
      <image-flow-list
        v-else-if="sort === 'image'"
        :bangumi-id="id"
        :bangumi-name="info.name"
      />
      <question-flow-list
        v-else-if="sort === 'question'"
        :bangumi-id="id"
        :bangumi-name="info.name"
      />
      <bangumi-score-flow
        v-else-if="sort === 'score'"
      />
    </div>
  </div>
</template>

<script>
import BangumiHeader from "~/components/bangumi/BangumiHeader";
import PostFlowList from "~/components/flow/list/PostFlowList";
import BangumiVideoFlow from "~/components/bangumi/flows/BangumiVideoFlow";
import BangumiCartoonFlow from "~/components/bangumi/flows/BangumiCartoonFlow";
import CartoonRoleFlowList from "~/components/flow/list/CartoonRoleFlowList";
import ImageFlowList from "~/components/flow/list/ImageFlowList";
import BangumiScoreFlow from "~/components/bangumi/flows/BangumiScoreFlow";
import QuestionFlowList from "~/components/flow/list/QuestionFlowList";

export default {
  name: "BangumiShow",
  async asyncData({ route, store, ctx }) {
    const id = route.params.id;
    await Promise.all([
      store.dispatch("bangumi/getBangumi", { ctx, id }),
      store.dispatch("bangumi/getTopPosts", { ctx, id }),
      store.dispatch("flow/initData", {
        type: "post",
        sort: "active",
        bangumiId: id,
        ctx
      })
    ]);
  },
  components: {
    BangumiHeader,
    PostFlowList,
    BangumiVideoFlow,
    BangumiCartoonFlow,
    CartoonRoleFlowList,
    ImageFlowList,
    BangumiScoreFlow,
    QuestionFlowList
  },
  head() {
    if (!this.id) {
      return;
    }
    let keywords = this.info.alias;
    this.tags.forEach(tag => {
      keywords += `,${tag.name}`;
    });
    const name = this.info.name;
    keywords += `${keywords}, ${name}动漫, ${name}动画片, ${name}全集, ${name}在线观看, ${name}吧`;
    const desc = this.info.summary;
    return {
      title: `${name} - 番剧`,
      meta: [
        { hid: "description", name: "description", content: desc },
        { hid: "keywords", name: "keywords", content: keywords }
      ],
      script: [
        {
          hid: "share-data",
          innerHTML: JSON.stringify({
            title: name,
            description: desc,
            imageUrl: this.info.avatar
          }),
          type: "application/json"
        }
      ]
    };
  },
  data() {
    return {
      sort: "post"
    };
  },
  computed: {
    id() {
      return +this.$route.params.id;
    },
    info() {
      return this.$store.state.bangumi.info;
    },
    tags() {
      return this.info.tags;
    }
  },
  methods: {
    switchTab(tab) {
      this.sort = tab;
      this.$nextTick(() => {
        switch (tab) {
          case "post":
            this.$channel.$emit("bangumi-tab-switch-post");
            break;
          case "video":
            this.$channel.$emit("bangumi-tab-switch-video");
            break;
          case "cartoon":
            this.$channel.$emit("bangumi-tab-switch-cartoon");
            break;
          case "role":
            this.$channel.$emit("bangumi-tab-switch-role");
            break;
          case "image":
            this.$channel.$emit("bangumi-tab-switch-image");
            break;
          case "question":
            this.$channel.$emit("bangumi-tab-switch-question");
            break;
          case "score":
            this.$channel.$emit("bangumi-tab-switch-score");
            break;
        }
      });
    }
  }
};
</script>

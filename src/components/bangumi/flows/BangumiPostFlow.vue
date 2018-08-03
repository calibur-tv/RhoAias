<template>
  <div id="bangumi-post-flow">
    <ul>
      <post-flow-item
        v-for="item in postList"
        :key="item.id"
        :item="item"
      />
    </ul>
    <more-btn
      v-if="posts"
      :no-more="posts.noMore"
      :loading="posts.loading"
      :length="postList.length"
      @fetch="getData"
    >
      <button @click="openCreatePostModal">发表《{{ info.name }}》的第一个帖子</button>
    </more-btn>
  </div>
</template>

<script>
import PostFlowItem from "~/components/post/PostFlowItem";

export default {
  name: "VBangumiPostFlow",
  components: {
    PostFlowItem
  },
  computed: {
    info() {
      return this.$store.state.bangumi.info;
    },
    posts() {
      return this.$store.state.flow.post.active;
    },
    topPosts() {
      return this.$store.state.bangumi.topPosts;
    },
    postList() {
      return this.posts ? this.topPosts.concat(this.posts.list) : this.topPosts;
    }
  },
  mounted() {
    if (!this.posts) {
      this.getData();
    }
  },
  methods: {
    async getData() {
      try {
        await this.$store.dispatch("flow/getMeta", {
          type: "post",
          sort: "active",
          ctx: this,
          bangumiId: this.info.id
        });
      } catch (e) {
        this.$toast.error(e);
      }
    },
    openCreatePostModal() {
      if (this.$store.state.login) {
        this.$channel.$emit("drawer-open-write-post");
      } else {
        this.$channel.$emit("sign-in");
      }
    }
  }
};
</script>

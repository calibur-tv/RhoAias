<template>
  <div id="bangumi-image-flow">
    <image-waterfall-flow
      v-if="images"
      :list="images.list"
      :no-more="images.noMore"
      :loading="images.loading"
      @load="getData"
    />
  </div>
</template>

<script>
import ImageWaterfallFlow from "~/components/image/ImageWaterfallFlow";

export default {
  name: "BangumiImageFlow",
  components: {
    ImageWaterfallFlow
  },
  computed: {
    info() {
      return this.$store.state.bangumi.info;
    },
    images() {
      return this.$store.state.flow.image.active;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        await this.$store.dispatch("flow/initData", {
          type: "image",
          sort: "active",
          ctx: this,
          bangumiId: this.info.id
        });
      } catch (e) {
        this.$toast.error(e);
      }
    },
    async getData() {
      try {
        await this.$store.dispatch("flow/getData", {
          type: "image",
          sort: "active",
          ctx: this,
          bangumiId: this.info.id
        });
      } catch (e) {
        this.$toast.error(e);
      }
    }
  }
};
</script>

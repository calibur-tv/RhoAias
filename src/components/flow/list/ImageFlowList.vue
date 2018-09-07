<template>
  <div
    v-if="source"
    id="image-flow-list"
  >
    <div>
      <image-waterfall-flow
        :list="source.list"
        :user-zone="userZone"
        :bangumi-id="bangumiId"
      />
    </div>
    <more-btn
      :no-more="source.noMore"
      :loading="source.loading"
      :length="source.list.length"
      :auto="true"
      @fetch="loadMore"
    >
      <button
        v-if="showNoContentTips"
        @click="openCreateImageModal"
      >{{ userZone ? '上传第一张图片' : '上传《' + bangumiName + '》的第一张图片' }}</button>
    </more-btn>
  </div>
</template>

<script>
import flowMixin from "./_flowListMixin";
import ImageWaterfallFlow from "~/components/image/ImageWaterfallFlow";

export default {
  name: "ImageFlowList",
  components: {
    ImageWaterfallFlow
  },
  mixins: [flowMixin],
  data() {
    return {
      flowType: "image"
    };
  },
  methods: {
    openCreateImageModal() {
      if (this.$store.state.login) {
        this.$channel.$emit("open-create-image-drawer");
      } else {
        this.$channel.$emit("sign-in");
      }
    }
  }
};
</script>

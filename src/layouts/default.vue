<style lang="scss">
#layout-default {
  min-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>

<template>
  <div id="layout-default">
    <v-header/>
    <router-view class="main-view"/>
    <no-ssr>
      <creator-menu/>
    </no-ssr>
    <image-reader/>
    <feedback-drawer/>
    <share-drawer/>
  </div>
</template>

<script>
import vHeader from "~/components/layouts/Header";
import ImageReader from "~/components/common/ImageReader";
import CreatorMenu from "~/components/common/Creator";
import FeedbackDrawer from "~/components/drawers/FeedbackDrawer";
import ShareDrawer from "~/components/drawers/ShareDrawer";

export default {
  components: {
    vHeader,
    ImageReader,
    CreatorMenu,
    FeedbackDrawer,
    ShareDrawer
  }
};
</script>

<style lang="scss">
  #layout-default {
    min-height: 100%;
    display: flex;
    flex-direction: column;

    >.main-view {
      margin-top: $nav-height;
      flex-grow: 1;
    }
  }
</style>

<template>
  <div id="layout-default">
    <v-header></v-header>
    <router-view class="main-view"></router-view>
    <div class="hr"></div>
    <v-footer></v-footer>
    <image-reader></image-reader>
  </div>
</template>

<script>
  import vHeader from '~/components/layouts/Header'
  import vFooter from '~/components/layouts/Footer'
  import ImageReader from '~/components/common/ImageReader'

  export default {
    components: {
      vHeader, vFooter, ImageReader
    }
  }
</script>

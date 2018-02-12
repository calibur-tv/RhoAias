<style lang="scss">
  #layout-default {
    min-height: 100%;
    display: flex;
    flex-direction: column;

    >.main-view {
      flex-grow: 1;
    }
  }
</style>

<template>
  <div id="layout-default">
    <v-header></v-header>
    <div class="hr"></div>
    <router-view class="main-view"></router-view>
    <div class="hr"></div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import vHeader from '~/components/layouts/Header'
  import vFooter from '~/components/layouts/Footer'

  export default {
    components: {
      vHeader, vFooter
    }
  }
</script>

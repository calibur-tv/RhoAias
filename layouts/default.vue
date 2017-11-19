<style lang="scss">
  #layout-default {
    height: 100%;
    display: flex;
    flex-direction: column;

    >.main {
      flex-grow: 1;
    }
  }
</style>

<template>
  <div id="layout-default">
    <v-header></v-header>
    <nuxt></nuxt>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import vHeader from '~/components/layouts/Header.vue'
  import vFooter from '~/components/layouts/Footer.vue'

  export default {
    components: {
      vHeader, vFooter
    }
  }
</script>

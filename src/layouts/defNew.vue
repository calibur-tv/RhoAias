<style lang="scss">
  #layout-def-new {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    >.main-view {
      flex-grow: 1;
    }
  }
</style>

<template>
  <div id="layout-def-new">
    <v-header></v-header>
    <router-view class="main-view"></router-view>
    <v-footer v-show="showFooter"></v-footer>
  </div>
</template>

<script>
  import vHeader from '~/components/layouts/Header'
  import vFooter from '~/components/layouts/Footer'

  export default {
    components: {
      vHeader,
      vFooter
    },
    data () {
      return {
        showFooter: true
      }
    },
    mounted () {
      this.$channel.$on('display-layout-footer', (result) => {
        this.showFooter = result
      })
    }
  }
</script>

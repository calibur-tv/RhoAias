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
  <section id="layout-default">
    <v-header></v-header>
    <router-view class="main"></router-view>
    <v-footer></v-footer>
  </section>
</template>

<script>
  import vHeader from 'component/layouts/Header.vue'
  import vFooter from 'component/layouts/Footer.vue'

  export default {
    name: 'layout-default',
    components: {
      vHeader, vFooter
    },
    props: {

    },
    watch: {

    },
    computed: {

    },
    data () {
      return {

      }
    },
    created () {

    },
    methods: {

    },
    mounted () {

    }
  }
</script>

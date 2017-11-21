<style lang="scss">
  #homepage {

  }
</style>

<template>
  <div id="homepage">
    <p>
      this is home page
    </p>
    <router-link to="/bangumi/news">to bangumi news page</router-link>
  </div>
</template>

<script>
  export default {
    name: 'page-index',
    head: {
      title: '首页'
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

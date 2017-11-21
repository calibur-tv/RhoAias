<style lang="scss" scoped>

</style>

<template>
  <footer id="footer">
    this is footer
  </footer>
</template>

<script>
  export default {
    name: 'v-footer',
    data () {
      return {

      }
    },
    methods: {
      showSignIn () {
        this.$channel.$emit('drawer-open-signIn')
      }
    }
  }
</script>

<template>
  <nuxt />
</template>

<script>
export default {
  name: 'WxAppLayout',
  mounted() {
    this.$store.dispatch('initAuth')
  }
}
</script>

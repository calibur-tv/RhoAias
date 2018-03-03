<style lang="scss" scoped="">

</style>

<template>
  <p>偶像详情页</p>
</template>

<script>
  export default {
    name: 'RoleShow',
    async asyncData ({ store, route, ctx }) {
      await store.dispatch('cartoonRole/getRoleInfo', {
        ctx,
        bangumiId: route.params.bangumiId,
        roleId: route.params.roleid
      })
    },
    components: {

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

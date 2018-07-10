<style lang="scss">
  .search-drawer {
    text-align: left;

    .search-input-wrap {
      margin-bottom: 10px;
    }
  }
</style>

<template>
  <v-drawer
    class="search-drawer"
    v-model="open"
    from="bottom"
    size="100%"
    header-text="搜索"
  >
    <div class="container">
      <v-search></v-search>
      <div class="hr"></div>
      <v-search-history></v-search-history>
    </div>
  </v-drawer>
</template>

<script>
  import vSearch from '~/components/search/Input'
  import vSearchHistory from '~/components/search/History'

  export default {
    name: 'v-search-drawer',
    props: {
      value: {
        required: true,
        type: Boolean
      }
    },
    components: {
      vSearch,
      vSearchHistory
    },
    computed: {

    },
    data () {
      return {
        open: this.value
      }
    },
    methods: {

    },
    mounted () {
      this.$watch('value', (val) => {
        this.open = val
      })
      this.$watch('open', (val) => {
        this.$emit('input', val)
      })
    }
  }
</script>

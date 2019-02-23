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
    v-model="open"
    class="search-drawer"
    from="bottom"
    size="100%"
    header-text="搜索"
  >
    <div class="container">
      <v-search v-model="query" />
      <div class="hr" />
      <v-search-history />
    </div>
  </v-drawer>
</template>

<script>
import vSearch from '~/components/search/Input'
import vSearchHistory from '~/components/search/History'

export default {
  name: 'VSearchDrawer',
  components: {
    vSearch,
    vSearchHistory
  },
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      open: this.value,
      query: ''
    }
  },
  mounted() {
    this.$watch('value', val => {
      this.open = val
    })
    this.$watch('open', val => {
      this.$emit('input', val)
    })
  },
  methods: {}
}
</script>

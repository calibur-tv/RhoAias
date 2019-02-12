<template>
  <div id="role-trending">
    <tab-container
      :headers="tabs"
      :router="true"
    />
    <nuxt-child />
  </div>
</template>

<script>
import TabContainer from '~/components/common/TabContainer'

export default {
  name: 'RoleTrending',
  components: {
    TabContainer
  },
  props: {},
  data() {
    return {}
  },
  computed: {
    tabs() {
      const result = [
        {
          label: '已上市',
          route: 'role-trending-listed'
        },
        {
          label: '融资中',
          route: 'role-trending-newbie'
        },
        {
          label: '交易所',
          route: 'role-trending-hall'
        },
        {
          label: '功能简介',
          route: 'role-trending-intro'
        }
      ]
      if (this.$store.state.login) {
        result.push({
          label: '我的',
          route: 'role-trending-mine'
        })
      }
      return result
    }
  }
}
</script>

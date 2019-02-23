<style lang="scss">
#role-trending-newbie {
  .role-trending-header {
    margin: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    span {
      color: rgba(0, 0, 0, 0.54);
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>

<template>
  <div id="role-trending-newbie">
    <flow-list :sort="current_sort" func="virtualIdolList" type="seenIds">
      <div slot="header" slot-scope="{ source }" class="role-trending-header">
        <span>总共 {{ source.total }} 个公司</span>
        <v-popover :actions="actions">
          <span><i class="el-icon-d-caret" />{{ selectedLabel }}</span>
        </v-popover>
      </div>
      <ul slot-scope="{ flow }">
        <virtual-idol-item
          v-for="item in flow"
          :key="item.id"
          :item="item"
          :sort="sort_selected"
        />
      </ul>
    </flow-list>
  </div>
</template>

<script>
import VirtualIdolItem from '~/components/idol/VirtualIdolItem'
import FlowList from '~/components/flow/FlowList'
import VPopover from '~/components/common/Popover'

export default {
  name: 'RoleTrendingNewbie',
  components: {
    VirtualIdolItem,
    FlowList,
    VPopover
  },
  data() {
    return {
      sort_selected: 'star_count',
      current_sort: 'trending-star_count-0'
    }
  },
  computed: {
    selectedLabel() {
      return this.actions.filter(_ => _.value === this.sort_selected)[0]['name']
    },
    actions() {
      return [
        {
          name: '最多入股',
          value: 'star_count',
          method: this.showStarOrder
        },
        {
          name: '最新注册',
          value: 'newest',
          method: this.showNewsOrder
        }
      ]
    }
  },
  async asyncData({ store }) {
    await store.dispatch('flow/initData', {
      func: 'virtualIdolList',
      type: 'seenIds',
      sort: 'trending-star_count-0'
    })
  },
  head: {
    title: '新创公司'
  },
  methods: {
    initTrending() {
      const sort = `trending-${this.sort_selected}-0`
      this.$store.dispatch('flow/initData', {
        func: 'virtualIdolList',
        type: 'seenIds',
        sort
      })
      this.current_sort = sort
    },
    showStarOrder() {
      this.sort_selected = 'star_count'
      this.initTrending()
    },
    showNewsOrder() {
      this.sort_selected = 'newest'
      this.initTrending()
    }
  }
}
</script>

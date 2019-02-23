<style lang="scss">
#role-trending-listed {
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
  <div id="role-trending-listed">
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
  name: 'RoleTrendingListed',
  components: {
    VirtualIdolItem,
    FlowList,
    VPopover
  },
  data() {
    return {
      sort_selected: 'activity',
      current_sort: 'trending-activity-1'
    }
  },
  computed: {
    selectedLabel() {
      return this.actions.filter(_ => _.value === this.sort_selected)[0]['name']
    },
    actions() {
      return [
        {
          name: '最高市值',
          value: 'market_price',
          method: this.showMarketOrder
        },
        {
          name: '最多投资',
          value: 'fans_count',
          method: this.showFansOrder
        },
        {
          name: '最高股价',
          value: 'stock_price',
          method: this.showStockOrder
        },
        {
          name: '最近活跃',
          value: 'activity',
          method: this.showActivityOrder
        }
      ]
    }
  },
  async asyncData({ store }) {
    await store.dispatch('flow/initData', {
      func: 'virtualIdolList',
      type: 'seenIds',
      sort: 'trending-activity-1'
    })
  },
  head: {
    title: '上市公司'
  },
  methods: {
    initTrending() {
      const sort = `trending-${this.sort_selected}-1`
      this.$store.dispatch('flow/initData', {
        func: 'virtualIdolList',
        type: 'seenIds',
        sort
      })
      this.current_sort = sort
    },
    showMarketOrder() {
      this.sort_selected = 'market_price'
      this.initTrending()
    },
    showFansOrder() {
      this.sort_selected = 'fans_count'
      this.initTrending()
    },
    showStockOrder() {
      this.sort_selected = 'stock_price'
      this.initTrending()
    },
    showActivityOrder() {
      this.sort_selected = 'activity'
      this.initTrending()
    }
  }
}
</script>

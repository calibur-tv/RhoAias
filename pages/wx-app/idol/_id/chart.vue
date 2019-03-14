<template>
  <div id="wx-app-idol-chart">
    <div class="container">
      <IdolStockChart :source="list" :idol-id="$route.params.id" />
    </div>
  </div>
</template>

<script>
import IdolStockChart from '~/components/idol/IdolStockChart'
import { getIdolChart } from '~/api/cartoonRoleApi'

export default {
  name: 'WxAppIdolChart',
  components: {
    IdolStockChart
  },
  data() {
    return {
      list: []
    }
  },
  asyncData({ app, params, error }) {
    return getIdolChart(app, {
      days: 1,
      idol_id: params.id
    })
      .then(list => {
        return {
          list
        }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  }
}
</script>

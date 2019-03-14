<style lang="scss">
#idol-stock-table {
  .table {
    background-color: $color-gray-light;
    width: 100%;
    padding: 5px;
    border-radius: 5px;

    thead {
      margin-bottom: 5px;
      margin-top: 5px;
      display: block;
    }

    tbody {
      margin-bottom: 15px;
      margin-top: 5px;
      display: block;
    }

    tr {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    th,
    td {
      font-size: 12px;
      display: block;
      width: 100%;
      font-weight: normal;
      text-align: center;
    }
  }
}
</style>

<template>
  <div id="idol-stock-table">
    <table class="table">
      <thead>
        <tr>
          <th>当前市值</th>
          <th>每股价格</th>
          <th>持股人数</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ idol.company_state ? `￥${idol.market_price}` : '未上市' }}
          </td>
          <td>￥{{ idol.stock_price }}</td>
          <td>{{ idol.fans_count }}人</td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th>总发行股</th>
          <th>已认购股</th>
          <th>我持有股</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ hasLimited ? idol.max_stock_count : '无上限' }}</td>
          <td>{{ idol.star_count }}</td>
          <td>{{ hasBuyStock ? idol.has_star : '未入股' }}</td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th>产品支出</th>
          <th>产品收入</th>
          <th>公司盈利</th>
        </tr>
      </thead>
      <tbody style="margin-bottom:5px">
        <tr>
          <td>{{ idol.company_state ? idol.total_pay : '-' }}</td>
          <td>{{ idol.company_state ? idol.total_income : '-' }}</td>
          <td>{{ idol.company_state ? productBalance : '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'IdolStockTable',
  props: {
    idol: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasLimited() {
      return this.idol.max_stock_count !== '0.00'
    },
    hasBuyStock() {
      return this.idol.has_star !== '0.00'
    },
    productBalance() {
      const balance = this.idol.total_pay - this.idol.total_income
      const percent = `${parseFloat(
        (balance / this.idol.market_price) * 100
      ).toFixed(2)}%`
      return `￥${parseFloat(balance).toFixed(2)}（${percent}）`
    }
  }
}
</script>

<style lang="scss">
#bangumi-score {
  .bangumi-score-wrap {
    .ve-radar {
      margin: 0 auto;
    }
  }

  .bangumi-score-total {
    display: flex;
    margin-top: $container-padding;
    margin-bottom: 10px;

    .intro {
      flex: 1;
      text-align: center;

      .total {
        font-size: 28px;
        line-height: 56px;
      }

      .rate {
        span {
          font-size: 12px;
          color: $color-text-normal;
        }
      }
    }

    .ladder {
      overflow: hidden;

      .label,
      .percent {
        margin-right: 10px;
        font-size: 13px;
        line-height: 14px;
        color: $color-text-normal;
        vertical-align: middle;
      }

      .score {
        display: inline-block;
        height: 10px;
        background-color: rgb(247, 186, 42);
        margin-right: 5px;
        border-radius: 3px;
        vertical-align: middle;
      }
    }
  }

  .first-write {
    margin-left: -$container-padding;
    margin-right: -$container-padding;

    a {
      display: inline-block;
      margin-top: 15px;
      @include btn-empty(#333);
    }
  }

  .score-list-header {
    margin-top: 30px;

    .sub-title {
      a {
        float: right;
      }
    }
  }
}
</style>

<template>
  <div id="bangumi-score">
    <el-row v-if="bangumiScore" id="bangumi-score-panel">
      <el-col class="bangumi-score-total container">
        <div class="ladder">
          <div
            v-for="(star, index) in bangumiScore.ladder"
            :key="index"
            class="star"
          >
            <span class="label">{{ star.key }}星</span>
            <div
              :style="{ width: `${(100 * star.val) / bangumiScore.count}px` }"
              class="score"
            />
            <span
              class="percent"
              v-text="`${((star.val / bangumiScore.count) * 100).toFixed(1)}%`"
            />
          </div>
        </div>
        <div class="intro">
          <div class="total" v-text="totalScore" />
          <div class="rate">
            <el-rate v-model="totalRate" disabled />
            <span class="count">{{ bangumiScore.count }}人评价</span>
          </div>
        </div>
      </el-col>
      <el-col class="bangumi-score-wrap">
        <bangumi-score-chart :source="bangumiScore.radar" size="300px" />
      </el-col>
    </el-row>
    <flow-list :id="id" func="getBangumiScore" type="seenIds" sort="active">
      <h3
        v-if="source.total"
        slot="header"
        slot-scope="{ source }"
        class="sub-title"
      >
        共 {{ source.total }} 条漫评
      </h3>
      <ul slot-scope="{ flow }">
        <score-flow-item
          v-for="item in flow"
          :key="item.id"
          :item="item"
          :bangumi-id="id"
          user-zone=""
        />
      </ul>
    </flow-list>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import BangumiScoreChart from '~/components/bangumi/charts/BangumiScoreChart'
import { getBangumiScore } from '~/api/bangumiApi'
import ScoreFlowItem from '~/components/flow/item/ScoreFlowItem'

export default {
  name: 'BangumiScore',
  components: {
    FlowList,
    BangumiScoreChart,
    ScoreFlowItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      bangumiScore: null
    }
  },
  computed: {
    totalRate() {
      return this.bangumiScore.total / 20
    },
    totalScore() {
      return this.bangumiScore.total / 10
    }
  },
  async asyncData({ app, params }) {
    const bangumiScore = await getBangumiScore(app, { id: params.id })
    return { bangumiScore }
  },
  async fetch({ store, params }) {
    await store.dispatch('flow/initData', {
      id: params.id,
      func: 'getBangumiScore',
      type: 'seenIds',
      sort: 'active'
    })
  }
}
</script>

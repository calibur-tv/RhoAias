<style lang="scss">
#bangumi-score {
  .bangumi-score-wrap {
    .ve-radar {
      margin: 0 auto;
    }
  }

  .bangumi-score-total {
    margin-top: $container-padding;
    margin-bottom: 10px;

    .intro {
      float: right;
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
    <div
      v-if="bangumiScore"
      class="container"
    >
      <div class="bangumi-score-total">
        <div class="intro">
          <div
            class="total"
            v-text="totalScore"
          />
          <div class="rate">
            <el-rate
              v-model="totalRate"
              disabled
            />
            <span class="count">{{ bangumiScore.count }}人评价</span>
          </div>
        </div>
        <div class="ladder">
          <div
            v-for="(star, index) in bangumiScore.ladder"
            :key="index"
            class="star"
          >
            <span class="label">{{ star.key }}星</span>
            <div
              :style="{ width: `${90 * star.val / bangumiScore.count}px` }"
              class="score"
            />
            <span
              class="percent"
              v-text="`${(star.val / bangumiScore.count * 100).toFixed(1)}%`"
            />
          </div>
        </div>
      </div>
      <div class="bangumi-score-wrap">
        <bangumi-score-chart
          :source="bangumiScore.radar"
          size="280px"
        />
      </div>
    </div>
    <div
      v-if="scores && scores.total"
      class="score-list-header"
    >
      <h3 class="sub-title container">
        共 {{ scores.total }} 条漫评
        <a :href="`${$alias.createScore}?bid=${info.id}`">
          写漫评
        </a>
      </h3>
    </div>
    <score-flow-list
      v-if="info"
      :bangumi-id="info.id"
      :bangumi-name="info.name"
    />
  </div>
</template>

<script>
import BangumiScoreChart from "~/components/bangumi/charts/BangumiScoreChart";
import ScoreFlowList from "~/components/flow/list/ScoreFlowList";
import { Rate } from "element-ui";

export default {
  name: "BangumiScore",
  async asyncData({ store, route, ctx }) {
    const id = route.params.id;
    await Promise.all([
      store.dispatch("bangumi/getBangumiScore", { ctx, id }),
      store.dispatch("flow/initData", {
        type: "score",
        sort: "active",
        bangumiId: id,
        ctx
      })
    ]);
  },
  components: {
    BangumiScoreChart,
    ScoreFlowList,
    "el-rate": Rate
  },
  computed: {
    info() {
      return this.$store.state.bangumi.info;
    },
    bangumiScore() {
      return this.$store.state.bangumi.score;
    },
    totalRate() {
      return this.bangumiScore ? this.bangumiScore.total / 20 : 0;
    },
    totalScore() {
      return this.bangumiScore ? this.bangumiScore.total / 10 : 0;
    },
    scores() {
      return this.$store.state.flow.score.active;
    }
  }
};
</script>

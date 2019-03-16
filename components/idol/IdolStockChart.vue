<style lang="scss">
#idol-stock-chart {
  position: relative;

  .control {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 50px;
    margin-top: -25px;

    button {
      flex-grow: 1;
      text-align: center;
      color: $color-text-normal;
      background-color: $color-background-container;
      height: 25px;

      &.active {
        color: $color-text-normal;
        background-color: transparent;
      }
    }
  }

  .shim {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
}
</style>

<template>
  <div id="idol-stock-chart">
    <canvas id="chart-node" />
    <div v-show="!list[index].length" class="shim">
      暂无数据
    </div>
    <div class="control">
      <button :class="{ active: index === 0 }" @click="switchChart(0)">
        24 小时
      </button>
      <button :class="{ active: index === 1 }" @click="switchChart(1)">
        近 7 天
      </button>
      <button :class="{ active: index === 2 }" @click="switchChart(2)">
        近 30 天
      </button>
    </div>
  </div>
</template>

<script>
import F2 from '@antv/f2'
import { getIdolChart } from '~/api/cartoonRoleApi'

export default {
  name: 'IdolStockChart',
  props: {
    source: {
      type: Array,
      required: true
    },
    idolId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      chart: null,
      index: 0,
      list: [this.source, [], []]
    }
  },
  mounted() {
    this.initF2Animation()
    this.drawChart(this.list[this.index])
    this.getIdolChartData(7, 1)
    this.getIdolChartData(30, 2)
  },
  methods: {
    initF2Animation() {
      F2.Animate.registerAnimation('lineUpdate', function(
        updateShape,
        animateCfg
      ) {
        const cacheShape = updateShape.get('cacheShape') // 该动画 shape 的前一个状态
        const cacheAttrs = cacheShape.attrs // 上一个 shape 属性
        const geomType = cacheShape.geomType // 图形类型

        const oldPoints = cacheAttrs.points // 上一个状态的关键点
        const newPoints = updateShape.attr('points') // 当前 shape 的关键点

        const oldLength = oldPoints.length
        const newLength = newPoints.length
        let deltaLength =
          geomType === 'area'
            ? (oldLength - newLength) / 2
            : oldLength - newLength

        if (deltaLength > 0) {
          const firstPoint = newPoints[0]
          const lastPoint = newPoints[newPoints.length - 1]

          for (let i = 0; i < deltaLength; i++) {
            newPoints.splice(0, 0, firstPoint)
          }

          if (geomType === 'area') {
            for (let j = 0; j < deltaLength; j++) {
              newPoints.push(lastPoint)
            }
          }
        } else {
          deltaLength = Math.abs(deltaLength)
          const firstPoint1 = oldPoints[0]
          const lastPoint1 = oldPoints[oldPoints.length - 1]

          for (let k = 0; k < deltaLength; k++) {
            oldPoints.splice(0, 0, firstPoint1)
          }

          if (geomType === 'area') {
            for (let p = 0; p < deltaLength; p++) {
              oldPoints.push(lastPoint1)
            }
          }

          cacheAttrs.points = oldPoints
        }
        updateShape.attr(cacheAttrs)
        updateShape.animate().to({
          attrs: {
            points: newPoints
          },
          duration: 800,
          easing: animateCfg.easing
        })
      })
    },
    getIdolChartData(days, index) {
      getIdolChart(this, {
        days,
        idol_id: this.idolId
      })
        .then(data => {
          this.list[index] = data
        })
        .catch(() => {})
    },
    switchChart(index) {
      if (!this.chart) {
        return
      }
      this.index = index
      this.chart.changeData(this.list[index])
    },
    drawChart(resource) {
      const data = resource.map(_ => {
        return {
          time: +_.time * 1000,
          value: parseFloat(_.value).toFixed(2)
        }
      })
      const chart = new F2.Chart({
        id: 'chart-node',
        pixelRatio: window.devicePixelRatio,
        padding: ['auto', 0, 'auto', 40]
      })
      this.chart = chart
      chart.source(data, {
        time: {
          type: 'timeCat',
          tickCount: 5,
          range: [0, 1],
          mask: 'HH:mm'
        },
        value: {
          type: 'linear',
          alias: '市值',
          tickCount: 5
        }
      })
      chart.tooltip({
        showCrosshairs: true
      })
      chart.axis('time', {
        label: function label(text, index, total) {
          const cfg = {
            textAlign: 'center'
          }
          // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
          if (index === 0) {
            cfg.textAlign = 'start'
          }
          if (index > 0 && index === total - 1) {
            cfg.textAlign = 'end'
          }
          return cfg
        }
      })

      chart
        .line({
          sortable: false
        })
        .position('time*value')
        .shape('smooth')
        .animate({
          update: {
            animation: 'lineUpdate'
          }
        })
      chart
        .area({
          sortable: false
        })
        .position('time*value')
        .shape('smooth')
        .animate({
          update: {
            animation: 'lineUpdate'
          }
        })
      chart.render()
    }
  }
}
</script>

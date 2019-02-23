<template>
  <span class="user-sex">
    <i v-if="secret" class="iconfont icon-simi" style="color: limegreen" />
    <i
      v-else-if="convertSex === '未知'"
      class="iconfont icon-unknown"
      style="color: gold"
    />
    <i
      v-else-if="convertSex === '男'"
      class="iconfont icon-nan"
      style="color: deepskyblue"
    />
    <i
      v-else-if="convertSex === '女'"
      class="iconfont icon-nv"
      style="color: hotpink"
    />
    <i
      v-else-if="convertSex === '伪娘'"
      class="iconfont icon-tijianxingbiefenxi"
      style="color: mediumpurple"
    />
    <i
      v-else-if="convertSex === '药娘'"
      class="iconfont icon-xingbie"
      style="color: #ff4d51;"
    />
    <i
      v-else-if="convertSex === '扶她'"
      class="iconfont icon-intersex"
      style="color: silver"
    />
  </span>
</template>

<script>
export default {
  name: 'UserSex',
  props: {
    sex: {
      type: [String, Number],
      required: true
    },
    secret: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    convertSex() {
      if (typeof this.sex === 'string') {
        return this.sex
      }
      let $res = ''
      switch (this.sex) {
        case 0:
          $res = '未知'
          break
        case 1:
          $res = '男'
          break
        case 2:
          $res = '女'
          break
        case 3:
          $res = '伪娘'
          break
        case 4:
          $res = '药娘'
          break
        case 5:
          $res = '扶她'
          break
        default:
          $res = '未知'
      }
      return $res
    }
  }
}
</script>

<style lang="scss">
#score-content {
  .score-header {
    margin-top: 15px;

    .title {
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 10px;
      margin-top: 0;
      font-weight: normal;
      @extend %breakWord;
    }

    .total {
      float: right;
      font-weight: bold;
      font-size: 23px;
      letter-spacing: 0;
      margin-left: 10px;
      color: #ff9900;
    }

    .star-row {
      font-size: 0;
      margin-bottom: $container-padding;

      .star-item {
        display: inline-block;
        width: 50%;
        height: 36px;
        margin-bottom: 10px;

        .label {
          font-size: 12px;
          margin-bottom: 3px;
          color: $color-text-normal;
        }
      }
    }
  }

  .score-body {
    margin-bottom: 30px;
    font-size: 16px;
    color: #222;
    line-height: 30px;
    @extend %breakWord;
  }
}
</style>

<template>
  <div id="score-content">
    <v-img
      v-if="info.banner"
      :src="info.banner.url"
      :img-width="info.banner.width"
      :img-height="info.banner.height"
      :lazy="false"
    />
    <div class="score-header container">
      <h1 class="title" v-text="info.title" />
      <FlowHeaderUser :user="info.user" :time="info.created_at">
        <div class="total">
          {{ info.total }}分
        </div>
      </FlowHeaderUser>
      <div class="star-row">
        <div v-for="(item, index) in columns" :key="index" class="star-item">
          <div
            class="label"
            v-text="`${labelMap[item]}：${info[item] * 2}分`"
          />
          <el-rate v-model="info[item]" disabled allow-half />
        </div>
      </div>
    </div>
    <div class="score-body">
      <JsonContent :content="info.content" />
    </div>
  </div>
</template>

<script>
import JsonContent from '~/components/jsonEditor/JsonContent'
import FlowHeaderUser from '~/components/layouts/FlowHeaderUser'
import { Rate } from 'element-ui'

export default {
  name: 'ScoreContent',
  components: {
    JsonContent,
    FlowHeaderUser,
    'el-rate': Rate
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    const labelMap = {
      lol: '笑点',
      cry: '泪点',
      fight: '燃点',
      moe: '萌点',
      sound: '音乐',
      vision: '画面',
      story: '情节',
      role: '人设',
      express: '内涵',
      style: '美感'
    }
    return {
      labelMap,
      columns: Object.keys(labelMap)
    }
  }
}
</script>

<style lang="scss">
#app-handbook {
  font-size: 12px;
  line-height: 20px;

  h4 {
    height: 48px;
    line-height: 48px;
    font-weight: 500;
    font-size: 13px;
    padding-left: 15px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 16px;
      width: 5px;
      height: 16px;
      background-color: $color-pink-normal;
      border-radius: 2px;
    }
  }

  h5 {
    margin-bottom: 5px;
  }

  p {
    text-indent: 2em;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 5px;
  }

  strong {
    color: $color-pink-normal;
    font-weight: bold;
  }

  ul {
    margin-left: 2em;
    margin-bottom: 5px;
  }

  li {
    list-style-type: disc;
    font-size: 12px;
  }
}
</style>

<template>
  <div id="app-handbook" class="container">
    <no-ssr>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="1">
          <h4 slot="title">团子与光玉</h4>
          <h5>什么是团子：</h5>
          <p>团子是 calibur.tv 的一个虚拟币系统，与人民币的汇率保持 1 比 1 恒定，暂不支持氪金获得</p>
          <h5>如何获得团子：</h5>
          <ul>
            <li>新注册用户送团子 x 1</li>
            <li>每天签到可获取团子 x 1</li>
            <li>邀请别人注册可获取团子（邀请者 x 5，被邀请者 x 2）</li>
            <li>每天在社区活跃会自动送团子 x 1</li>
          </ul>
          <h5>团子有什么用：</h5>
          <ul>
            <li>可以在股市购买偶像的股票，然后持有偶像的股份</li>
            <li>可以在社区投食给别人，团子就会变成光玉赠送给作者</li>
          </ul>
          <h5>什么是光玉：</h5>
          <p>光玉是 calibur.tv 的另一种虚拟币</p>
          <h5>如何获得光玉：</h5>
          <ul>
            <li>在社区发表原创内容，获得他人的投食 x 1</li>
            <li>在社区发表原创内容，被股市的偶像采购，获得的光玉数由采购价格决定</li>
          </ul>
          <h5>光玉有什么用：</h5>
          <p>目前光玉不能交易给其他人，也不能自己去消费，但它在未来会有更重要的作用</p>
        </el-collapse-item>
      </el-collapse>
    </no-ssr>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from 'element-ui'

export default {
  name: 'AppHandbook',
  layout: 'empty',
  components: {
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem
  },
  head: {
    title: '帮助手册'
  },
  data() {
    return {
      activeName: this.$route.query.index || ''
    }
  }
}
</script>

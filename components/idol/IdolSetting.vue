<style lang="scss"></style>

<template>
  <div id="idol-setting">
    <template v-if="isBoss">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="0">
          <p slot="title" class="title">
            信息修改
          </p>
          <ChangeIdolProfile :idol="idol" />
        </el-collapse-item>
        <el-collapse-item name="1">
          <p slot="title" class="title">
            股权变更
          </p>
          <CreateChangeMarketPriceDraft :idol="idol" />
        </el-collapse-item>
      </el-collapse>
    </template>
    <p v-else>
      <br>
      <br>
      只有大股东可以做数据变更
      <br>
      <br>
      <br>
    </p>
  </div>
</template>

<script>
import ChangeIdolProfile from '~/components/idol/ChangeIdolProfile'
import CreateChangeMarketPriceDraft from '~/components/idol/CreateChangeMarketPriceDraft'
import { Collapse, CollapseItem } from 'element-ui'

export default {
  name: 'IdolSetting',
  components: {
    ChangeIdolProfile,
    CreateChangeMarketPriceDraft,
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem
  },
  props: {
    idol: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName: ''
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    isBoss() {
      return this.idol.boss ? this.idol.boss.id === this.currentUserId : false
    }
  }
}
</script>

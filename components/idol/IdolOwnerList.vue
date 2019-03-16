<style lang="scss">
#idol-owner-list {
  .header {
    margin-top: 15px;
    text-align: center;
  }

  .owner-list {
    padding-top: $container-padding;

    li {
      margin-bottom: 10px;
      font-size: 13px;
      position: relative;
      padding-bottom: 10px;

      &:not(:last-child) {
        @include border-bottom(0);
      }
    }

    .user {
      overflow: hidden;
      height: 30px;

      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 5px;
        float: left;
      }

      .nickname {
        overflow: hidden;
        line-height: 30px;
        font-size: 12px;
        color: $color-text-normal;
      }
    }

    .score {
      float: right;
      font-size: 12px;
      margin-top: 8px;
      color: $color-text-normal;
    }
  }
}
</style>

<template>
  <div id="idol-owner-list">
    <div class="header">
      <el-radio-group v-model="active" size="mini" @change="handleTabSwitch">
        <el-radio-button label="按持股数量" />
        <el-radio-button label="按入股时间" />
      </el-radio-group>
    </div>
    <FlowList
      v-show="active === '按持股数量'"
      :id="id"
      func="virtualIdolOwners"
      type="seenIds"
      sort="biggest"
    >
      <ul slot-scope="{ flow }" class="owner-list">
        <li v-for="item in flow" :key="item.id">
          <nuxt-link :to="$alias.user(item.zone)">
            <span
              class="score"
            >持有{{ item.score }}股，占比{{
              computedPercent(item.score)
            }}</span>
            <div class="user">
              <img :src="$resize(item.avatar, { width: 60 })" class="avatar">
              <p class="nickname oneline" v-text="item.nickname" />
            </div>
          </nuxt-link>
        </li>
      </ul>
    </FlowList>
    <FlowList
      v-show="active === '按入股时间'"
      :id="id"
      func="virtualIdolOwners"
      type="lastId"
      sort="newest"
    >
      <ul slot-scope="{ flow }" class="owner-list">
        <li v-for="item in flow" :key="item.id">
          <nuxt-link :to="$alias.user(item.zone)">
            <v-time v-model="item.score" class="score" />
            <div class="user">
              <img :src="$resize(item.avatar, { width: 60 })" class="avatar">
              <p class="nickname oneline" v-text="item.nickname" />
            </div>
          </nuxt-link>
        </li>
      </ul>
    </FlowList>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'

export default {
  name: 'IdolOwnerList',
  components: {
    FlowList
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    star: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      active: '按持股数量'
    }
  },
  methods: {
    handleTabSwitch(label) {
      if (label === '按持股数量') {
        this.getBigOwner()
      } else {
        this.getNewOwner()
      }
    },
    computedPercent(score) {
      return `${parseFloat((score / this.star) * 100).toFixed(2)}%`
    },
    getBigOwner() {
      this.$store.dispatch('flow/initData', {
        func: 'virtualIdolOwners',
        type: 'seenIds',
        sort: 'biggest',
        id: this.id
      })
    },
    getNewOwner() {
      this.$store.dispatch('flow/initData', {
        func: 'virtualIdolOwners',
        type: 'lastId',
        sort: 'newest',
        id: this.id
      })
    }
  }
}
</script>

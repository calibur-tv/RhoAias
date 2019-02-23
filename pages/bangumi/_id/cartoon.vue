<style lang="scss">
#bangumi-cartoon-flow {
  background-color: #fff;
  padding-top: 15px;

  .sub-title {
    margin-left: $container-padding;
    margin-right: $container-padding;

    button {
      float: right;
      font-size: 12px;
      color: $color-text-normal;
    }
  }

  .cartoon-list {
    width: 302px;
    margin: 0 auto;
  }

  .cartoon {
    width: 145px;
    height: 250px;
    float: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    margin: 3px 3px 10px;
    overflow: hidden;

    .poster-wrap {
      position: relative;
      display: block;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        opacity: 0.3;
        background-color: transparent;
        background-image: linear-gradient(
          transparent,
          rgba(0, 0, 0, 0.1) 20%,
          rgba(0, 0, 0, 0.2) 35%,
          rgba(0, 0, 0, 0.6) 65%,
          rgba(0, 0, 0, 0.9)
        );
      }

      img {
        width: 100%;
        height: 210px;
        display: block;
      }

      .info {
        position: absolute;
        left: 7px;
        bottom: 4px;
        z-index: 1;
        color: #fff;
        line-height: 20px;

        i {
          font-size: 20px;
          vertical-align: middle;
        }

        .image-count {
          margin-left: 5px;
          font-size: 14px;
          vertical-align: middle;
        }
      }
    }

    .intro {
      height: 55px;
      padding: 5px 15px;
      background-color: #fff;

      .name,
      .social {
        height: 20px;
        font-size: 12px;
        line-height: 20px;
      }

      .name {
        margin-top: 3px;
      }

      .social {
        color: $color-text-light;
        margin-top: 2px;

        span {
          margin-right: 10px;
        }

        .done {
          color: $color-pink-deep;
        }
      }
    }

    .about {
      height: 51px;
      padding: 10px 15px;
      border-top: 1px solid #f2f2f2;

      .user-avatar {
        display: block;
        margin-right: 10px;
        float: left;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #e5e9ef;
      }

      .main-name {
        line-height: 30px;
        font-size: 12px;
        word-wrap: break-word;
        color: $color-text-normal;
      }
    }
  }
}
</style>

<template>
  <div id="bangumi-cartoon-flow">
    <template v-if="source.list.length">
      <h3 class="sub-title">
        <span>共 {{ source.total }} 集</span>
        <button @click="handleSortSwitch()">
          <i class="el-icon-d-caret" />
          排序
        </button>
      </h3>
      <flow-list :id="id" :sort="sort" func="getBangumiCartoon" type="page">
        <ul slot-scope="{ flow }" class="cartoon-list clearfix">
          <cartoon-flow-item
            v-for="item in flow"
            :key="item.id"
            :bangumi-id="id"
            :item="item"
          />
        </ul>
      </flow-list>
    </template>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import CartoonFlowItem from '~/components/flow/item/CartoonFlowItem'
export default {
  name: 'BangumiCartoonFlow',
  components: {
    FlowList,
    CartoonFlowItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      // selectedSort: 'asc',
      sort: 'asc'
    }
  },
  computed: {
    source() {
      return this.$store.getters['flow/getFlow'](
        'getBangumiCartoon',
        this.sort,
        this.id
      )
    }
    // order() {
    //   return [
    //     {
    //       label: '由大到小排序',
    //       value: 'desc'
    //     },
    //     {
    //       label: '由小到大排序',
    //       value: 'asc'
    //     }
    //   ]
    // }
  },
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      id: params.id,
      func: 'getBangumiCartoon',
      type: 'page',
      sort: 'asc'
    })
  },
  methods: {
    handleSortSwitch() {
      const item = this.sort === 'asc' ? 'desc' : 'asc'
      this.$store.dispatch('flow/initData', {
        id: this.id,
        func: 'getBangumiCartoon',
        type: 'page',
        sort: item
      })
      this.sort = item
    }
  }
}
</script>

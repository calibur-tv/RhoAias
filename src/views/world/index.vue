<style lang="scss">
#the-world {
  .flow-intro {
    margin-top: $container-padding;
    margin-bottom: $container-padding;

    .intro {
      @extend %clearfix;
      margin-bottom: $container-padding;

      .img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        margin-right: 10px;
        float: left;
        color: #fff;
        text-align: center;
        cursor: default;
        font-weight: bold;
        user-select: none;
        font-size: 36px;
        line-height: 80px;
      }

      .summary {
        overflow: hidden;

        .title {
          margin-top: 8px;
          font-size: 17px;
        }

        .extra {
          margin-top: 8px;
          font-size: 14px;
          color: $color-text-normal;
        }

        button {
          font-size: 13px;
          margin-top: 8px;
        }
      }
    }

    .detail {
      padding: 8px;
      padding-bottom: 3px;
      background-color: $color-gray-normal;
      color: $color-text-normal;
      margin-bottom: 10px;

      p {
        margin-bottom: 5px;
        font-size: 13px;
        line-height: 18px;
      }

      a {
        color: $color-blue-normal;
        transition: 0.4s;

        &:hover {
          color: $color-blue-deep;
        }
      }
    }

    .control {
      button {
        width: 100%;
        height: 40px;
        border: 1px solid #c8c8c8;
        color: #333;
        border-radius: 4px;
        padding: 6px 0;
        font-size: 16px;
        text-align: center;
      }
    }
  }

  .van-tabs__wrap {
    @include border-bottom();
  }

  .van-tabs--line {
    padding-top: 40px;
  }
}
</style>

<template>
  <div id="the-world">
    <div class="container flow-intro">
      <router-view/>
    </div>
    <div class="hr"/>
    <van-tabs v-model="active">
      <van-tab
        v-for="(item, index) in options"
        :key="index"
      >
        <router-link
          slot="title"
          :to="{ name: item.value }"
          v-text="item.label"
        />
      </van-tab>
      <post-flow-list v-if="active === 0"/>
      <image-flow-list v-else-if="active === 1"/>
      <score-flow-list v-else-if="active === 2"/>
    </van-tabs>
  </div>
</template>

<script>
import Tab from "vant/lib/tab";
import Tabs from "vant/lib/tabs";
import PostFlowList from "~/components/flow/list/PostFlowList";
import ImageFlowList from "~/components/flow/list/ImageFlowList";
import ScoreFlowList from "~/components/flow/list/ScoreFlowList";

export default {
  name: "TheWorld",
  components: {
    vanTabs: Tabs,
    vanTab: Tab,
    PostFlowList,
    ImageFlowList,
    ScoreFlowList
  },
  data() {
    const options = [
      {
        index: 0,
        label: "帖子",
        value: "world-post"
      },
      {
        index: 1,
        label: "图片",
        value: "world-image"
      },
      {
        index: 2,
        label: "评分",
        value: "world-score"
      }
    ];
    const active = options.filter(_ => _.value === this.$route.name)[0].index;
    return {
      active,
      options
    };
  }
};
</script>

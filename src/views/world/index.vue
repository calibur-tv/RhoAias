<style lang="scss">
#the-world {
  .carousel {
    height: 150px;

    .mint-swipe-item {
      background-color: $color-pink-normal;
    }

    .background {
      display: block;
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .intro {
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: rgba(30, 30, 34, 0.6);
      height: 50px;
      width: 100%;
      padding: 8px 20px 3px;
      color: #fff;

      .title {
        font-size: 14px;
      }

      .desc {
        margin-top: 4px;
        font-size: 12px;
      }
    }
  }

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
    <div
      v-if="loops.length"
      class="carousel"
    >
      <no-ssr>
        <mt-swipe :show-indicators="false">
          <mt-swipe-item
            v-for="(item, index) in loops"
            :key="index"
          >
            <a
              :href="item.link"
              :style="{ backgroundImage: `url(${$resize(item.poster, { width: 600, height: 300 })})` }"
              class="background"
            >
              <div class="intro">
                <p
                  class="title"
                  v-text="item.title"
                />
                <p
                  class="desc oneline"
                  v-text="item.desc"
                />
              </div>
            </a>
          </mt-swipe-item>
        </mt-swipe>
      </no-ssr>
    </div>
    <div
      v-else
      class="container flow-intro"
    >
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
      <question-flow-list v-else-if="active === 3"/>
    </van-tabs>
  </div>
</template>

<script>
import Tab from "vant/lib/tab";
import Tabs from "vant/lib/tabs";
import PostFlowList from "~/components/flow/list/PostFlowList";
import ImageFlowList from "~/components/flow/list/ImageFlowList";
import ScoreFlowList from "~/components/flow/list/ScoreFlowList";
import QuestionFlowList from "~/components/flow/list/QuestionFlowList";
import { Swipe, SwipeItem } from "mint-ui";

export default {
  name: "TheWorld",
  async asyncData({ store }) {
    await store.dispatch("cm/getCmLoop");
  },
  components: {
    "mt-swipe": Swipe,
    "mt-swipe-item": SwipeItem,
    vanTabs: Tabs,
    vanTab: Tab,
    PostFlowList,
    ImageFlowList,
    ScoreFlowList,
    QuestionFlowList
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
      },
      {
        index: 3,
        label: "问答",
        value: "world-question"
      }
    ];
    const active = options.filter(_ => _.value === this.$route.name)[0].index;
    return {
      active,
      options
    };
  },
  computed: {
    loops() {
      return this.$store.state.cm.loops;
    }
  }
};
</script>

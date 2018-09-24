<style lang="scss">
#bangumi-news {
  .van-tab {
    width: 12.5%;
  }

  ul {
    min-height: 100vh;
  }

  $bangumi-height: 60px;
  li {
    margin-bottom: 10px;
    height: $bangumi-height;

    .face {
      width: $bangumi-height;
      height: $bangumi-height;
      flex-shrink: 0;
      margin-right: 10px;
      display: block;
      border-radius: 5px;
      float: left;
    }

    .content {
      overflow: hidden;
      height: $bangumi-height;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-self: center;

      .name {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        height: 32px;
        @include twoline(16px);
      }

      .body {
        color: $color-text-light;
        font-size: 13px;
        line-height: 18px;
        text-align: right;

        .part {
          border-radius: 9px;
          color: $color-white;
          text-align: center;
          padding: 0 10px;
          height: 18px;
          min-width: 36px;
          margin-left: 5px;
          font-size: 12px;
          display: inline-block;

          &.new {
            background-color: $color-pink-normal;
          }

          &.old {
            background-color: $color-dark-light;
          }
        }
      }
    }
  }

  .nomore {
    background-color: transparent;
  }
}
</style>

<template>
  <div id="bangumi-news">
    <div class="tabs">
      <a 
        :href="$alias.bangumiNews" 
        class="active">新番放送</a>
      <a :href="$alias.bangumiTimeline">时间轴</a>
      <a :href="$alias.bangumiTag()">分类索引</a>
    </div>
    <van-tabs 
      v-model="active" 
      swipeable>
      <van-tab
        v-for="(item, index) in showtime"
        :key="index"
        :title="item"
      >
        <ul class="container">
          <li 
            v-for="item in list" 
            :key="item.id">
            <a :href="$alias.bangumi(item.id)">
              <img
                :title="item.name"
                :alt="item.name"
                :src="$resize(item.avatar, { width: 120 })"
                class="face"
              >
            </a>
            <div class="content">
              <a
                :href="$alias.bangumi(item.id)"
                class="name"
                v-text="item.name"
              />
              <div class="body">
                <a 
                  v-if="item.released_video_id" 
                  :href="$alias.video(item.released_video_id)">
                  更新至
                  <span 
                    :class="[item.update ? 'new' : 'old']" 
                    class="part">
                    {{ item.end ? '已完结' : `${item.released_part}话` }}
                  </span>
                </a>
                <strong v-else>
                  更新至
                  <span 
                    :class="[item.update ? 'new' : 'old']" 
                    class="part">
                    {{ item.end ? '已完结' : `${item.released_part}话` }}
                  </span>
                </strong>
              </div>
            </div>
          </li>
          <more-btn
            v-if="!list.length"
            :no-more="true"
            :loading="false"
            :length="0"
          >
            <button @click="openFeedbackForResource">求资源</button>
          </more-btn>
        </ul>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Tab from "vant/lib/tab";
import Tabs from "vant/lib/tabs";

export default {
  name: "BangumiNews",
  async asyncData({ store, ctx }) {
    await store.dispatch("bangumi/getReleased", ctx);
  },
  components: {
    vanTabs: Tabs,
    vanTab: Tab
  },
  data() {
    return {
      showtime: ["最新", "一", "二", "三", "四", "五", "六", "日"],
      active: new Date().getDay() || 7
    };
  },
  computed: {
    list() {
      return this.$store.state.bangumi.released[this.active];
    }
  },
  methods: {
    openFeedbackForResource() {
      this.$channel.$emit("open-feedback", {
        type: 5,
        desc: "我想看新番：{?}",
        placeholder: "请填写番剧名称"
      });
    }
  }
};
</script>

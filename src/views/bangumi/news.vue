<style lang="scss">
  #bangumi-news {
    .van-tabs--line .van-tabs__wrap {
      height: 40px;
      padding-left: 10px;
      padding-right: 10px;
    }

    .van-tabs__line {
      height: 1px;

      &:after {
        content: '';
        position: absolute;
        margin-left: -3px;
        left: 50%;
        bottom: 1px;
        width: 0;
        height: 0;
        border: 3px solid #f44;
        border-top-width: 0;
        border-left-color: transparent;
        border-right-color: transparent;
      }
    }

    .van-tabs__wrap--scrollable .van-tabs__nav {
      width: 100%;
      height: 40px;
      display: block;

      .van-tab {
        width: 12.5%;
        float: left;
        height: 40px;
        line-height: 40px;
        cursor: default;

        &.van-tab--active {
          color: #f44;
        }

        &:active {
          background-color: transparent !important;
        }
      }
    }

    .van-tabs--line {
      padding-top: 50px;
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
          @include twoline(16px)
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
      <a :href="$alias.bangumiNews" class="active">新番放送</a>
      <a :href="$alias.bangumiTimeline">时间轴</a>
      <a :href="$alias.bangumiTag()">分类索引</a>
    </div>
    <van-tabs v-model="active" swipeable>
      <van-tab
        v-for="(item, index) in showtime"
        :key="index"
        :title="item"
      >
        <ul class="container">
          <li v-for="item in list" :key="item.id">
            <a :href="$alias.bangumi(item.id)">
              <img
                class="face"
                :title="item.name"
                :alt="item.name"
                :src="$resize(item.avatar, { width: 120 })"
              />
            </a>
            <div class="content">
              <a
                :href="$alias.bangumi(item.id)"
                class="name"
                v-text="item.name"
              ></a>
              <div class="body">
                <a v-if="item.released_video_id" :href="$alias.video(item.released_video_id)">
                  更新至
                  <span class="part" :class="[item.update ? 'new' : 'old']">
                    {{ item.end ? '已完结' : `${item.released_part}话` }}
                  </span>
                </a>
                <strong v-else>
                  更新至
                  <span class="part" :class="[item.update ? 'new' : 'old']">
                    {{ item.end ? '已完结' : `${item.released_part}话` }}
                  </span>
                </strong>
              </div>
            </div>
          </li>
          <more-btn
            :no-more="true"
            :loading="false"
            :length="0"
            v-if="!list.length"
          >
            <button @click="openFeedbackForResource">求资源</button>
          </more-btn>
        </ul>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import Tab from 'vant/lib/tab'
  import Tabs from 'vant/lib/tabs'
  import 'vant/lib/vant-css/tab.css'

  export default {
    name: 'bangumi-news',
    async asyncData ({ store, ctx }) {
      await store.dispatch('bangumi/getReleased', ctx)
    },
    components: {
      vanTabs: Tabs,
      vanTab: Tab
    },
    computed: {
      list () {
        return this.$store.state.bangumi.released[this.active]
      }
    },
    data () {
      return {
        showtime: ['最新', '一', '二', '三', '四', '五', '六', '日'],
        active: new Date().getDay() || 7
      }
    },
    methods: {
      openFeedbackForResource () {
        this.$channel.$emit('open-feedback', {
          type: 5,
          desc: '我想看新番：'
        })
      }
    }
  }
</script>

<style lang="scss">
  #bangumi-news {
    #weekly-btn-group {
      font-size: 0;
      position: relative;
      padding-bottom: 5px;
      @include border-bottom();

      button {
        display: inline-block;
        width: 12.5%;
        font-size: 13px;
        text-align: center;
        height: 40px;
        line-height: 40px;

        &.active {
          color: $color-blue-normal;
        }
      }
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
    <div id="weekly-btn-group" class="container">
      <button
        v-for="(btn, index) in showtime"
        v-text="btn"
        @click="handleWeeklySwitch(index)"
        :class="{ 'active': showWeek === index }"
      ></button>
    </div>
    <ul
      class="container"
      v-for="(list, index) in released"
      v-if="showWeek === index"
    >
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
  </div>
</template>

<script>
  export default {
    name: 'bangumi-news',
    async asyncData ({ store, ctx }) {
      await store.dispatch('bangumi/getReleased', ctx)
    },
    computed: {
      released () {
        return this.$store.state.bangumi.released
      }
    },
    data () {
      return {
        showWeek: new Date().getDay() || 7,
        showtime: ['最新', '一', '二', '三', '四', '五', '六', '日']
      }
    },
    methods: {
      handleWeeklySwitch (index) {
        this.showWeek = index
      },
      openFeedbackForResource () {
        this.$channel.$emit('open-feedback', {
          type: 5,
          desc: '我想看新番：'
        })
      }
    },
    mounted () {
      if (this.$route.query.from === 'search') {
        this.$toast.error('您搜索的资源未收录')
      }
    }
  }
</script>

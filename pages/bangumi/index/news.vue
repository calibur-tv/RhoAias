<style lang="scss">
#bangumi-news {
  .weekly-tabs {
    > header {
      padding: 0 10px 15px;
      border-bottom-width: 0;
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
          min-width: 60px;
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
    <tab-container
      :headers="showtime"
      :def-index="active"
      class="weekly-tabs"
      @change="changeActive"
    >
      <template v-for="(weekly, index) in showtime" :slot="`${index}`">
        <ul :key="index" class="container">
          <li v-for="(item, subIndex) in list" :key="`${subIndex}-${item.id}`">
            <nuxt-link :to="$alias.bangumi(item.id)">
              <img
                :title="item.name"
                :alt="item.name"
                :src="$resize(item.avatar, { width: 120 })"
                class="face"
              />
            </nuxt-link>
            <div class="content">
              <nuxt-link
                :to="$alias.bangumi(item.id)"
                class="name"
                v-text="item.name"
              />
              <div class="body">
                <nuxt-link
                  v-if="item.released_video_id"
                  :to="$alias.video(item.released_video_id)"
                >
                  更新至
                  <span :class="[item.update ? 'new' : 'old']" class="part">
                    {{ item.end ? '已完结' : `${item.released_part}话` }}
                  </span>
                </nuxt-link>
                <strong v-else>
                  更新至
                  <span :class="[item.update ? 'new' : 'old']" class="part">
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
            <button @click="openFeedbackForResource">
              求资源
            </button>
          </more-btn>
        </ul>
      </template>
    </tab-container>
  </div>
</template>

<script>
import { getReleasedBangumis } from '~/api/bangumiApi'
import TabContainer from '~/components/common/TabContainer'

export default {
  name: 'BangumiNews',
  components: {
    TabContainer
  },
  data() {
    return {
      showtime: ['最新', '一', '二', '三', '四', '五', '六', '日'],
      active: new Date().getDay() || 7
    }
  },
  computed: {
    list() {
      return this.released[this.active]
    }
  },
  async asyncData(ctx) {
    const released = await getReleasedBangumis(ctx)
    return { released }
  },
  head: {
    title: '新番放送'
  },
  methods: {
    openFeedbackForResource() {
      this.$channel.$emit('open-feedback', {
        type: 5,
        desc: '我想看新番：{?}',
        placeholder: '请填写番剧名称'
      })
    },
    changeActive(index) {
      this.active = index
    }
  }
}
</script>

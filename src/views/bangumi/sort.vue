<style lang="scss">
  #bangumi-sort {
    $time-size: 0;

    #collections {
      padding-top: 20px;
      padding-bottom: 5px;

      .collection {
        .time {
          position: relative;
          font-weight: 400;
          color: $color-text-light;
          font-size: 16px;
          margin-bottom: 15px;
          padding-left: 12px;

          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 2px;
            height: 14px;
            width: 3px;
            background-color: $color-blue-normal;
            border-radius: 3px;
          }
        }

        $bangumi-height: 60px;
        .bangumi {
          margin-bottom: 10px;
          height: $bangumi-height;

          .face {
            width: $bangumi-height;
            height: $bangumi-height;
            flex-shrink: 0;
            margin-right: 15px;
            display: block;
            border-radius: 5px;
            float: left;
          }

          .content {
            overflow: hidden;

            .name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 8px;
            }

            .body {
              color: $color-text-light;
              font-size: 13px;
              line-height: 18px;
            }
          }
        }
      }
    }

    #bangumi-news {
      #weekly-btn-group {
        font-size: 0;
        position: relative;
        margin-bottom: $container-padding;
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
          margin-right: 15px;
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
  }
</style>

<template>
  <div id="bangumi-sort">
    <div class="tabs">
      <button @click="switchTab('news')" :class="{ 'active': sort === 'news' }">新番放松</button>
      <button @click="switchTab('timeline')" :class="{ 'active': sort === 'timeline' }">时间轴</button>
    </div>
    <div class="container">
      <template v-if="sort === 'timeline'">
        <ul
          id="collections"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="notFetch"
          infinite-scroll-distance="50"
        >
          <ul v-for="col in timeline.data" :key="col.date" class="collection">
            <h3 class="time" v-text="col.date"></h3>
            <li class="bangumi" v-for="item in col.list" :key="item.id">
              <router-link :to="$alias.bangumi(item.id)">
                <v-img
                  class="face"
                  :title="item.name"
                  :alt="item.name"
                  :src="$resize(item.avatar, { width: 120 })">
                </v-img>
                <div class="content">
                  <p class="name" v-text="item.name"></p>
                  <p class="body twoline" v-text="item.summary"></p>
                </div>
              </router-link>
            </li>
          </ul>
        </ul>
        <more-btn
          :no-more="timeline.noMore"
          :loading="loading"
          :auto="true"
        ></more-btn>
      </template>
      <div id="bangumi-news" v-else>
        <div id="weekly-btn-group">
          <button
            v-for="(btn, index) in weeklys"
            v-text="btn"
            @click="handleWeeklySwitch(index)"
            :class="{ 'active': showWeek === `tab-weekly-${index}` }"
          ></button>
        </div>
        <mt-tab-container v-model="showWeek" :swipeable="true">
          <mt-tab-container-item
            v-for="(list, index) in released"
            :id="`tab-weekly-${index}`"
          >
            <ul>
              <li v-for="item in list" :key="item.id">
                <router-link :to="$alias.bangumi(item.id)">
                  <img
                    class="face"
                    :title="item.name"
                    :alt="item.name"
                    :src="$resize(item.avatar, { width: 120 })"
                  />
                </router-link>
                <div class="content">
                  <router-link :to="$alias.bangumi(item.id)" class="name" v-text="item.name"></router-link>
                  <div class="body">
                    <router-link v-if="item.released_video_id" :to="$alias.video(item.released_video_id)">
                      更新至
                      <span class="part" :class="[item.update ? 'new' : 'old']">
                        {{ `${item.released_part}话` }}
                      </span>
                    </router-link>
                    <strong v-else>
                      更新至
                      <span class="part" :class="[item.update ? 'new' : 'old']">
                        {{ `${item.released_part}话` }}
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
              ></more-btn>
            </ul>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page-bangumi-time',
    async asyncData ({ store, route, ctx }) {
      const sort = route.params.sort
      if (['timeline', 'news'].indexOf(sort) === -1) {
        const error = new Error()
        error.code = 404
        throw error
      }
      if (sort === 'timeline') {
        await store.dispatch('bangumi/getTimeline', ctx)
      } else {
        await store.dispatch('bangumi/getReleased', ctx)
      }
    },
    computed: {
      timeline () {
        return this.$store.state.bangumi.timeline
      },
      released () {
        return this.$store.state.bangumi.released
      },
      notFetch () {
        return this.loading || this.timeline.noMore
      }
    },
    data () {
      return {
        loading: false,
        sort: this.$route.params.sort,
        showWeek: 'tab-weekly-0',
        weeklys: ['最新', '一', '二', '三', '四', '五', '六', '日']
      }
    },
    methods: {
      async loadMore () {
        if (this.notFetch) {
          return
        }
        this.loading = true
        try {
          await this.$store.dispatch('bangumi/getTimeline')
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      },
      switchTab (tab) {
        this.sort = tab
        if (tab === 'news' && !this.released.length) {
          this.$store.dispatch('bangumi/getReleased', this)
        }
      },
      handleWeeklySwitch (index) {
        this.showWeek = `tab-weekly-${index}`
      }
    }
  }
</script>

<style lang="scss">
  #bangumi-timeline {
    $time-size: 0;

    .collections {
      margin-top: 20px;

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

        .bangumi {
          margin-bottom: 10px;

          figure {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;

            .face {
              width: 60px;
              height: 60px;
              flex-shrink: 0;
              margin-right: 15px;
              display: block;
              border-radius: 5px;
            }

            .content {
              flex: auto;

              .head {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                .name {
                  font-size: 14px;
                  font-weight: bold;

                  &:hover {
                    text-decoration: underline;
                  }
                }

                .score {

                }
              }

              .body {
                margin: 8.5px 0;
                color: $color-text-light;
                font-size: 13px;
                line-height: 18px;
              }

              .foot {
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div id="bangumi-timeline">
    <div class="tabs border-bottom">
      <button class="active">时间轴</button>
    </div>
    <ul class="collections container"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="50">
      <ul v-for="col in timeline" :key="col.date" class="collection">
        <h3 class="time" v-text="col.date"></h3>
        <li class="bangumi" v-for="item in col.list" :key="item.id">
          <figure>
            <router-link :to="$alias.bangumi(item.id)">
              <v-img
                class="face"
                :title="item.name"
                :alt="item.name"
                :src="$resize(item.avatar, { width: 120 })">
              </v-img>
            </router-link>
            <figcaption class="content">
              <p class="head">
                <router-link :to="$alias.bangumi(item.id)" class="name" v-text="item.name"></router-link>
                <!--<span v-text="item.count_score"></span>-->
              </p>
              <p class="body twoline" v-text="item.summary"></p>
              <div class="foot">
                <!--<span v-text="item.count_like"></span>-->
              </div>
            </figcaption>
          </figure>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'page-bangumi-time',
    async asyncData ({ store, ctx }) {
      await store.dispatch('bangumi/getTimeline', ctx)
    },
    computed: {
      timeline () {
        return this.$store.state.bangumi.timeline.data
      },
      noMore () {
        return this.$store.state.bangumi.timeline.noMore
      }
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      async loadMore () {
        if (this.loading || this.noMore) {
          return
        }
        this.loading = true
        await this.$store.dispatch('bangumi/getTimeline')
        this.loading = false
      }
    }
  }
</script>

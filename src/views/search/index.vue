<style lang="scss">
  #search-index {
    .search-panel {
      position: relative;
      margin: 10px;
      background-color: #fff;
      box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
      border-radius: 8px;

      .input-wrap {
        border-bottom-left-radius: 0;
      }

      .search-btn {
        border-bottom-right-radius: 0;
      }

      .tabs-panel {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        height: 40px;
        line-height: 28px;
        overflow: hidden;
        position: relative;
        font-size: 12px;

        .tail {
          background: -webkit-gradient(linear,left top,right top,color-stop(0%,rgba(255,255,255,0)),color-stop(100%,rgba(255,255,255,1)));
          border-bottom-right-radius: 8px;
          height: 40px;
          position: absolute;
          pointer-events: none;
          right: 0;
          top: 0;
          width: 24px;
          line-height: 40px;
          text-align: center;
        }

        .cards {
          white-space: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;

          button {
            display: inline-block;
            line-height: 40px;
            height: 40px;
            margin: 0;
            padding: 0 16px;
            text-align: center;

            &.active {
              border-bottom: 2px solid $color-pink-deep;
              color: $color-pink-deep;
            }
          }
        }
      }
    }

    .nomore {
      background-color: #fff;
    }
  }
</style>

<template>
  <div id="search-index">
    <div class="search-panel">
      <v-search
        v-model="words"
        :type="selectedType"
      ></v-search>
      <div class="tabs-panel">
        <div class="cards">
          <button
            v-for="(tab, index) in tabs"
            :class="{ 'active': selectedType == index }"
            @click="switchTab(index)"
            v-text="tab"
          ></button>
        </div>
        <div class="tail"></div>
      </div>
    </div>
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      class="container"
      v-if="index == selectedType"
    >
      <component
        v-for="item in list"
        :key="`${item.type}-${item.id}`"
        :is="`Flow${item.type}`"
        :item="item"
        :in-common="item.type != selectedType"
      ></component>
    </div>
    <more-btn
      :no-more="noMore"
      :loading="loading"
      :length="list.length"
      @fetch="loadMore"
    ></more-btn>
  </div>
</template>

<script>
  import vSearch from '~/components/search/Input'
  import Flow1 from '~/components/search/flows/flow_1'
  import Flow2 from '~/components/search/flows/flow_2'
  import Flow3 from '~/components/search/flows/flow_3'
  import Flow4 from '~/components/search/flows/flow_4'
  import Flow5 from '~/components/search/flows/flow_5'

  export default {
    name: 'search-index',
    async asyncData ({ store, route, ctx }) {
      const args = route.query
      await store.dispatch('search/fetchData', {
        ctx,
        type: args.type,
        q: args.q
      })
    },
    components: {
      vSearch,
      Flow1,
      Flow2,
      Flow3,
      Flow4,
      Flow5
    },
    computed: {
      resource () {
        return this.$store.state.search.resource[this.selectedType]
      },
      loading () {
        return this.resource.loading
      },
      list () {
        return this.resource.list
      },
      noMore () {
        return this.resource.noMore
      },
      total () {
        return this.resource.total
      },
      tabs () {
        return this.$store.state.search.tabs
      },
      selectedType () {
        return this.$route.query.type
      }
    },
    data () {
      return {
        words: this.$route.query.q
      }
    },
    methods: {
      switchTab (tab) {
        this.$router.push({
          name: 'search-index',
          query: { q: this.words, type: tab }
        })
      },
      async loadMore () {
        try {
          await this.$store.dispatch('search/fetchMore', {
            ctx: this,
            type: this.selectedType
          })
        } catch (e) {
          this.$toast.error(e)
        }
      }
    }
  }
</script>

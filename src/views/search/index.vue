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
        background: -webkit-gradient(
          linear,
          left top,
          right top,
          color-stop(0%, rgba(255, 255, 255, 0)),
          color-stop(100%, rgba(255, 255, 255, 1))
        );
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
        height: 50px;

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

  .post-flow-item,
  .score-flow-item {
    margin-left: -$container-padding;
    margin-right: -$container-padding;
  }
}
</style>

<template>
  <div id="search-index">
    <div class="search-panel">
      <v-search
        v-model="words"
        :type="selectedType"
      />
      <div class="tabs-panel">
        <div class="cards">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{ 'active': selectedType == index }"
            @click="switchTab(index)"
            v-text="tab"
          />
        </div>
        <div class="tail"/>
      </div>
    </div>
    <div
      v-for="(tab, index) in tabs"
      v-if="index == selectedType"
      :key="index"
      class="container"
    >
      <component
        v-for="item in list"
        :key="`${item.type}-${item.id}`"
        :is="`${item.type}-item`"
        :item="item"
        :in-common="item.type != selectedType"
      />
    </div>
    <more-btn
      :no-more="noMore"
      :loading="loading"
      :length="list.length"
      @fetch="loadMore"
    />
  </div>
</template>

<script>
import vSearch from "~/components/search/Input";
import UserItem from "~/components/search/flows/UserItem";
import BangumiItem from "~/components/search/flows/BangumiItem";
import VideoItem from "~/components/search/flows/VideoItem";
import PostItem from "~/components/flow/item/PostFlowItem";
import RoleItem from "~/components/flow/item/CartoonRoleFlowItem";
import ScoreItem from "~/components/flow/item/ScoreFlowItem";

export default {
  name: "SearchIndex",
  async asyncData({ store, route, ctx }) {
    const args = route.query;
    await store.dispatch("search/fetchData", {
      ctx,
      type: args.type,
      q: args.q
    });
  },
  components: {
    vSearch,
    UserItem,
    BangumiItem,
    VideoItem,
    PostItem,
    RoleItem,
    ScoreItem
  },
  computed: {
    resource() {
      return this.$store.state.search.resource[this.selectedType];
    },
    loading() {
      return this.resource.loading;
    },
    list() {
      return this.resource.list;
    },
    noMore() {
      return this.resource.noMore;
    },
    total() {
      return this.resource.total;
    },
    tabs() {
      return this.$store.state.search.tabs;
    },
    selectedType() {
      return this.$route.query.type;
    },
    words() {
      return this.$route.query.q;
    }
  },
  methods: {
    switchTab(tab) {
      this.$router.push({
        name: "search-index",
        query: { q: this.words, type: tab }
      });
    },
    async loadMore() {
      try {
        await this.$store.dispatch("search/fetchMore", {
          ctx: this,
          type: this.selectedType
        });
      } catch (e) {
        this.$toast.error(e);
      }
    }
  }
};
</script>

<style lang="scss">
#user-score-list {
  .control {
    margin-top: 10px;

    .published {
      float: left;
      margin-right: 10px;
    }

    .draft {
      float: right;
    }

    .published,
    .draft {
      line-height: 32px;
      font-size: 14px;
      color: $color-text-normal;
    }
  }

  .score-draft {
    padding-bottom: 15px;
    padding-top: 20px;
    @extend %clearfix;

    &:not(:last-child) {
      border-bottom: 1px solid #f4f5f7;
    }

    .bangumi {
      float: right;

      img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        margin-left: 10px;
      }
    }

    .content {
      overflow: hidden;
      display: block;

      .title {
        line-height: 18px;
        font-size: 14px;
      }

      .intro {
        display: block;
        font-size: 12px;
        color: $color-text-normal;
        @include twoline(16px);
      }
    }
  }

  .nomore {
    background-color: #fff;
  }
}
</style>

<template>
  <div id="user-score-list">
    <div 
      v-if="isMine" 
      class="container control">
      <div class="published">已发布</div>
      <div class="draft">草稿箱</div>
      <mt-switch
        v-model="showDraft"
        @change="handleSwitchChange"
      />
    </div>
    <div
      v-if="showDraft"
      class="container"
    >
      <more-btn
        v-if="fetchedDraft && !drafts.length"
        :no-more="true"
        :loading="false"
        :length="0"
      >
        <a :href="$alias.createScore">
          <button>写漫评</button>
        </a>
      </more-btn>
      <template v-else>
        <div
          v-for="item in drafts"
          :key="item.id"
          class="score-draft"
        >
          <a
            :href="$alias.bangumi(item.bangumi.id)"
            class="bangumi"
          >
            <img :src="$resize(item.bangumi.avatar, { width: 100 })">
          </a>
          <a
            :href="$alias.editScore(item.id)"
            class="content"
          >
            <div class="title oneline">
              写给《{{ item.bangumi.name }}》的漫评
            </div>
            <div
              class="intro"
              v-text="item.intro"
            />
          </a>
        </div>
      </template>
    </div>
    <template v-else>
      <ul>
        <score-flow-item
          v-for="item in list"
          :key="item.id"
          :item="item"
        />
      </ul>
      <more-btn
        :no-more="noMore"
        :loading="state.loading"
        :length="list.length"
        @fetch="getData"
      />
    </template>
  </div>
</template>

<script>
import Api from "~/api/scoreApi";
import ScoreFlowItem from "~/components/score/ScoreFlowItem";

export default {
  name: "UserScoreList",
  components: {
    ScoreFlowItem
  },
  props: {
    zone: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      state: {
        loading: false,
        fetched: false
      },
      list: [],
      noMore: false,
      total: 0,
      page: 0,
      take: 10,
      showDraft: false,
      drafts: [],
      loadingDraft: false,
      fetchedDraft: false
    };
  },
  computed: {
    isMine() {
      return this.$store.state.login
        ? this.$store.state.user.zone === this.zone
        : false;
    }
  },
  mounted() {
    if (!this.state.fetched) {
      this.getData();
    }
  },
  methods: {
    handleSwitchChange(result) {
      if (!result) {
        this.getDraft();
      }
    },
    async getData() {
      if (this.state.loading) {
        return;
      }
      this.state.loading = true;
      const api = new Api(this);
      try {
        const data = await api.getUsersScore({
          zone: this.zone,
          page: this.page,
          take: this.take
        });
        this.list = this.list.concat(data.list);
        this.total = data.total;
        this.noMore = data.noMore;
        this.page++;
        this.state.fetched = true;
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.state.loading = false;
      }
    },
    async getDraft() {
      if (this.loadingDraft || this.fetchedDraft) {
        return;
      }
      this.loadingDraft = true;
      const api = new Api(this);
      try {
        this.drafts = await api.drafts();
        this.fetchedDraft = true;
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingDraft = false;
      }
    }
  }
};
</script>

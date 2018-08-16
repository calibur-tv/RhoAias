<style lang="scss">
#user-score-list {
  .control {
    margin-top: 10px;

    .published {
      margin-right: 10px;
      line-height: 32px;
      font-size: 14px;
      color: $color-text-normal;
      float: left;
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
}
</style>

<template>
  <div id="user-score-list">
    <div 
      v-if="isMine" 
      class="container control">
      <div class="published">{{ showDraft ? '草稿箱' : '已发布' }}</div>
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
    <score-flow-list
      v-else
      :user-zone="zone"
    />
  </div>
</template>

<script>
import Api from "~/api/scoreApi";
import ScoreFlowList from "~/components/flow/list/ScoreFlowList";

export default {
  name: "UserScoreList",
  components: {
    ScoreFlowList
  },
  props: {
    zone: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      drafts: [],
      showDraft: false,
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
  methods: {
    handleSwitchChange(result) {
      if (!result) {
        this.getDraft();
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

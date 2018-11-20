<style lang="scss">
#user-draft {
  .label {
    font-size: 0;

    button {
      display: inline-block;
      width: 50%;
      height: 40px;
      font-size: 13px;
      background-color: #fff;
      color: $color-text-normal;
    }

    .active {
      background-color: $color-gray-normal;
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

  .answer-draft {
    padding-bottom: 15px;
    padding-top: 20px;
    &:not(:last-child) {
      border-bottom: 1px solid #f4f5f7;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.6;
      color: #1a1a1a;
      margin-bottom: 6px;

      &:hover {
        color: $color-blue-deep;
      }
    }

    .intro {
      line-height: 25px;
      max-height: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

<template>
  <div id="user-draft">
    <div class="label">
      <button
        :class="{ active: active === '漫评' }"
        @click="switchTab('漫评')"
      >漫评</button>
      <button
        :class="{ active: active === '回答' }"
        @click="switchTab('回答')"
      >回答</button>
    </div>
    <div class="container">
      <template v-if="active === '漫评'">
        <div
          v-for="item in scores.list"
          :key="item.id"
          class="score-draft"
        >
          <template v-if="item && item.bangumi">
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
          </template>
        </div>
        <more-btn
          :no-more="true"
          :loading="scores.loading"
          :length="1"
        >
          <a :href="$alias.createScore">
            <button>写漫评</button>
          </a>
        </more-btn>
      </template>
      <template v-else-if="active === '回答'">
        <div
          v-for="item in answers.list"
          :key="item.id"
          class="answer-draft"
        >
          <a :href="$alias.question(item.question.id)">
            <h5
              class="title"
              v-text="item.question.title"
            />
          </a>
          <a
            :href="$alias.answer(item.id)"
            class="intro"
            v-text="item.intro"
          />
        </div>
        <more-btn
          :no-more="true"
          :loading="answers.loading"
          :length="1"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserDraft",
  async asyncData({ store, ctx }) {
    await store.dispatch("users/getUserDrafts", {
      type: "score",
      ctx
    });
  },
  data() {
    return {
      active: "漫评"
    };
  },
  computed: {
    zone() {
      return this.$route.params.zone;
    },
    isMe() {
      return this.$store.state.login
        ? this.zone === this.$store.state.user.zone
        : false;
    },
    scores() {
      return this.$store.state.users.drafts.score;
    },
    answers() {
      return this.$store.state.users.drafts.answer;
    }
  },
  mounted() {
    if (!this.isMe) {
      this.$router.replace({
        name: "user-bangumi"
      });
    }
  },
  methods: {
    switchTab(value) {
      this.active = value;
      if (value === "漫评") {
        this.getUserDrafts("score");
      } else if (value === "回答") {
        this.getUserDrafts("answer");
      }
    },
    async getUserDrafts(type) {
      await this.$store.dispatch("users/getUserDrafts", {
        type,
        ctx: this
      });
    }
  }
};
</script>

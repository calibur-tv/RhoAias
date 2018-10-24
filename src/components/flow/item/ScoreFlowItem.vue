<style lang="scss">
.score-flow-item {
  padding-top: $container-padding;
  padding-left: $container-padding;
  padding-right: $container-padding;

  .header {
    margin-bottom: 10px;

    .el-rate {
      display: inline-block;
      vertical-align: middle;
      height: 23px;
      margin-left: 10px;
      float: right;
    }
  }

  .trending-header {
    .user-avatar {
      margin-right: 5px;
      float: left;
    }

    .header-content {
      overflow: hidden;

      .about {
        overflow: hidden;

        .bangumi-name {
          overflow: hidden;
          display: block;
          line-height: 20px;
          font-size: 12px;
          vertical-align: middle;
          color: #333;
        }
      }

      .meta {
        color: #999;
        font-size: 11px;
        line-height: 11px;
        margin-top: -3px;

        a {
          color: #999;
          font-size: 11px;
        }
      }
    }
  }

  .bangumi-header {
    .user {
      display: block;
      overflow: hidden;

      .user-avatar {
        margin-right: 5px;
        float: left;
      }

      .nickname {
        overflow: hidden;
        display: block;
        line-height: 23px;
        vertical-align: middle;
        color: #333;
        font-size: 11px;
      }
    }
  }

  .user-header {
    .bangumi {
      display: block;
      overflow: hidden;

      .bangumi-avatar {
        margin-right: 5px;
        float: left;
        border-radius: 4px;
      }

      .nickname {
        overflow: hidden;
        display: block;
        line-height: 23px;
        vertical-align: middle;
        color: #333;
        font-size: 11px;
      }
    }
  }

  .body {
    .title {
      margin-bottom: 5px;

      .oneline {
        color: #4c4c4c;
        font-weight: bold;
        font-size: 14px;
        line-height: 14px;
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    .content {
      color: #333;
      font-size: 14px;
      margin-top: 0;
      margin-bottom: 5px;
      @include twoline(18px);
    }
  }

  .footer {
    height: 35px;
    line-height: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 5px;

    i {
      color: #666;
      vertical-align: middle;
      margin-right: 3px;
    }

    span {
      vertical-align: middle;
      font-size: 11px;
      color: $color-text-normal;
    }

    .done {
      color: $color-blue-normal;
    }
  }
}
</style>

<template>
  <li class="score-flow-item">
    <div @click="linkStart">
      <div
        v-if="item.bangumi && item.user"
        class="header trending-header"
      >
        <a
          :href="$alias.user(item.user.zone)"
          class="user-avatar"
        >
          <v-img
            :src="item.user.avatar"
            :avatar="true"
            size="35"
          />
        </a>
        <div class="header-content">
          <div class="about">
            <el-rate
              v-if="starCount"
              v-model="starCount"
              disabled
            />
            <el-rate
              v-else
              v-model="zero"
              disabled
            />
            <a
              :href="$alias.bangumi(item.bangumi.id)"
              class="bangumi-name oneline"
              v-text="item.bangumi.name"
            />
          </div>
          <div class="meta">
            <a
              :href="$alias.user(item.user.zone)"
              class="author"
              v-text="item.user.nickname"
            />
            &nbsp;·&nbsp;
            <v-time
              v-model="item.created_at"
              class="created-at"
            />
          </div>
        </div>
      </div>
      <div
        v-else-if="!item.bangumi"
        class="header bangumi-header"
      >
        <el-rate
          v-if="starCount"
          v-model="starCount"
          disabled
        />
        <el-rate
          v-else
          v-model="zero"
          disabled
        />
        <a
          :href="$alias.user(item.user.zone)"
          class="user"
        >
          <div class="user-avatar">
            <v-img
              :src="item.user.avatar"
              :avatar="true"
              size="35"
            />
          </div>
          <div
            class="nickname oneline"
            v-text="item.user.nickname"
          />
        </a>
      </div>
      <div
        v-else-if="!item.user"
        class="header user-header"
      >
        <el-rate
          v-if="starCount"
          v-model="starCount"
          disabled
        />
        <el-rate
          v-else
          v-model="zero"
          disabled
        />
        <a
          :href="$alias.bangumi(item.bangumi.id)"
          class="bangumi"
        >
          <div class="bangumi-avatar">
            <v-img
              :src="item.bangumi.avatar"
              size="23"
            />
          </div>
          <div
            class="nickname oneline"
            v-text="item.bangumi.name"
          />
        </a>
      </div>
      <div class="body">
        <div class="title">
          <p
            class="oneline"
            v-text="item.title"
          />
        </div>
        <div
          class="content"
          v-text="item.intro"
        />
      </div>
      <div class="footer">
        <div v-if="item.is_creator">
          <i class="iconfont icon-fantuan"/>
          <span>{{ $utils.shortenNumber(item.reward_count) }}</span>
        </div>
        <div v-else>
          <i class="iconfont icon-like"/>
          <span>{{ $utils.shortenNumber(item.like_count) }}</span>
        </div>
        <div>
          <i class="iconfont icon--mark"/>
          <span>{{ $utils.shortenNumber(item.mark_count) }}</span>
        </div>
        <div>
          <i class="iconfont icon-talk"/>
          <span>{{ $utils.shortenNumber(item.comment_count) }}</span>
        </div>
      </div>
    </div>
    <div class="hr"/>
  </li>
</template>

<script>
import { Rate } from "element-ui";

export default {
  name: "ScoreFlowItem",
  components: {
    "el-rate": Rate
  },
  props: {
    item: {
      required: true,
      type: Object
    },
    bangumiId: {
      required: true,
      type: Number
    },
    userZone: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      zero: 0
    };
  },
  computed: {
    pageName() {
      return this.$route.name;
    },
    starCount() {
      return this.item.total / 2;
    }
  },
  methods: {
    linkStart() {
      this.$router.push(this.$alias.score(this.item.id));
    }
  }
};
</script>

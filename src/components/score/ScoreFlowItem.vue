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
      display: block;
      margin-right: 5px;
      float: left;
      @include avatar(35px);
    }

    .header-content {
      overflow: hidden;

      .about {
        overflow: hidden;

        .bangumi-name {
          overflow: hidden;
          display: block;
          line-height: 23px;
          font-size: 12px;
          vertical-align: middle;
          color: #333;
        }
      }

      .meta {
        color: #999;
        font-size: 11px;
        line-height: 11px;

        a {
          color: #999;
        }
      }
    }
  }

  .bangumi-header {
    .user {
      display: block;
      overflow: hidden;

      .user-avatar {
        display: block;
        margin-right: 5px;
        float: left;
        @include avatar(23px);
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
        display: block;
        margin-right: 5px;
        float: left;
        width: 23px;
        height: 23px;
        overflow: hidden;
        border-radius: 4px;

        img {
          width: 100%;
          height: 100%;
        }
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

      .top_badge,
      .nice_badge {
        float: left;
        height: 16px;
        line-height: 18px;
        color: #fff;
        cursor: default;
        font-size: 11px;
        font-weight: bold;
        text-align: center;
        border-radius: 4px;
        padding: 0 4px;
        margin-right: 5px;
      }

      .top_badge {
        background-color: $color-blue-normal;
      }

      .nice_badge {
        background-color: $color-pink-deep;
      }

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
      margin-bottom: 8px;
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

    span {
      font-size: 12px;
      color: #666;
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
        v-if="!item.bangumi"
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
            <img :src="$resize(item.user.avatar, { width: 50 })">
          </div>
          <div
            class="nickname oneline"
            v-text="item.user.nickname"
          />
        </a>
      </div>
      <div
        v-if="!item.user"
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
            <img :src="$resize(item.bangumi.avatar, { width: 50 })">
          </div>
          <div
            class="nickname oneline"
            v-text="item.bangumi.name"
          />
        </a>
      </div>
      <div
        v-else
        class="header trending-header"
      >
        <a
          :href="$alias.user(item.user.zone)"
          class="user-avatar"
        >
          <img :src="$resize(item.user.avatar, { width: 70 })">
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
        <span>
          喜欢
          {{ item.like_count }}
        </span>
        <span>
          评论
          {{ item.comment_count }}
        </span>
        <span>
          收藏
          0
        </span>
      </div>
    </div>
    <div class="hr"/>
  </li>
</template>

<script>
export default {
  name: "ScoreFlowItem",
  props: {
    item: {
      required: true,
      type: Object
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

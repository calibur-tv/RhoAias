<style lang="scss">
.score-flow-item {
  padding-top: $container-padding;
  padding-left: $container-padding;
  padding-right: $container-padding;

  .header {
    .el-rate {
      display: inline-block;
      vertical-align: middle;
      height: 23px;
      margin-left: 10px;
      float: right;
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

          a {
            color: #999;
            font-size: 11px;
          }
        }
      }
    }

    .bangumi-header {
      .el-rate {
        float: right;
      }

      .user {
        display: block;
        overflow: hidden;

        .user-avatar {
          margin-right: 5px;
          float: left;
        }

        .nickname {
          color: $color-text-gray;
          font-size: 14px;
          line-height: 23px;
        }
      }
    }

    .user-header {
      .bangumi {
        display: block;
        overflow: hidden;

        .bangumi-avatar {
          margin-right: 5px;
          border-radius: 4px;
          float: left;
          font-size: 0;
          overflow: hidden;
        }

        .nickname {
          color: $color-text-gray;
          font-size: 14px;
          line-height: 23px;
        }
      }
    }
  }

  .body {
    .title {
      margin-top: 8px;

      .oneline {
        color: #4c4c4c;
        font-weight: bold;
        font-size: 14px;
        line-height: 14px;
      }
    }

    .flow-images {
      margin-bottom: 8px;
      margin-top: 10px;
    }

    .content {
      color: #333;
      font-size: 14px;
      margin-top: 0;
      margin-bottom: 12px;
      @include twoline(20px);
    }
  }

  .footer {
    position: relative;
    height: 38px;
    line-height: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 5px;
    padding-top: 3px;

    &:after {
      content: '';
      position: absolute;
      left: -$container-padding;
      right: -$container-padding;
      top: 0;
      height: 1px;
      transform: scaleY(0.5);
      background-color: #eee;
    }

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
      <div class="header clearfix">
        <div v-if="!bangumiId && !userZone" class="trending-header">
          <UserAvatar :user="item.user" :size="35"/>
          <div class="header-content">
            <div class="about">
              <el-rate v-if="starCount" v-model="starCount" disabled />
              <el-rate v-else v-model="zero" disabled />
              <nuxt-link
                :to="$alias.bangumi(item.bangumi.id)"
                class="bangumi-name oneline"
                v-text="item.bangumi.name"
              />
            </div>
            <div class="meta">
              <nuxt-link
                :to="$alias.user(item.user.zone)"
                class="author"
                v-text="item.user.nickname"
              />
              &nbsp;·&nbsp;
              <v-time v-model="item.created_at" class="created-at" />
            </div>
          </div>
        </div>
        <div v-else-if="!userZone" class="bangumi-header">
          <el-rate v-if="starCount" v-model="starCount" disabled />
          <el-rate v-else v-model="zero" disabled />
          <nuxt-link
            :to="$alias.user(item.user.zone)"
            class="user"
          >
            <UserAvatar :user="item.user" :size="22"/>
            <div
              class="nickname oneline"
              v-text="item.user.nickname"
            />
          </nuxt-link>
        </div>
        <div v-else-if="!bangumiId" class="user-header">
          <el-rate v-if="starCount" v-model="starCount" disabled />
          <el-rate v-else v-model="zero" disabled />
          <nuxt-link :to="$alias.bangumi(item.bangumi.id)" class="bangumi">
            <div class="bangumi-avatar">
              <v-img :src="item.bangumi.avatar" width="23" height="23" />
            </div>
            <div class="nickname oneline" v-text="item.bangumi.name" />
          </nuxt-link>
        </div>
      </div>
      <div class="body">
        <div class="title">
          <p class="oneline" v-text="item.title" />
        </div>
        <FlowImages :images="item.images"/>
        <div class="content" v-text="item.intro" />
      </div>
      <div class="footer">
        <div v-if="item.is_creator">
          <i class="iconfont icon-fantuan" />
          <span>{{ $utils.shortenNumber(item.reward_count) }}</span>
        </div>
        <div v-else>
          <i class="iconfont icon-like" />
          <span>{{ $utils.shortenNumber(item.like_count) }}</span>
        </div>
        <div>
          <i class="iconfont icon-mark" />
          <span>{{ $utils.shortenNumber(item.mark_count) }}</span>
        </div>
        <div>
          <i class="iconfont icon-talk" />
          <span>{{ $utils.shortenNumber(item.comment_count) }}</span>
        </div>
      </div>
    </div>
    <div class="hr" />
  </li>
</template>

<script>
import { Rate } from 'element-ui'
import FlowImages from '~/components/flow/FlowImages'
import UserAvatar from '~/components/user/UserAvatar'

export default {
  name: 'ScoreFlowItem',
  components: {
    UserAvatar,
    FlowImages,
    'el-rate': Rate
  },
  props: {
    item: {
      required: true,
      type: Object
    },
    bangumiId: {
      required: true,
      type: [String, Number]
    },
    userZone: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      zero: 0
    }
  },
  computed: {
    pageName() {
      return this.$route.name
    },
    starCount() {
      return this.item.total / 2
    }
  },
  methods: {
    linkStart() {
      this.$router.push(this.$alias.score(this.item.id))
    }
  }
}
</script>

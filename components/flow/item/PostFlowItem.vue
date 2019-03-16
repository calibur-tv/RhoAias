<style lang="scss">
.post-flow-item {
  padding-top: $container-padding;
  padding-left: $container-padding;
  padding-right: $container-padding;

  .header {
    height: 40px;
    margin-bottom: 5px;

    .bangumi-avatar {
      margin-right: 5px;
      display: block;
      float: left;
      width: 35px;
      height: 35px;

      img {
        display: block;
        width: 100%;
        height: auto;
        overflow: hidden;
        border-radius: 4px;
        border: 1px solid $color-avatar-border;
      }
    }

    .info {
      vertical-align: middle;
      display: block;
      overflow: hidden;
      height: 35px;

      .name {
        display: block;
        font-size: 14px;
        line-height: 14px;
        overflow: hidden;
        margin-top: 4px;
        color: #333;
      }

      time {
        display: block;
        color: #999;
        font-size: 11px;
        line-height: 11px;
        margin-top: 3px;
      }
    }
  }

  .body {
    .title {
      margin-bottom: 5px;

      .top_badge,
      .nice_badge,
      .creator_badge {
        float: left;
        height: 14px;
        line-height: 14px;
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
        background-color: $color-pink-normal;
      }

      .creator_badge {
        background-color: $color-yellow;
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
      margin-bottom: 7px;
      @include twoline(18px);
    }

    .flow-images {
      margin-bottom: 9px;
    }

    .flow-tags {
      margin-bottom: 10px;
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
  <li class="post-flow-item">
    <nuxt-link :to="$alias.post(item.id)" tag="div">
      <div class="header">
        <template v-if="!userZone">
          <FlowHeaderUser :user="item.user" :time="item.created_at" />
        </template>
        <template v-else>
          <router-link
            :to="$alias.bangumi(item.bangumi.id)"
            class="bangumi-avatar"
          >
            <v-img :src="item.bangumi.avatar" width="35" height="35" />
          </router-link>
          <div class="info">
            <router-link
              :to="$alias.bangumi(item.bangumi.id)"
              class="name oneline"
              v-text="item.bangumi.name"
            />
            <v-time v-model="item.created_at" />
          </div>
        </template>
      </div>
      <div class="body">
        <div class="title">
          <div v-if="item.top_at && bangumiId" class="top_badge">
            置顶
          </div>
          <div v-if="item.is_nice" class="nice_badge">
            精
          </div>
          <div v-if="item.is_creator" class="creator_badge">
            原创
          </div>
          <p class="oneline" v-text="item.title" />
        </div>
        <p class="content" v-text="item.desc" />
        <FlowImages :images="item.images" />
        <FlowTags
          :bangumi="item.bangumi"
          :idol="item.idol"
          :tags="item.tags"
        />
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
    </nuxt-link>
    <div class="hr" />
  </li>
</template>

<script>
import FlowHeaderUser from '~/components/layouts/FlowHeaderUser'
import FlowImages from '~/components/flow/FlowImages'
import FlowTags from '~/components/flow/FlowTags'

export default {
  name: 'PostFlowItem',
  components: {
    FlowHeaderUser,
    FlowImages,
    FlowTags
  },
  props: {
    item: {
      required: true,
      type: Object
    },
    bangumiId: {
      type: [Number, String],
      default: 0
    },
    userZone: {
      type: String,
      default: ''
    }
  },
  methods: {
    imageFilter(images) {
      return images.slice(0, 3)
    }
  }
}
</script>

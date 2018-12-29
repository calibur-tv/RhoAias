<style lang="scss">
.post-flow-item {
  padding-top: $container-padding;
  padding-left: $container-padding;
  padding-right: $container-padding;

  .header {
    height: 35px;
    margin-bottom: 10px;

    .user-avatar {
      margin-right: 7px;
      float: left;
      position: relative;
    }

    .bangumi-avatar {
      margin-right: 10px;
      display: block;
      float: left;
      width: 35px;
      height: 35px;

      img {
        display: block;
        width: 100%;
        height: auto;
        overflow: hidden;
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
        background-color: $color-pink-deep;
      }

      .creator_badge {
        background-color: goldenrod;
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

    .images {
      position: relative;
      margin-bottom: 9px;

      .poster-image {
        border-radius: 4px;

        img {
          height: auto;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .image-list {
        @extend %clearfix;

        .image {
          float: left;
          border-radius: 4px;

          &:not(:last-child) {
            margin-right: 2%;
          }
        }
      }
    }

    .tags {
      height: 20px;
      margin-bottom: 10px;
      margin-top: -2px;
      overflow: hidden;

      > * {
        display: inline-block;
        padding-left: 5px;
        padding-right: 5px;
        height: 18px;
        font-size: 12px;
        border-radius: 9px;
        line-height: 18px;
        background-color: $color-gray-normal;
        color: $color-text-normal;
        margin-right: 5px;
      }

      i {
        margin-right: 2px;
      }
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
    <router-link
      :to="$alias.post(item.id)"
      tag="div"
    >
      <div class="header">
        <template v-if="!userZone">
          <router-link
            :to="$alias.user(item.user.zone)"
            class="user-avatar"
          >
            <v-img
              :src="item.user.avatar"
              :avatar="true"
              size="35"
            />
          </router-link>
          <div class="info">
            <router-link
              :to="$alias.user(item.user.zone)"
              class="name oneline"
              v-text="item.user.nickname"
            />
            <v-time v-model="item.created_at"/>
          </div>
        </template>
        <template v-else>
          <router-link
            :to="$alias.bangumi(item.bangumi.id)"
            class="bangumi-avatar"
          >
            <v-img
              :src="item.bangumi.avatar"
              size="35"
            />
          </router-link>
          <div class="info">
            <router-link
              :to="$alias.bangumi(item.bangumi.id)"
              class="name oneline"
              v-text="item.bangumi.name"
            />
            <v-time v-model="item.created_at"/>
          </div>
        </template>
      </div>
      <div class="body">
        <div class="title">
          <div
            v-if="item.top_at && bangumiId"
            class="top_badge"
          >置顶</div>
          <div
            v-if="item.is_nice"
            class="nice_badge"
          >精</div>
          <div
            v-if="item.is_creator"
            class="creator_badge"
          >原创</div>
          <p
            class="oneline"
            v-text="item.title"
          />
        </div>
        <p
          class="content"
          v-text="item.desc"
        />
        <div
          v-if="item.images.length"
          class="images"
        >
          <v-img
            v-if="item.images.length === 1"
            :src="item.images[0].url"
            width="100%"
            height="130"
            class="poster-image"
          />
          <div
            v-else
            class="image-list"
          >
            <v-img
              v-for="(image, index) in imageFilter(item.images)"
              :key="index"
              :src="image.url"
              class="image"
              width="32%"
              height="93"
            />
          </div>
        </div>
        <div
          v-if="item.bangumi || item.tags.length"
          class="tags"
        >
          <router-link
            v-if="item.bangumi && !userZone"
            :to="$alias.bangumi(item.bangumi.id)"
          >
            <i class="iconfont icon-tag"/>
            <span v-text="item.bangumi.name"/>
          </router-link>
          <span
            v-for="tag in item.tags"
            :key="tag.id"
            class="tag"
            v-text="tag.name"
          />
        </div>
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
    </router-link>
    <div class="hr"/>
  </li>
</template>

<script>
export default {
  name: 'PostFlowItem',
  props: {
    item: {
      required: true,
      type: Object
    },
    bangumiId: {
      type: Number,
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

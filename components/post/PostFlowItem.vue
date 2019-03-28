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
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #e5e9ef;
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

    .name {
      vertical-align: middle;
      overflow: hidden;
      height: 35px;

      .nickname {
        font-size: 14px;
        line-height: 14px;
        overflow: hidden;
        margin-top: 4px;
        margin-bottom: 0;
        color: #333;
      }

      a,
      time,
      span {
        display: block;
        color: #999;
        font-size: 11px;
        line-height: 11px;
        margin-top: 4px;
        float: left;
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
      margin-bottom: 8px;
      @include twoline(18px);
    }

    .images {
      position: relative;
      margin-bottom: 8px;

      .poster-image {
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

          &:not(:last-child) {
            margin-right: 2%;
          }
        }
      }
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
  <li class="post-flow-item">
    <div @click="linkStart">
      <div class="header">
        <nuxt-link
          v-if="item.user"
          :to="$alias.user(item.user.zone)"
          class="user-avatar"
          @click.stop
        >
          <v-img :src="item.user.avatar" width="35" height="35" />
        </nuxt-link>
        <nuxt-link
          v-else
          :to="$alias.bangumi(item.bangumi.id)"
          class="bangumi-avatar"
          @click.stop
        >
          <v-img :src="item.bangumi.avatar" width="35" height="35" />
        </nuxt-link>
        <div class="name">
          <div v-if="item.user" class="clearfix">
            <nuxt-link
              :to="$alias.user(item.user.zone)"
              class="nickname"
              @click.stop
              v-text="item.user.nickname"
            />
          </div>
          <div v-else class="clearfix">
            <span class="nickname">发表在</span>
          </div>
          <template v-if="item.bangumi">
            <nuxt-link
              :to="$alias.bangumi(item.bangumi.id)"
              @click.stop
              v-text="item.bangumi.name"
            />
            <span>&nbsp;·&nbsp;</span>
          </template>
          <template v-else>
            <span>发表于&nbsp;·&nbsp;</span>
          </template>
          <v-time v-model="item.created_at" />
        </div>
      </div>
      <div class="body">
        <div class="title">
          <div v-if="item.top_at" class="top_badge">
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
        <div v-if="item.images.length" class="images">
          <v-img
            v-if="item.images.length === 1"
            :src="item.images[0].url"
            width="100%"
            height="190"
            class="poster-image"
          />
          <div v-else class="image-list">
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
      </div>
      <div class="footer">
        <span v-if="item.is_creator">
          投食 {{ $utils.shortenNumber(item.reward_count) }}
        </span>
        <span v-else> 喜欢 {{ $utils.shortenNumber(item.like_count) }} </span>
        <span> 收藏 {{ $utils.shortenNumber(item.mark_count) }} </span>
        <span> 评论 {{ $utils.shortenNumber(item.comment_count) }} </span>
      </div>
    </div>
    <div class="hr" />
  </li>
</template>

<script>
export default {
  name: 'PostFlowItem',
  props: {
    item: {
      required: true,
      type: Object
    }
  },
  methods: {
    imageFilter(images) {
      return images.slice(0, 3)
    },
    linkStart() {
      this.$router.push(this.$alias.post(this.item.id))
    }
  }
}
</script>

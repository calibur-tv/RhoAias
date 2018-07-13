<style lang="scss">
  .post-item {
    background-color: #ffffff;
    padding-top: $container-padding;
    padding-left: $container-padding;
    padding-right: $container-padding;

    .header {
      height: 35px;
      margin-bottom: 9px;

      .avatar {
        margin-right: 7px;
        display: block;
        float: left;
        position: relative;
        @include avatar(35px);
        @include border($color-gray-normal, 50%);
      }

      .face {
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
        display: block;
        overflow: hidden;

        time, span {
          color: #999;
          font-size: 11px;
        }

        .title {
          .top_badge, .nice_badge {
            float: left;
            height: 15px;
            line-height: 15px;
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

          p {
            margin-bottom: 2px;
            margin-top: 2px;
            font-size: 14px;
            line-height: 15px;
            overflow: hidden;
            color: #333;
          }
        }
      }
    }

    .body {
      display: block;

      .content {
        color: #000;
        font-size: 16px;
        margin-bottom: 4px;
        @include twoline(24px)
      }

      .images {
        .image-full {
          height: 190px;
          width: 100%;
          background-color: #eee;
        }

        .image-list {
          img {
            width: 32%;
            max-height: 93px;
            height: auto;

            &:not(:last-child) {
              margin-right: 2%;
            }
          }
        }
      }
    }

    .footer {
      height: 44px;
      line-height: 44px;

      .bangumi {
        color: #999;
        font-size: 12px;
        display: block;
        margin-right: 8px;
      }

      .stats {
        height: 100%;
        color: #666;
        float: right;
        margin-top: -2px;

        span {
          margin-left: 10px;
          font-size: 12px;
          margin-right: 2px;
        }

        i {
          font-size: 12px;
          display: inline-block;
          vertical-align: middle;
        }

        .done {
          color: $color-blue-normal;
        }

        .icon-shoucang {
          margin-top: -3px;
        }
      }
    }
  }
</style>

<template>
  <li class="post-item">
    <div class="header">
      <a class="avatar" :href="$alias.user(item.user.zone)" v-if="item.user">
        <v-img width="70" :src="item.user.avatar"></v-img>
      </a>
      <a class="face" :href="$alias.bangumi(item.bangumi.id)" v-else>
        <v-img width="70" :src="item.bangumi.avatar"></v-img>
      </a>
      <a class="name" :href="$alias.post(item.id)">
        <div class="title">
          <div
            v-if="item.top_at"
            class="top_badge"
          >置顶</div>
          <div
            v-if="item.is_nice"
            class="nice_badge"
          >精</div>
          <p class="oneline" v-text="item.title"></p>
        </div>
        <span>{{ item.user ? item.user.nickname : '发表于' }}&nbsp;·&nbsp;</span>
        <v-time v-model="item.created_at"></v-time>
      </a>
    </div>
    <a :href="$alias.post(item.id)" class="body">
      <p class="content" v-text="item.desc"></p>
      <div class="images clearfix" v-if="item.images.length">
        <v-img
          class="image-full bg"
          v-if="item.images.length === 1"
          :src="item.images[0].url"
          height="190"
          mode="2"
          tag="div"
        ></v-img>
        <div class="image-list" v-else>
          <v-img
            v-for="(image, index) in imageFilter(item.images)"
            :key="index"
            :src="image.url"
            width="110"
          ></v-img>
        </div>
      </div>
    </a>
    <div class="footer">
      <div class="stats">
        <span :class="{ 'done' : item.liked }">
          <i class="iconfont icon-guanzhu"></i>
          {{ $utils.shortenNumber(item.like_count) }}
        </span>
        <span :class="{ 'done' : item.marked }">
          <i class="iconfont icon-shoucang"></i>
          {{ $utils.shortenNumber(item.mark_count) }}
        </span>
        <span :class="{ 'done' : item.commented }">
          <i class="iconfont icon-pinglun1"></i>
          {{ $utils.shortenNumber(item.comment_count) }}
        </span>
        <span>
          <i class="iconfont icon-yuedu"></i>
          {{ $utils.shortenNumber(item.view_count) }}
        </span>
      </div>
      <a
        v-if="item.bangumi && item.user"
        class="bangumi oneline"
        :href="$alias.bangumi(item.bangumi.id)"
        v-text="item.bangumi.name"
      ></a>
    </div>
    <div class="hr"></div>
  </li>
</template>

<script>
  export default {
    name: 'post-flow-item',
    props: {
      item: {
        required: true,
        type: Object
      }
    },
    methods: {
      imageFilter (images) {
        return images.slice(0, 3)
      }
    }
  }
</script>

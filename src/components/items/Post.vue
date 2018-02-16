<style lang="scss" scoped>
  .post {
    background-color: #ffffff;
    padding-top: $container-padding;
    padding-left: $container-padding;
    padding-right: $container-padding;

    .header {
      height: 35px;
      margin-bottom: 9px;

      .avatar {
        margin-right: 10px;
        display: block;
        float: left;
        @include avatar(35px);
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

        p {
          margin-bottom: 3px;
          font-size: 14px;
          color: #333;
        }

        time, span {
          color: #999;
          font-size: 12px;
        }
      }
    }

    .body {
      display: block;

      .content {
        color: #000;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 4px;
      }

      .images {
        .image-full {
          height: 190px;
          width: 100%;
        }

        .image-list {
          img {
            width: 32%;
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
        float: left;
        color: #999;
        font-size: 12px;
      }

      .stats {
        overflow: hidden;
        text-align: right;
        color: #666;

        span {
          margin-left: 10px;
          font-size: 12px;
          margin-right: 2px;
        }

        i {
          font-size: 18px;
          margin-top: -2px;
          display: inline-block;
          vertical-align: middle;
        }

        .done {
          color: $color-blue-normal;
        }
      }
    }
  }
</style>

<template>
  <li class="post">
    <div class="header">
      <template v-if="item.user">
        <router-link class="avatar" :to="$alias.user(item.user.zone)">
          <v-img width="70" :src="item.user.avatar"></v-img>
        </router-link>
        <router-link class="name" :to="$alias.user(item.user.zone)">
          <p v-text="item.user.nickname"></p>
          <v-time v-model="item.created_at"></v-time>
        </router-link>
      </template>
      <template v-else>
        <router-link class="face" :to="$alias.bangumi(item.bangumi.id)">
          <v-img width="70" :src="item.bangumi.avatar"></v-img>
        </router-link>
        <router-link class="name" :to="$alias.bangumi(item.bangumi.id)">
          <p v-text="item.bangumi.name"></p>
          <span>发表于&nbsp;·&nbsp;</span>
          <v-time v-model="item.created_at"></v-time>
        </router-link>
      </template>
    </div>
    <router-link :to="$alias.post(item.id)" class="body">
      <p class="content twoline" v-text="item.desc"></p>
      <div class="images clearfix" v-if="item.images.length">
        <v-img
          class="image-full bg"
          v-if="item.images.length === 1"
          :src="item.images[0]"
          height="190"
          mode="2"
          tag="div"
        ></v-img>
        <div class="image-list" v-else>
          <v-img
            v-for="(image, index) in imageFilter(item.images)"
            :key="index"
            :src="image"
            width="110"
          ></v-img>
        </div>
      </div>
    </router-link>
    <div class="footer">
      <router-link
        v-if="item.bangumi && item.user"
        class="bangumi"
        :to="$alias.bangumi(item.bangumi.id)"
        v-text="item.bangumi.name"
      ></router-link>
      <div class="stats">
        <span v-if="item.like_count" :class="{ 'done' : item.liked }">
          <i class="iconfont icon-guanzhu"></i>
          {{ $utils.shortenNumber(item.like_count) }}
        </span>
        <span v-if="item.mark_count" :class="{ 'done' : item.marked }">
          <i class="iconfont icon-shoucang"></i>
          {{ $utils.shortenNumber(item.mark_count) }}
        </span>
        <span v-if="item.comment_count" :class="{ 'done' : item.commented }">
          <i class="iconfont icon-pinglun1"></i>
          {{ $utils.shortenNumber(item.comment_count) }}
        </span>
        <span>
          <i class="iconfont icon-yuedu"></i>
          {{ $utils.shortenNumber(item.view_count) }}
        </span>
      </div>
    </div>
    <div class="hr"></div>
  </li>
</template>

<script>
  export default {
    name: 'v-post-item',
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

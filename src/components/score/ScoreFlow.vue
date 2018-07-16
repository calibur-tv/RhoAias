<style lang="scss">
  .score-flow {
    padding-bottom: 10px;
    padding-top: $container-padding;

    &:not(:last-child) {
      border-bottom: 1px solid #f4f5f7;
    }

    .header {
      margin-bottom: 10px;

      .created-at {
        float: right;
        color: #99a2aa;
        font-size: 12px;
        line-height: 30px;
      }

      .about {
        overflow: hidden;

        .user-avatar,
        .bangumi-avatar {
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
          line-height: 30px;
        }

        .user-avatar {
          @include avatar-2(25px);
        }

        .bangumi-avatar {
          width: 25px;
          height: 25px;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 3px;
            border: 1px solid #e5e9ef;
          }
        }

        .name {
          line-height: 30px;
          font-size: 12px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
        }
      }

      .el-rate {
        display: inline-block;
        vertical-align: middle;
        height: 23px;
      }
    }

    .intro {
      display: block;
      font-size: 14px;
      @include twoline(22px);
    }

    .footer {
      margin-top: 10px;
      line-height: 16px;
      font-size: 13px;
      color: #99a2aa;
      text-align: right;

      span {
        width: 40px;
        display: inline-block;
      }
    }
  }
</style>

<template>
  <div class="score-flow">
    <div class="header">
      <v-time
        v-model="item.created_at"
        class="created-at"
      />
      <div
        class="about"
      >
        <a
          v-if="pageName !== 'user-show'"
          :href="$alias.user(item.user.zone)"
        >
          <div class="user-avatar">
            <img :src="$resize(item.user.avatar, { width: 50 })">
          </div>
          <span
            class="name"
            v-text="item.user.nickname"
          />
        </a>
        <a
          v-if="pageName !== 'bangumi-show'"
          :href="$alias.bangumi(item.bangumi.id)"
        >
          <div class="bangumi-avatar">
            <img :src="$resize(item.bangumi.avatar, { width: 50 })">
          </div>
          <span
            class="name"
            v-text="item.bangumi.name"
          />
        </a>
        <el-rate
          v-model="starCount"
          disabled
        />
      </div>
    </div>
    <a
      :href="$alias.score(item.id)"
      class="intro"
      v-text="item.intro"
    />
    <div class="footer">
      <span>
        <i class="iconfont icon-guanzhu"/>
        {{ item.like_count }}
      </span>
      <span>
        <i class="iconfont icon-pinglun1"/>
        {{ item.comment_count }}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ScoreFlow',
    props: {
      item: {
        required: true,
        type: Object
      }
    },
    computed: {
      pageName () {
        return this.$route.name
      },
      starCount () {
        return this.item.total / 2
      }
    }
  }
</script>

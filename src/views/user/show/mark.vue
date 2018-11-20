<style lang="scss">
#user-mark {
  .label {
    font-size: 0;

    button {
      display: inline-block;
      width: 20%;
      height: 40px;
      font-size: 13px;
      background-color: #fff;
      color: $color-text-normal;
    }

    .active {
      background-color: $color-gray-normal;
    }
  }

  .user-mark-view {
    padding-left: $container-padding;
    padding-right: $container-padding;
  }

  .posts {
    .deleted {
      text-decoration: line-through;
      cursor: default;
    }

    li {
      margin-top: 10px;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #eee;
    }
  }

  .images {
    width: 290px;
    margin: 0 auto;
    @extend %clearfix;

    li {
      position: relative;
      margin-top: 10px;
      width: 140px;
      float: left;
      box-shadow: 0 1px 3px 0 rgba(80, 80, 80, 0.11);
      border-radius: 4px;
      overflow: hidden;

      .delete-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        font-size: 14px;
        text-align: center;
        line-height: 180px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.4);
      }

      img {
        display: block;
        transition: 0.3s;
        transform-origin: center;
      }

      &:hover {
        img {
          transform: scale(1.1);
        }
      }

      &:nth-of-type(odd) {
        margin-right: 10px;
      }
    }
  }

  .answers {
    .deleted {
      text-decoration: line-through;
      cursor: default;
    }

    li {
      margin-top: 10px;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #eee;
      @include twoline(20px);
    }
  }

  .scores {
    .deleted {
      text-decoration: line-through;
      cursor: default;
    }

    li {
      margin-top: 10px;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #eee;

      a {
        font-weight: 500;
      }

      p {
        margin-top: 10px;
        color: #999999;
      }
    }
  }

  .videos {
    li {
      margin-top: 10px;
    }

    a {
      display: block;
      @extend %clearfix;
    }

    .poster {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      display: block;
      margin-right: 10px;
      float: left;

      .delete-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        font-size: 14px;
        text-align: center;
        line-height: 80px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.4);
      }
    }

    .text {
      overflow: hidden;
      line-height: 20px;
      font-size: 12px;
    }
  }
}
</style>

<template>
  <div id="user-mark">
    <header class="label">
      <button
        :class="{ active: type === 'post' }"
        @click="switchTab('post')"
      >帖子</button>
      <button
        :class="{ active: type === 'image' }"
        @click="switchTab('image')"
      >相册</button>
      <button
        :class="{ active: type === 'answer' }"
        @click="switchTab('answer')"
      >答案</button>
      <button
        :class="{ active: type === 'score' }"
        @click="switchTab('score')"
      >漫评</button>
      <button
        :class="{ active: type === 'video' }"
        @click="switchTab('video')"
      >视频</button>
    </header>
    <main class="user-mark-view">
      <template v-if="type === 'post'">
        <ul class="posts">
          <li
            v-for="item in source.list"
            :key="item.id"
          >
            <a
              :href="item.deleted_at ? 'javascript:;' : $alias.post(item.id)"
              :class="[ item.deleted_at ? 'deleted' : 'blue-link' ]"
              v-text="item.title"
            />
          </li>
        </ul>
      </template>
      <template v-else-if="type === 'image'">
        <ul class="images">
          <li
            v-for="item in source.list"
            :key="item.id"
          >
            <a
              :href="item.deleted_at ? 'javascript:;' : $alias.image(item.id)"
            >
              <v-img
                :src="item.url"
                :width="140"
                :height="180"
              />
              <div
                v-if="item.deleted_at"
                class="delete-mask"
              >该相册已删除</div>
            </a>
          </li>
        </ul>
      </template>
      <template v-else-if="type === 'answer'">
        <ul class="answers">
          <li
            v-for="item in source.list"
            :key="item.id"
          >
            <a
              :href="item.deleted_at ? 'javascript:;' : $alias.answer(item.id)"
              :class="[ item.deleted_at ? 'deleted' : 'blue-link' ]"
              v-text="item.intro || '[图片]'"
            />
          </li>
        </ul>
      </template>
      <template v-else-if="type === 'score'">
        <ul class="scores">
          <li
            v-for="item in source.list"
            :key="item.id"
          >
            <a
              :href="item.deleted_at ? 'javascript:;' : $alias.score(item.id)"
              :class="[ item.deleted_at ? 'deleted' : 'blue-link' ]"
              v-text="item.title"
            />
            <p v-text="item.intro || '[图片]'"/>
          </li>
        </ul>
      </template>
      <template v-else-if="type === 'video'">
        <ul class="videos">
          <li
            v-for="item in source.list"
            :key="item.id"
          >
            <a
              :href="item.deleted_at ? 'javascript:;' : $alias.video(item.id)"
            >
              <div class="poster">
                <v-img
                  :src="item.poster"
                  :width="120"
                  :height="80"
                />
                <div
                  v-if="item.deleted_at"
                  class="delete-mask"
                >
                  视频已失效
                </div>
              </div>
              <p
                class="name"
                v-text="item.name"
              />
            </a>
          </li>
        </ul>
      </template>
      <more-btn
        :no-more="source.noMore"
        :loading="source.loading"
        :length="source.list.length"
        :auto="true"
        @fetch="loadMore"
      />
    </main>
  </div>
</template>

<script>
export default {
  name: 'UserMark',
  async asyncData({ store, ctx }) {
    await store.dispatch('users/getBookmarks', {
      ctx,
      type: 'post',
      init: true
    })
  },
  data() {
    return {
      type: 'post'
    }
  },
  computed: {
    source() {
      return this.$store.state.users.bookmark[this.type]
    },
    isMe() {
      return this.$store.state.login
        ? this.user.zone === this.$route.params.zone
        : false
    }
  },
  mounted() {
    if (!this.isMe) {
      this.$router.replace({
        name: 'user-bangumi'
      })
    }
  },
  methods: {
    switchTab(value) {
      this.type = value
      this.getData(true)
    },
    loadMore() {
      this.getData(false)
    },
    async getData(init) {
      try {
        await this.$store.dispatch('users/getBookmarks', {
          type: this.type,
          init,
          ctx: this
        })
      } catch (e) {
        this.$toast.error(e)
      }
    }
  }
}
</script>

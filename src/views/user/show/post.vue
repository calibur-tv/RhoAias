<style lang="scss">
#user-post {
  .label {
    font-size: 0;

    button {
      display: inline-block;
      width: 50%;
      height: 40px;
      font-size: 13px;
      background-color: $color-gray-light;
      color: $color-text-normal;
    }

    .active {
      background-color: $color-gray-normal;
    }
  }

  #posts-of-reply {
    background-color: #ffffff;

    li {
      float: none;
      padding: 10px;
      position: relative;
      @include border-bottom();

      .header {
        position: relative;
        height: 32px;
        line-height: 32px;

        .time {
          float: right;
          display: block;
          color: #999;
          font-size: 12px;
          position: relative;
          z-index: 1;
          margin-right: 12px;
        }
      }

      .origin {
        display: block;
        background-color: $color-gray-normal;
        padding: 10px 20px;
        margin: 10px 0;
        border-radius: 5px;
      }

      .reply {
        display: block;
        border-left: 5px solid $color-gray-normal;
        margin: 10px 0;
        padding-left: 10px;
      }

      .content {
        margin-top: 3px;
        color: #666;
        font-size: 12px;
        line-height: 22px;
        max-height: 44px;
        overflow: hidden;
      }

      .images {
        margin-bottom: 5px;

        .poster-image {
          border-radius: 5px;
          overflow: hidden;

          img {
            height: auto;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .image-list {
          .image {
            float: left;

            &:not(:last-child) {
              margin-right: 2%;
            }
          }
        }
      }

      .footer {
        color: #a3a8ad;
        font-size: 12px;
        line-height: 24px;

        span {
          margin: 0 5px;
        }
      }
    }
  }
}
</style>

<template>
  <div id="user-post">
    <div class="label">
      <button
        :class="{ active: active === 0 }"
        @click="switchTab(0)"
      >发帖</button>
      <button
        :class="{ active: active === 1 }"
        @click="switchTab(1)"
      >回帖</button>
    </div>
    <post-flow-list
      v-if="active === 0"
      :user-zone="zone"
    />
    <div v-else-if="active === 1">
      <ul id="posts-of-reply">
        <li
          v-for="item in list"
          :key="item.id"
        >
          <a
            :href="$alias.post(item.post.id)"
            class="header"
            v-text="item.post.title"/>
          <a
            :href="$alias.post(item.post.id, { comment: item.post.id })"
            class="origin">
            <div
              class="content"
              v-html="item.post.content"/>
            <div
              v-if="item.post.images.length"
              class="images clearfix">
              <v-img
                v-if="item.post.images.length === 1"
                :src="item.post.images[0].url"
                width="100%"
                height="190"
                class="poster-image"
              />
              <div
                v-else
                class="image-list">
                <v-img
                  v-for="(image, index) in imageFilter(item.post.images)"
                  :key="index"
                  :src="image.url"
                  class="image"
                  width="32%"
                  height="93"
                />
              </div>
            </div>
          </a>
          <a
            :href="$alias.post(item.post.id, { comment: item.post.id, reply: item.id })"
            class="reply">
            <div
              class="content"
              v-html="item.content"/>
            <div
              v-if="item.images.length"
              class="images clearfix">
              <v-img
                v-if="item.images.length === 1"
                :src="item.images[0].url"
                width="100%"
                height="190"
                class="poster-image"
              />
              <div
                v-else
                class="image-list">
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
          </a>
          <a
            :href="$alias.bangumi(item.bangumi.id)"
            class="footer">
            回复于
            <span v-text="item.bangumi.name"/>
            <v-time v-model="item.created_at"/>
          </a>
        </li>
      </ul>
      <more-btn
        :no-more="noMore"
        :loading="loading"
        :length="list.length"
        :auto="true"
        @fetch="getUserPosts(false)"
      />
    </div>
  </div>
</template>

<script>
import PostFlowList from "~/components/flow/list/PostFlowList";
import Api from "~/api/userApi";

export default {
  name: "UserPost",
  async asyncData({ store, route, ctx }) {
    await store.dispatch("flow/initData", {
      type: "post",
      sort: "news",
      userZone: route.params.zone,
      ctx
    });
  },
  components: {
    PostFlowList
  },
  data() {
    return {
      active: 0,
      list: [],
      loading: false,
      fetched: false,
      noMore: false,
      page: 0
    };
  },
  computed: {
    zone() {
      return this.$route.params.zone;
    }
  },
  methods: {
    switchTab(value) {
      this.active = value;
      if (value === 1) {
        this.getUserPosts(true);
      }
    },
    async getUserPosts(init = false) {
      if (init && this.fetched) {
        return;
      }
      if (this.loading || this.noMore) {
        return;
      }
      this.loading = true;
      const api = new Api(this);
      try {
        const data = await api.replyPosts({
          take: 10,
          page: this.page,
          zone: this.zone
        });
        this.fetched = true;
        this.list = this.list.concat(data.list);
        this.noMore = data.noMore;
        this.page++;
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loading = false;
      }
    },
    imageFilter(images) {
      return images.slice(0, 3);
    }
  }
};
</script>

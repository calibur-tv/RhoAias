<style lang="scss">
#user-post {
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
        background-color: $color-background-tag;
        padding: 10px 20px;
        margin: 10px 0;
        border-radius: 5px;
      }

      .reply {
        display: block;
        border-left: 5px solid $color-line;
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
    <header class="tab-header">
      <el-radio-group v-model="active" size="mini" @change="switchTab">
        <el-radio-button label="发帖" />
        <el-radio-button label="回帖" />
      </el-radio-group>
    </header>
    <FlowList
      v-show="active === '发帖'"
      :id="zone"
      func="getUserPost"
      type="page"
      sort="news"
    >
      <ul slot-scope="{ flow }">
        <PostFlowItem
          v-for="item in flow"
          :key="item.id"
          :user-zone="zone"
          :item="item"
          bangumi-id=""
        />
      </ul>
    </FlowList>
    <FlowList
      v-show="active === '回帖'"
      :id="zone"
      func="getUserPostReply"
      type="page"
      sort="news"
    >
      <ul id="posts-of-reply" slot-scope="{ flow }">
        <li v-for="item in flow" :key="item.id">
          <nuxt-link
            :to="$alias.post(item.post.id)"
            class="header"
            v-text="item.post.title"
          />
          <nuxt-link
            :to="$alias.post(item.post.id, { comment: item.post.id })"
            class="origin"
          >
            <div class="content" v-html="item.post.content" />
            <div v-if="item.post.images.length" class="images clearfix">
              <v-img
                v-if="item.post.images.length === 1"
                :src="item.post.images[0].url"
                width="100%"
                height="190"
                class="poster-image"
              />
              <div v-else class="image-list">
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
          </nuxt-link>
          <nuxt-link
            :to="
              $alias.post(item.post.id, {
                comment: item.post.id,
                reply: item.id
              })
            "
            class="reply"
          >
            <div class="content" v-html="item.content" />
            <div v-if="item.images.length" class="images clearfix">
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
          </nuxt-link>
          <nuxt-link :to="$alias.bangumi(item.bangumi.id)" class="footer">
            回复于
            <span v-text="item.bangumi.name" />
            <v-time v-model="item.created_at" />
          </nuxt-link>
        </li>
      </ul>
    </FlowList>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import PostFlowItem from '~/components/flow/item/PostFlowItem'
export default {
  name: 'UserPost',
  components: {
    FlowList,
    PostFlowItem
  },
  props: {
    zone: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      active: '回帖'
    }
  },
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getUserPostReply',
      sort: 'news',
      type: 'page',
      id: params.zone
    })
  },
  methods: {
    switchTab(value) {
      if (value === '回帖') {
        this.$store.dispatch('flow/initData', {
          func: 'getUserPostReply',
          sort: 'news',
          type: 'page',
          id: this.zone
        })
      } else {
        this.$store.dispatch('flow/initData', {
          func: 'getUserPost',
          sort: 'news',
          type: 'page',
          id: this.zone
        })
      }
      this.active = value
    },
    imageFilter(images) {
      return images.slice(0, 3)
    }
  }
}
</script>

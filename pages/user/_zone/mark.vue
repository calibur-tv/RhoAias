<style lang="scss">
#user-mark {
  padding-bottom: 15px;
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
    <header class="tab-header">
      <el-radio-group v-model="active" size="mini" @change="switchTab">
        <el-radio-button
          v-for="item in nav"
          :key="item.type"
          :label="item.label"
        />
      </el-radio-group>
    </header>
    <main class="user-mark-view">
      <flow-list
        v-if="type === 'post'"
        :display-no-more="false"
        func="getUserBookmarks"
        type="page"
        sort="post"
      >
        <ul slot-scope="{ flow }" class="posts">
          <li v-for="item in flow" :key="item.id">
            <a
              :href="item.deleted_at ? 'javascript:;' : $alias.post(item.id)"
              :class="[item.deleted_at ? 'deleted' : 'blue-link']"
              v-text="item.title"
            />
          </li>
        </ul>
      </flow-list>
      <flow-list
        v-if="type === 'image'"
        :display-no-more="false"
        func="getUserBookmarks"
        type="page"
        sort="image"
      >
        <ul slot-scope="{ flow }" class="images">
          <li v-for="item in flow" :key="item.id">
            <a :href="item.deleted_at ? 'javascript:;' : $alias.image(item.id)">
              <v-img :src="item.url" :width="140" :height="180" />
              <div v-if="item.deleted_at" class="delete-mask">该相册已删除</div>
            </a>
          </li>
        </ul>
      </flow-list>
      <flow-list
        v-else-if="type === 'answer'"
        :display-no-more="false"
        func="getUserBookmarks"
        type="page"
        sort="answer"
      >
        <ul slot-scope="{ flow }" class="answers">
          <li v-for="item in flow" :key="item.id">
            <a
              :href="item.deleted_at ? 'javascript:;' : $alias.answer(item.id)"
              :class="[item.deleted_at ? 'deleted' : 'blue-link']"
              v-text="item.intro || '[图片]'"
            />
          </li>
        </ul>
      </flow-list>
      <flow-list
        v-else-if="type === 'score'"
        :display-no-more="false"
        func="getUserBookmarks"
        type="page"
        sort="score"
      >
        <ul slot-scope="{ flow }" class="scores">
          <li v-for="item in flow" :key="item.id">
            <a
              :href="item.deleted_at ? 'javascript:;' : $alias.score(item.id)"
              :class="[item.deleted_at ? 'deleted' : 'blue-link']"
              v-text="item.title"
            />
            <p v-text="item.intro || '[图片]'" />
          </li>
        </ul>
      </flow-list>
      <flow-list
        v-else-if="type === 'video'"
        :display-no-more="false"
        func="getUserBookmarks"
        type="page"
        sort="video"
      >
        <ul slot-scope="{ flow }" class="videos">
          <li v-for="item in flow" :key="item.id">
            <a :href="item.deleted_at ? 'javascript:;' : $alias.video(item.id)">
              <div class="poster">
                <v-img :src="item.poster" :width="120" :height="80" />
                <div v-if="item.deleted_at" class="delete-mask">
                  视频已失效
                </div>
              </div>
              <p class="name" v-text="item.name" />
            </a>
          </li>
        </ul>
      </flow-list>
    </main>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'

export default {
  name: 'UserMark',
  components: {
    FlowList
  },
  data() {
    return {
      active: '帖子',
      nav: [
        {
          label: '帖子',
          type: 'post'
        },
        {
          label: '相册',
          type: 'image'
        },
        {
          label: '答案',
          type: 'answer'
        },
        {
          label: '漫评',
          type: 'score'
        },
        {
          label: '视频',
          type: 'video'
        }
      ],
      type: 'post'
    }
  },
  async asyncData({ store }) {
    await store.dispatch('flow/initData', {
      func: 'getUserBookmarks',
      type: 'page',
      sort: 'post',
      count: 9999
    })
  },
  methods: {
    switchTab(label) {
      let type = ''
      this.nav.forEach(item => {
        if (item.label === label) {
          type = item.type
        }
      })
      this.getData(type)
    },
    getData(sort) {
      this.$store.dispatch('flow/initData', {
        func: 'getUserBookmarks',
        type: 'page',
        sort,
        count: 9999
      })
      this.type = sort
    }
  }
}
</script>

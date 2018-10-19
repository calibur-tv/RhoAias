<style lang="scss">
#image-album {
  .album-header {
    margin-top: $container-padding;
    margin-bottom: $container-padding;

    .title {
      font-size: 20px;
      margin-bottom: 15px;
    }

    .user {
      font-size: 13px;

      .author {
        .avatar {
          vertical-align: middle;
          display: inline-block;
          border: 1px solid $color-gray-normal;
        }
      }

      .tool-btn {
        float: right;
        line-height: 30px;
      }
    }
  }

  .album-body {
    background-color: #fff;

    .images-wrap {
      .image-package {
        position: relative;
        margin-bottom: 4px;
      }
    }

    .no-image {
      text-align: center;
      padding-top: 30px;
      padding-bottom: 20px;
      color: $color-text-normal;
      font-size: 13px;
    }

    .cartoon-list {
      margin-top: 20px;
      position: relative;

      .sub-title {
        margin-left: 10px;

        .next {
          float: right;
          font-size: 13px;
          margin-right: 10px;
          margin-left: 15px;
          color: $color-text-normal;
        }

        .more {
          float: right;
          font-size: 13px;
          margin-right: 10px;
          margin-left: 15px;
          color: $color-text-normal;
        }
      }

      li {
        width: 50%;
        display: inline-block;
        text-align: center;
        margin-bottom: 7px;
        padding: 0 5px;

        a {
          border: 1px solid $color-gray-deep;
          height: 30px;
          color: $color-link;
          border-radius: 4px;
          display: block;
          font-size: 12px;
          line-height: 28px;

          &.active {
            border-color: $color-blue-light;
            background-color: $color-blue-light;
            color: $color-white;
          }
        }
      }
    }

    .reward-panel {
      text-align: center;
      margin-top: 30px;
      margin-bottom: 30px;

      button {
        margin: 0 5px;
        font-size: 13px;

        i {
          font-size: 12px;
          line-height: 16px;
        }
      }

      .album-rewarded-btn {
        @include btn-empty(#eb9e05);
      }

      .album-reward-btn {
        @include btn-empty(#ffffff, #eb9e05);
      }

      .album-liked-btn {
        @include btn-empty(#fa5555);
      }

      .album-like-btn {
        @include btn-empty(#ffffff, #fa5555);
      }
    }
  }

  .album-footer {
    .bangumi-panel {
      padding-top: $container-padding;
      padding-bottom: $container-padding;

      .summary {
        font-size: 12px;
        color: #666;
        @include twoline(13px);
      }
    }
  }
}
</style>

<template>
  <div id="image-album">
    <div class="container">
      <div class="album-header">
        <h1 class="title oneline">
          [{{ info.is_creator ? '原创' : '转载' }}]
          [{{ info.is_cartoon ? '漫画' : '相册' }}]
          {{ info.name }}
        </h1>
        <div class="user">
          <a
            :href="$alias.user(user.zone)"
            class="author">
            <v-img
              :src="user.avatar"
              :avatar="true"
              size="30"
              class="avatar"
            />
            {{ user.nickname }}
          </a>
          ·
          <v-time v-model="info.created_at"/>
          <v-popover
            :report-id="info.id"
            :is-creator="info.is_creator"
            report-type="image"
          >
            <button class="tool-btn">···</button>
          </v-popover>
        </div>
      </div>
    </div>
    <div class="album-body">
      <image-preview
        v-if="info.is_album"
        :images="images"
        class="images-wrap">
        <div
          v-for="img in images"
          :key="img.id"
          class="image-package"
        >
          <v-img
            :src="img.url"
            :full="true"
            :width="img.width"
            :height="img.height"
            class="image"
          />
        </div>
        <p
          v-if="!info.image_count"
          class="no-image"
        >
          还没有上传图片
        </p>
      </image-preview>
      <image-preview
        v-else
        :images="[source]"
      >
        <div class="image-package">
          <v-img
            :src="source.url"
            :width="source.width"
            :height="source.height"
            :full="true"
            class="image"
          />
        </div>
      </image-preview>
      <div 
        v-if="info.is_cartoon" 
        class="cartoon-list">
        <h3 class="sub-title">
          选集（{{ cartoon.length }}）
          <a 
            v-if="nextPartUrl" 
            :href="nextPartUrl" 
            class="next">下一话</a>
          <div 
            v-if="showMoreBtn" 
            class="more" 
            @click="showAll = !showAll">{{ showAll ? '收起' : '展开' }}</div>
        </h3>
        <ul>
          <li
            v-for="item in sortCartoons"
            :key="item.id"
          >
            <a
              :href="$alias.image(item.id)"
              :class="{ 'active': item.id === id }"
              class="oneline"
              v-text="item.name"
            />
          </li>
        </ul>
      </div>
      <div class="container">
        <social-panel
          :id="info.id"
          :is-creator="info.is_creator"
          :user-id="user.id"
          :liked="info.liked"
          :marked="info.marked"
          :rewarded="info.rewarded"
          :like-users="info.like_users"
          :reward-users="info.reward_users"
          :mark-users="info.mark_users"
          type="image"
        />
      </div>
    </div>
    <div class="container">
      <comment-main
        :id="id"
        :master-id="user.id"
        type="image"
      />
      <div class="hr"/>
      <div class="album-footer">
        <div class="bangumi-panel">
          <h3 class="sub-title">所属番剧：</h3>
          <v-bangumi-panel
            :id="bangumi.id"
            :avatar="bangumi.avatar"
            :name="bangumi.name"
            :followed="bangumi.followed"
            @follow="handleBangumiFollow"
          >
            <p 
              class="summary" 
              v-text="bangumi.summary"/>
          </v-bangumi-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "~/api/imageApi";
import CommentMain from "~/components/comments/CommentMain";
import SocialPanel from "~/components/common/SocialPanel";
import ImagePreview from "~/components/common/ImagePreview/ImagePreview";

export default {
  name: "ImageAlbum",
  async asyncData({ store, route, ctx }) {
    const id = route.params.id;
    await Promise.all([
      store.dispatch("image/show", { ctx, id }),
      store.dispatch("comment/getMainComments", {
        ctx,
        id,
        type: "image",
        seeReplyId: route.query["comment-id"]
      })
    ]);
  },
  head() {
    return {
      title: this.info.name
    };
  },
  components: {
    CommentMain,
    SocialPanel,
    ImagePreview
  },
  data() {
    return {
      take: 4,
      page: 0,
      part: 0,
      showAll: false
    };
  },
  computed: {
    id() {
      return +this.$route.params.id;
    },
    info() {
      return this.$store.state.image.show;
    },
    source() {
      return this.info.source;
    },
    images() {
      return this.info.images;
    },
    cartoon() {
      return this.info.parts;
    },
    user() {
      return this.info.user;
    },
    bangumi() {
      return this.info.bangumi;
    },
    likeAlbumBtnText() {
      const text = this.info.is_creator
        ? this.info.liked
          ? "已赞赏"
          : "赞赏"
        : this.info.liked
          ? "已喜欢"
          : "喜欢";

      return this.info.like_count ? `${text}(${this.info.like_count})` : text;
    },
    isMine() {
      return this.$store.state.login
        ? this.user.id === this.$store.state.user.id
        : false;
    },
    showMoreBtn() {
      return this.take < this.cartoon.length;
    },
    sortCartoons() {
      const begin = (this.page - 1) * this.take;
      return this.showAll
        ? this.cartoon
        : this.cartoon.slice(begin, begin + this.take);
    },
    nextPartUrl() {
      if (!this.info.is_cartoon || !this.cartoon.length) {
        return "";
      }
      let index = 0;
      this.cartoon.forEach((item, idx) => {
        if (item.id === this.id) {
          index = idx;
        }
      });
      if (index >= this.cartoon.length - 1) {
        return "";
      }
      return this.$alias.image(this.cartoon[index + 1].id);
    }
  },
  mounted() {
    this.computePage();
  },
  methods: {
    handleBangumiFollow(result) {
      this.$store.commit("image/FOLLOW_ALBUM_BANGUMI", { result });
    },
    computePage() {
      if (!this.info.is_cartoon) {
        return;
      }
      this.cartoon.forEach((meta, index) => {
        if (meta.id === this.id) {
          this.part = index + 1;
        }
      });
      this.page = Math.ceil(this.part / this.take);
    },
    toggleLike() {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (this.isMine) {
        this.$toast.error("不能为自己的相册点赞");
        return;
      }
      if (this.loadingFollowAlbum) {
        return;
      }
      this.loadingFollowAlbum = true;
      if (this.info.is_creator && !this.info.liked) {
        this.$confirm("原创相册点赞需要金币, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.submitLikeRequest();
          })
          .catch(() => {});
        return;
      }
      this.submitLikeRequest();
    },
    async submitLikeRequest() {
      const api = new Api(this);
      try {
        const result = await api.toggleLike({
          id: this.id
        });
        this.$store.commit("image/ALBUM_LIKE", { result });
        this.$toast.success("操作成功");
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingFollowAlbum = false;
      }
    }
  }
};
</script>

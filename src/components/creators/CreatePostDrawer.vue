<style lang="scss">
.post-write-drawer {
  text-align: left;
  line-height: 40px;

  .title {
    font-size: 16px;
    color: #000;
    line-height: 20px;
  }

  .field-item {
    font-size: 16px;

    > span {
      color: #666;
      float: left;
    }

    > div {
      color: #000;
      overflow: hidden;
    }

    .mint-switch {
      height: 40px;
    }
  }

  .tags {
    span {
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
  }

  .content {
    font-size: 16px;
    line-height: 24px;
    color: #000;
    font-weight: 400;
    height: 120px;
    padding-top: 10px;
  }

  .el-upload-list__item,
  .el-upload--picture-card {
    width: 15vw;
    height: 15vw;
    line-height: 15vw;
  }

  .btn-submit {
    margin-top: 15px;
  }
}
</style>

<template>
  <v-drawer
    v-model="open"
    header-text="发帖"
    class="post-write-drawer"
    from="right"
    size="100%"
  >
    <div class="container">
      <input
        v-model.trim="title"
        class="title"
        type="text"
        maxlength="40"
        placeholder="加个标题哟~"
      >
      <div class="field-item">
        <span>番剧：</span>
        <bangumi-picker
          v-model="bangumiId"
          :label="false"
          :display="open"
        />
      </div>
      <div class="field-item">
        <span>原创：</span>
        <mt-switch v-model="is_creator"/>
      </div>
      <div class="field-item">
        <span>标签：</span>
        <div
          class="tags"
          @click="openPostTagSelectDrawer = true"
        >
          <template v-if="selectedTags.length">
            <span
              v-for="tag in displayTags"
              :key="tag.id"
              v-text="tag.name"
            />
          </template>
          <template v-else>
            点击选择标签
          </template>
        </div>
      </div>
      <textarea
        v-model.trim="content"
        placeholder="来吧，尽情的（在1000字以内）发挥吧"
        class="content"
        maxlength="1000"
      />
      <image-uploader
        :loading="submitting"
        :limit="exceed"
        :required="false"
        @submit="submit"
      />
    </div>
    <v-drawer
      v-model="openPostTagSelectDrawer"
      header-text="选择标签"
      submit-text="确认"
      from="bottom"
      size="70%"
    >
      <v-checklist
        v-model="selectedTags"
        :options="tags"
        :max="3"
      />
    </v-drawer>
  </v-drawer>
</template>

<script>
import BangumiPicker from "~/components/bangumi/BangumiPicker";
import ImageUploader from "~/components/common/ImageUploader";
import { Switch } from "mint-ui";
import PostApi from "~/api/postApi";
import VChecklist from "~/components/common/CheckList";

export default {
  name: "CreatePostDrawer",
  components: {
    VChecklist,
    BangumiPicker,
    ImageUploader,
    "mt-switch": Switch
  },
  data() {
    return {
      open: false,
      exceed: 4,
      content: "",
      title: "",
      bangumiId: "",
      tags: [],
      selectedTags: [],
      is_creator: false,
      submitting: false,
      openPostTagSelectDrawer: false
    };
  },
  computed: {
    displayTags() {
      return this.selectedTags.map(_ => {
        return {
          id: _,
          name: this.tags.filter(a => a.value === _)[0]["label"]
        };
      });
    }
  },
  mounted() {
    this.$channel.$on("drawer-open-write-post", () => {
      this.open = true;
      this.getPostTags();
    });
  },
  methods: {
    submit(images) {
      if (this.submitting) {
        return;
      }
      if (!this.content) {
        this.$toast.error("内容不能为空！");
        return;
      }
      if (!this.title) {
        this.$toast.error("标题不能为空！");
        return;
      }
      if (!this.bangumiId) {
        this.$toast.error("请选择要投稿的番剧！");
        return;
      }
      this.submitting = true;
      this.$toast.loading("加载中");
      this.$captcha({
        success: async ({ data }) => {
          try {
            const api = new PostApi(this);
            const result = await api.create({
              title: this.title,
              bangumiId: this.bangumiId,
              desc: this.content.substring(0, 120),
              content: this.content,
              is_creator: this.is_creator,
              tags: this.selectedTags,
              geetest: data,
              images
            });
            this.title = "";
            this.content = "";
            this.$channel.$emit("image-upload-done");
            this.open = false;
            this.$store.commit("UPDATE_USER_EXP", result.exp);
            this.$toast.success(result.message).then(() => {
              window.location = this.$alias.post(result.data);
            });
          } catch (err) {
            this.$toast.error(err);
          } finally {
            this.submitting = false;
          }
        },
        ready: () => {
          this.$toast.stop();
        },
        error: e => {
          this.$toast.error(e);
          this.submitting = false;
        },
        close: () => {
          this.submitting = false;
        }
      });
    },
    async getPostTags() {
      if (this.tags.length) {
        return;
      }
      try {
        const list = JSON.parse(sessionStorage.getItem("cache-post-tags"));
        if (list) {
          this.tags = list;
          return;
        }
      } catch (e) {}
      const api = new PostApi(this);
      try {
        const tags = await api.tags();
        this.tags = tags.map(_ => {
          return {
            label: _.name,
            value: _.id
          };
        });
        sessionStorage.setItem("cache-post-tags", JSON.stringify(this.tags));
      } catch (e) {}
    }
  }
};
</script>

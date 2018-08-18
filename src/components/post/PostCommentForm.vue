<style lang="scss">
.post-comment-form {
  .content {
    font-size: 16px;
    line-height: 24px;
    color: #000;
    font-weight: 400;
    height: 250px;
    margin-bottom: 5px;
  }

  .el-upload-list__item,
  .el-upload--picture-card {
    width: 15vw;
    height: 15vw;
    line-height: 15vw;
  }

  .el-upload-list__item-delete {
    float: none !important;
  }

  .submit-btn {
    margin-top: 15px;
    width: 100%;
  }
}
</style>

<template>
  <div class="post-comment-form">
    <textarea
      v-model.trim="forms.content"
      class="content"
      placeholder="来吧，尽情的（在1000字以内）发挥吧"
      maxlength="1000"
      @focus="handleAreaFocus"
    />
    <el-upload
      ref="uploader"
      :disabled="true"
      :data="uploadHeaders"
      :action="imageUploadAction"
      :accept="imageUploadAccept"
      :on-error="handleImageUploadError"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :limit="exceed"
      :before-upload="beforeUpload"
      multiple
      list-type="picture-card"
    >
      +
    </el-upload>
    <el-button 
      :loading="submitting" 
      class="submit-btn" 
      type="primary" 
      @click="submit">发布</el-button>
  </div>
</template>

<script>
import uploadMixin from "~/mixins/upload";

export default {
  name: "PostCommentForm",
  mixins: [uploadMixin],
  props: {
    type: {
      required: true,
      type: String
    },
    id: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      forms: {
        content: ""
      },
      images: [],
      exceed: 5
    };
  },
  computed: {
    isGuest() {
      return !this.$store.state.login;
    },
    formatContent() {
      let content = this.forms.content;
      while (content.match("\n\n\n") !== null) {
        content = content.replace(/\n\n\n/g, "\n\n");
      }
      content = content.split("\n");

      const res = [];
      content.forEach(item => {
        res.push(item ? `<p>${item}</p>` : "<p><br/></p>");
      });

      return res.join("");
    },
    formatImages() {
      return this.images.map(item => item.img);
    },
    submitting() {
      return this.$store.state.comment.submitting;
    }
  },
  mounted() {
    if (!this.isGuest) {
      this.getUpToken();
    }
  },
  methods: {
    async submit() {
      if (this.isGuest) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (!this.formatContent) {
        this.$emit("close");
        return;
      }
      if (this.submitting) {
        return;
      }
      this.$store.commit("comment/SET_SUBMITTING", { result: true });
      try {
        const newComment = await this.$store.dispatch(
          "comment/createMainComment",
          {
            content: this.formatContent,
            images: this.formatImages,
            type: this.type,
            id: this.id,
            ctx: this
          }
        );
        this.$emit("close");
        this.forms = {
          content: ""
        };
        this.images = [];
        this.$refs.uploader.clearFiles();
        this.$toast.success("评论成功");
        setTimeout(() => {
          const dom = document.getElementById(`comment-${newComment.id}`);
          dom && this.$scrollToY(this.$utils.getOffsetTop(dom) - 100, 600);
        }, 400);
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.$store.commit("comment/SET_SUBMITTING", { result: false });
      }
    },
    handleRemove(file) {
      this.images.forEach((item, index) => {
        if (item.id === file.uid) {
          this.images.splice(index, 1);
        }
      });
    },
    handleSuccess(res, file) {
      this.images.push({
        id: file.uid,
        img: res.data
      });
    },
    handleExceed() {
      this.$toast.error(`最多可上传 ${this.exceed} 张图片!`);
    },
    beforeUpload(file) {
      if (this.isGuest) {
        this.$channel.$emit("sign-in");
        return;
      }

      this.uploadConfig.max = 5;
      this.uploadConfig.params = {
        userId: this.$store.state.user.id,
        id: this.id,
        type: "post"
      };

      return this.beforeImageUpload(file);
    },
    handleAreaFocus() {
      document.body.scrollTop = 0;
    }
  }
};
</script>

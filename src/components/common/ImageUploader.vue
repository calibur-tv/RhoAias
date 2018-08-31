<style lang="scss">
.el-upload-list__item,
.el-upload--picture-card {
  width: 15vw !important;
  height: 15vw !important;
}

.el-upload--picture-card {
  line-height: 15vw;
}

.el-upload-list__item-delete {
  float: none !important;
}

.upload-btn {
  width: 100%;
  text-align: center;
  margin-top: 15px;

  span {
    float: none !important;
  }
}
</style>

<template>
  <div>
    <el-upload
      ref="upload"
      :action="imageUploadAction"
      :accept="imageUploadAccept"
      :data="uploadHeaders"
      :disabled="true"
      :multiple="limit > 1"
      :before-upload="handleImageUploadBefore"
      :on-success="handleImageUploadSuccess"
      :on-error="handleImageUploadError"
      :on-remove="handleImageUploadRemove"
      :on-exceed="handleImageUploadExceed"
      :file-list="uploadImageList"
      :list-type="listType"
    >+</el-upload>
    <el-button
      :loading="!!uploadPending || loading"
      type="primary"
      class="upload-btn"
      @click="handleImageUploadEmit"
    >{{ uploadPending ? '图片上传中...' : '确认提交' }}</el-button>
  </div>
</template>

<script>
import UploadMixin from "~/mixins/upload";

export default {
  name: "ImageUploader",
  mixins: [UploadMixin],
  props: {
    listType: {
      type: String,
      default: "picture-card"
    },
    limit: {
      type: Number,
      default: 1
    },
    loading: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.$channel.$on("image-upload-done", () => {
      this.$refs.upload.clearFiles();
      this.uploadImageList = [];
      this.uploadImageTotal = 0;
    });
  },
  methods: {
    handleImageUploadExceed() {
      this.$toast.error(`最多可上传 ${this.limit} 张图片!`);
    },
    handleImageUploadEmit() {
      if (this.uploadPending) {
        this.$toast.error("等待图片上传完成");
        return;
      }
      if (this.required && !this.uploadImageTotal) {
        this.$toast.error("请先选择图片");
        return;
      }
      const result = this.uploadImageList.map(_ => {
        const temp = _.data;
        return Object.assign(temp, {
          url: temp.key
        });
      });
      this.$emit("submit", this.limit === 1 ? result[0] : result);
    }
  }
};
</script>

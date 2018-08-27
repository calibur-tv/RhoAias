import { cdn } from "env";

export default {
  data() {
    return {
      uploadHeaders: {
        token: "",
        key: ""
      },
      uploadConfig: {
        max: 5,
        pathPrefix: ""
      },
      imageUploadAccept: [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif"
      ].toString(),
      imageUploadAction: "https://upload.qiniup.com",
      imagePrefix: cdn.image,
      uploadPending: 0,
      uploadImageTotal: 0,
      uploadImageList: []
    };
  },
  computed: {
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0;
    },
    currentPath() {
      return this.$route.path;
    }
  },
  mounted() {
    this.$channel.$on("update-upload-token", () => {
      this.uploadHeaders.token = this.$store.state.user.uptoken.upToken;
    });
  },
  methods: {
    handleImageUploadError(err, file) {
      console.log(err);
      this.uploadPending--;
      this.uploadImageList.forEach((item, index) => {
        if (item.id === file.uid) {
          this.uploadImageList.splice(index, 1);
        }
      });
      this.$toast.error(`图片：${file.name} 上传失败`);
    },
    handleImageUploadRemove(file) {
      this.uploadImageList.forEach((item, index) => {
        if (item.id === file.uid) {
          this.uploadImageList.splice(index, 1);
        }
      });
    },
    handleImageUploadSuccess(res, file) {
      this.uploadImageList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.uploadImageList[index] = Object.assign(item, {
            data: res.data,
            status: "success",
            url: this.$resize(res.data.key, { width: 100 })
          });
        }
      });
      this.uploadImageTotal++;
      this.uploadPending--;
    },
    handleImageUploadBefore(file) {
      if (!this.currentUserId) {
        this.$channel.$emit("sign-in");
        return false;
      }

      const isFormat =
        this.imageUploadAccept.split(",").indexOf(file.type) !== -1;
      const isLtSize = file.size / 1024 / 1024 < this.uploadConfig.max;

      if (!isFormat) {
        this.$toast.error("仅支持jpg, jpeg, png, gif格式的图片");
        return false;
      }
      if (!isLtSize) {
        this.$toast.error(`图片大小不能超过 ${this.uploadConfig.max}MB!`);
        return false;
      }

      this.uploadHeaders.key = `user/${this.currentUserId}${this.uploadConfig
        .pathPrefix || this.currentPath}/${new Date().getTime()}-${Math.random()
        .toString(36)
        .substring(3, 6)}.${file.type.split("/").pop()}`;

      this.uploadImageList.push({
        name: file.name,
        percentage: 0,
        raw: file,
        size: file.size,
        status: "uploading",
        uid: file.uid
      });
      this.uploadPending++;

      return true;
    }
  }
};

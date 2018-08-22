<style lang="scss">
.create-image-drawer {
  .field {
    font-size: 16px;
    line-height: 48px;

    span {
      float: left;
    }

    div {
      color: #000;
      overflow: hidden;
    }

    .mint-switch {
      height: 48px;

      .mint-switch-input:checked + .mint-switch-core {
        background-color: $color-blue-light;
      }
    }
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

  .btn-submit {
    margin-top: 15px;
  }
}
</style>

<template>
  <v-drawer
    v-model="show"
    class="create-image-drawer"
    from="bottom"
    size="100%"
    header-text="上传图片"
  >
    <div class="tabs">
      <button 
        :class="{ 'active': sort === 'image' }" 
        @click="switchTab('image')">上传图片</button>
      <button 
        :class="{ 'active': sort === 'album' }" 
        @click="switchTab('album')">新建相册</button>
    </div>
    <div class="container">
      <v-drawer
        v-model="openPickerDrawer"
        :header-text="pickerDrawerHeaderText"
        class="bangumis-drawer"
        from="bottom"
        size="250px"
      >
        <mt-picker
          v-if="openBangumisDrawer"
          :slots="bangumiSlots"
          value-key="name"
          @change="onBangumiValuesChange"
        />
        <mt-picker
          v-else-if="openImageAlbumDrawer"
          :slots="albumSlots"
          value-key="name"
          @change="onAlbumValuesChange"
        />
      </v-drawer>
      <template v-if="sort === 'image'">
        <div class="field">
          <span>单张模式：</span>
          <mt-switch v-model="isSingleModel"/>
        </div>
        <template v-if="isSingleModel">
          <v-field
            v-model="image.name"
            label="名字"
            placeholder="请给图片起个名字"
            label-size="48px"
          />
          <div class="field">
            <span>番剧：</span>
            <div
              @click="handleImageBangumiPickerBtnClick"
              v-text="imageBangumiPlaceholder"
            />
          </div>
          <div class="field">
            <span>原创：</span>
            <mt-switch v-model="image.creator"/>
          </div>
          <div class="field">
            <span>图片：</span>
            <el-upload
              ref="imageUploader"
              :action="imageUploadAction"
              :accept="imageUploadAccept"
              :data="uploadHeaders"
              :disabled="true"
              :on-error="handleImageUploadError"
              :on-remove="handleRemoveImage"
              :on-success="handleImageUploadSuccess"
              :on-exceed="handleExceed"
              :before-upload="beforeImageUpload"
              :file-list="image.data"
              list-type="picture-card"
            >+</el-upload>
          </div>
        </template>
        <template v-else>
          <div class="field">
            <span>相册：</span>
            <div
              @click="handleAlbumPickerBtnClick"
              v-text="imageAlbumPlaceholder"
            />
          </div>
          <div class="field">
            <span>图片：</span>
            <el-upload
              ref="imageUploader"
              :action="imageUploadAction"
              :accept="imageUploadAccept"
              :data="uploadHeaders"
              :disabled="true"
              :on-error="handleImageUploadError"
              :on-remove="handleRemoveImage"
              :on-success="handleImageUploadSuccess"
              :on-exceed="handleExceed"
              :before-upload="beforeImageUpload"
              :file-list="image.data"
              :limit="exceed"
              multiple
              list-type="picture-card"
            >+</el-upload>
          </div>
        </template>
        <button
          class="btn-submit"
          @click="createImage"
        >确认上传</button>
      </template>
      <template v-else-if="sort === 'album'">
        <v-field
          v-model="album.name"
          label="名字"
          placeholder="请填写相册名字"
          label-size="48px"
        />
        <div class="field">
          <span>番剧：</span>
          <div
            @click="handleAlbumBangumiPickerBtnClick"
            v-text="albumBangumiPlaceholder"
          />
        </div>
        <div class="field">
          <span>原创：</span>
          <mt-switch v-model="album.creator"/>
        </div>
        <div class="field">
          <span>封面：</span>
          <el-upload
            ref="albumUploader"
            :action="imageUploadAction"
            :accept="imageUploadAccept"
            :data="uploadHeaders"
            :disabled="true"
            :on-error="handlePosterUploadError"
            :on-success="handleAlbumUploadSuccess"
            :before-upload="beforeUpload"
            :on-remove="handleAlbumPosterRemove"
            :file-list="album.poster"
            list-type="picture-card"
          >+</el-upload>
        </div>
        <button
          class="btn-submit"
          @click="createAlbum"
        >确认</button>
      </template>
    </div>
  </v-drawer>
</template>

<script>
import ImageApi from "~/api/imageApi";
import uploadMixin from "~/mixins/upload";

export default {
  name: "CreateImageDrawer",
  mixins: [uploadMixin],
  data() {
    return {
      show: false,
      sort: "image",
      loadedUserAlbum: false,
      loadingBangumi: false,
      loadingUserAlbum: false,
      openPickerDrawer: false,
      openBangumisDrawer: false,
      openImageAlbumDrawer: false,
      submitting: false,
      bangumiSlots: [
        {
          flex: 1,
          defaultIndex: 0,
          values: [],
          textAlign: "center"
        }
      ],
      albumSlots: [
        {
          flex: 1,
          defaultIndex: 0,
          values: [],
          textAlign: "center"
        }
      ],
      album: {
        name: "",
        bangumiId: "",
        selectedBangumi: false,
        creator: false,
        cartoon: false,
        poster: []
      },
      image: {
        name: "",
        creator: false,
        selectedBangumi: false,
        selectedAlbum: false,
        data: []
      },
      pendingUpload: 0,
      exceed: 7,
      isSingleModel: true
    };
  },
  computed: {
    albumBangumiPlaceholder() {
      if (this.loadingBangumi) {
        return "加载中...";
      }
      if (!this.bangumiSlots[0].values.length) {
        return "请先关注番剧";
      }
      if (!this.album.selectedBangumi) {
        return "点击选择番剧";
      }
      return this.getSelectedMeta("bangumi", "name");
    },
    imageBangumiPlaceholder() {
      if (this.loadingBangumi) {
        return "加载中...";
      }
      if (!this.bangumiSlots[0].values.length) {
        return "请先关注番剧";
      }
      if (!this.image.selectedBangumi) {
        return "点击选择番剧";
      }
      return this.getSelectedMeta("bangumi", "name");
    },
    imageAlbumPlaceholder() {
      if (this.loadingUserAlbum) {
        return "加载中...";
      }
      if (!this.albumSlots[0].values.length) {
        return "请先创建相册";
      }
      if (!this.image.selectedAlbum) {
        return "点击选择相册";
      }
      return this.getSelectedMeta("album", "name");
    },
    followBangumis() {
      return this.$store.state.users.self.followBangumi;
    },
    pickerDrawerHeaderText() {
      if (this.openBangumisDrawer) {
        return "番剧";
      } else if (this.openImageAlbumDrawer) {
        return "相册";
      }
      return "选项卡";
    },
    user() {
      return this.$store.state.user || {};
    }
  },
  mounted() {
    this.$channel.$on("open-create-image-drawer", () => {
      this.getUserFollowedBangumis();
      this.getUserAlbum();
      this.getUpToken();
      this.show = true;
    });
  },
  methods: {
    switchTab(tab) {
      this.sort = tab;
    },
    handlePosterUploadError(err, file) {
      console.log(err);
      this.album.poster = [];
      this.$toast.error(`图片：${file.name} 上传失败`);
    },
    handleImageUploadError(err, file) {
      console.log(err);
      this.image.data.forEach((item, index) => {
        if (item.id === file.uid) {
          this.image.data.splice(index, 1);
        }
      });
      this.pendingUpload = this.pendingUpload - 1;
      this.$toast.error(`图片：${file.name} 上传失败`);
    },
    handleExceed() {
      this.$toast.error(`最多可上传 ${this.exceed} 张图片!`);
    },
    beforeImageUpload(file) {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      const isFormat =
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].indexOf(
          file.type
        ) !== -1;
      const isLt5M = file.size / 1024 / 1024 < 10;

      if (!isFormat) {
        this.$toast.error("仅支持 jpg / jpeg / png / gif 格式的图片");
        return false;
      }
      if (!isLt5M) {
        this.$toast.error("图片大小不能超过 5MB!");
        return false;
      }
      this.image.data.push({
        name: file.name,
        percentage: 0,
        raw: file,
        size: file.size,
        status: "uploading",
        uid: file.uid
      });
      this.pendingUpload++;

      this.uploadHeaders.key = this.$utils.createFileName({
        userId: this.$store.state.user.id,
        type: "image",
        id: 0,
        file
      });

      return true;
    },
    handleRemoveImage(file) {
      this.image.data.forEach((item, index) => {
        if (item.id === file.uid) {
          this.image.data.splice(index, 1);
        }
      });
    },
    beforeUpload(file) {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      const isFormat =
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].indexOf(
          file.type
        ) !== -1;
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isFormat) {
        this.$toast.error("仅支持 jpg / jpeg / png / gif 格式的图片");
        return false;
      }
      if (!isLt2M) {
        this.$toast.error("图片大小不能超过 5MB!");
        return false;
      }

      this.uploadHeaders.key = this.$utils.createFileName({
        userId: this.$store.state.user.id,
        type: "album",
        id: 0,
        file
      });

      return true;
    },
    switchPickerDrawer(name) {
      this.openBangumisDrawer = false;
      this.openImageAlbumDrawer = false;
      this[name] = true;
      this.openPickerDrawer = true;
    },
    handleImageBangumiPickerBtnClick() {
      if (!this.bangumiSlots[0].values.length) {
        this.$toast.error("还没有关注任何番剧");
        return;
      }
      this.image.selectedBangumi = true;
      this.switchPickerDrawer("openBangumisDrawer");
    },
    handleAlbumBangumiPickerBtnClick() {
      if (!this.bangumiSlots[0].values.length) {
        this.$toast.error("还没有关注任何番剧");
        return;
      }
      this.album.selectedBangumi = true;
      this.switchPickerDrawer("openBangumisDrawer");
    },
    handleAlbumPickerBtnClick() {
      if (this.loadingUserAlbum) {
        this.$toast.error("数据加载中");
        return;
      }
      if (!this.albumSlots[0].values.length) {
        this.$toast.error("还没有创建相册");
        return;
      }
      this.image.selectedAlbum = true;
      this.switchPickerDrawer("openImageAlbumDrawer");
    },
    onBangumiValuesChange(picker, values) {
      if (!values[0]) {
        return;
      }
      const id = values[0].id;
      this.bangumiSlots[0].values.forEach((item, index) => {
        if (item.id === id) {
          this.bangumiSlots[0].defaultIndex = index;
        }
      });
    },
    onAlbumValuesChange(picker, values) {
      if (!values[0]) {
        return;
      }
      const id = values[0].id;
      this.albumSlots[0].values.forEach((item, index) => {
        if (item.id === id) {
          this.albumSlots[0].defaultIndex = index;
        }
      });
    },
    async getUserFollowedBangumis() {
      if (this.followBangumis.length) {
        this.bangumiSlots[0].values = this.bangumiSlots[0].values.concat(
          this.followBangumis
        );
        return;
      }
      if (this.loadingBangumi) {
        return;
      }
      this.loadingBangumi = true;
      try {
        const bangumis = await this.$store.dispatch("users/getFollowBangumis", {
          zone: this.user.zone,
          self: true
        });
        this.bangumiSlots[0].values = this.bangumiSlots[0].values.concat(
          bangumis
        );
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingBangumi = false;
      }
    },
    handleAlbumUploadSuccess(res, file) {
      this.album.poster = [
        {
          name: file.name,
          data: res.data,
          url: this.$resize(res.data.key, { width: 100 })
        }
      ];
    },
    handleAlbumPosterRemove() {
      this.$refs.albumUploader.clearFiles();
    },
    handleImageUploadSuccess(res, file) {
      this.image.data.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.image.data[index] = Object.assign(item, {
            data: res.data,
            status: "success",
            url: this.$resize(res.data.key, { width: 100 })
          });
        }
      });
      this.pendingUpload--;
    },
    async createAlbum() {
      if (!this.album.name) {
        this.$toast.error("请填写相册名字");
        return;
      }
      if (this.album.name.length > 30) {
        this.$toast.error("相册名字请缩减至 30 字以内");
        return;
      }
      if (!this.album.selectedBangumi) {
        this.$toast.error("请选择要投稿的番剧");
        return;
      }
      const poster = this.album.poster.length
        ? this.album.poster[0]["data"]
        : null;
      if (!poster) {
        this.$toast.error("请先上传封面");
        return;
      }
      if (this.submitting) {
        return;
      }
      this.submitting = true;
      this.$toast.loading("创建中");
      const api = new ImageApi(this);
      try {
        const data = await api.createAlbum({
          bangumi_id: this.getSelectedMeta("bangumi", "id"),
          is_cartoon: false,
          name: this.album.name,
          url: poster.key,
          width: poster.width,
          height: poster.height,
          type: poster.type,
          size: poster.size,
          is_creator: this.album.creator,
          part: 0
        });
        this.albumSlots[0].values.unshift(data);
        this.albumSlots[0].defaultIndex = 0;
        this.$toast.success("相册创建成功！");
        this.sort = "image";
        this.image.albumId = data.id;
        this.image.selectedAlbum = true;
        this.album = {
          name: "",
          bangumiId: "",
          selectedBangumi: false,
          creator: false,
          cartoon: false,
          poster: []
        };
        this.$refs.albumUploader.clearFiles();
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.submitting = false;
      }
    },
    async getUserAlbum() {
      if (this.loadingUserAlbum || this.loadedUserAlbum) {
        return;
      }
      this.loadingUserAlbum = true;
      try {
        this.albumSlots[0].values = await this.$store.dispatch(
          "image/userAlbum",
          {
            ctx: this
          }
        );
        this.loadedUserAlbum = true;
      } finally {
        this.loadingUserAlbum = false;
      }
    },
    async createImage() {
      if (!this.image.data.length) {
        this.$toast.error("请先上传图片");
        return;
      }
      if (this.pendingUpload) {
        this.$toast.error("等待图片上传完成");
        return;
      }
      if (this.isSingleModel) {
        if (!this.image.selectedBangumi) {
          this.$toast.error("请选择要投稿的番剧");
          return;
        }
        if (this.image.name.length > 30) {
          this.$toast.error("图片名字请缩减至 30 字以内");
          return;
        }
      } else {
        if (!this.image.selectedAlbum) {
          this.$toast.error("请选择要上传的相册");
          return;
        }
      }
      if (this.submitting) {
        return;
      }
      this.submitting = true;
      this.$toast.loading("上传中...");
      let newId;
      const api = new ImageApi(this);
      try {
        if (this.isSingleModel) {
          const image = this.image.data[0].data;
          newId = await api.uploadSingleImage({
            is_creator: this.image.creator,
            bangumi_id: this.getSelectedMeta("bangumi", "id"),
            name: this.image.name,
            url: image.key,
            width: image.width,
            height: image.height,
            type: image.type,
            size: image.size
          });
        } else {
          newId = this.getSelectedMeta("album", "id");
          await api.uploadManyImage({
            album_id: newId,
            images: this.image.data.map(_ => {
              const image = _.data;
              return {
                url: image.key,
                width: image.width,
                height: image.height,
                type: image.type,
                size: image.size
              };
            })
          });
        }
        this.$refs.imageUploader.clearFiles();
        this.$toast.success("上传成功");
        this.show = false;
        setTimeout(() => {
          window.location = this.$alias.image(newId);
        }, 400);
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.submitting = false;
      }
    },
    getSelectedMeta(name, value) {
      const key = `${name}Slots`;
      if (!this[key][0].values.length) {
        return 0;
      }
      return this[key][0].values[this[key][0].defaultIndex][value];
    }
  }
};
</script>

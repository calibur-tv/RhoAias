<style lang="scss">
.post-write-drawer {
  text-align: left;
  line-height: 40px;

  .title {
    font-size: 16px;
    color: #000;
    line-height: 20px;
  }

  .bangumi {
    font-size: 16px;

    span {
      color: #666;
      float: left;
    }

    div {
      color: #000;
      overflow: hidden;
    }

    .mint-switch {
      height: 40px;
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
    id="write-post"
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
      <div class="bangumi">
        <span>发布到：</span>
        <div
          @click="handleBangumiPickerBtnClick"
          v-text="bangumiPlaceholder"
        />
      </div>
      <div class="bangumi">
        <span>原创：</span>
        <mt-switch v-model="is_creator"/>
      </div>
      <v-drawer
        v-model="openBangumisDrawer"
        class="bangumis-drawer"
        from="bottom"
        size="250px"
        header-text="选择番剧"
      >
        <mt-picker
          :slots="slots"
          value-key="name"
          @change="onValuesChange"
        />
      </v-drawer>
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
  </v-drawer>
</template>

<script>
export default {
  name: "CreatePostDrawer",
  data() {
    return {
      open: false,
      exceed: 4,
      content: "",
      title: "",
      slots: [
        {
          flex: 1,
          defaultIndex: 0,
          values: [],
          textAlign: "center"
        }
      ],
      selectedBangumi: false,
      openBangumisDrawer: false,
      loading: false,
      is_creator: false,
      submitting: false
    };
  },
  computed: {
    bangumiId() {
      return this.$route.name === "bangumi-show"
        ? parseInt(this.$route.params.id, 10)
        : 0;
    },
    currentBangumi() {
      return this.bangumiId ? this.$store.state.bangumi.info : null;
    },
    bangumiPlaceholder() {
      if (this.loading) {
        return "加载中...";
      }
      if (!this.selectedBangumi) {
        return "点击选择番剧";
      }
      return this.slots[0].values[this.slots[0].defaultIndex].name;
    },
    followBangumis() {
      return this.$store.state.users.self.followBangumi;
    }
  },
  watch: {
    open(val) {
      if (val && this.$store.state.login) {
        this.getUpToken();
        this.getUserFollowedBangumis();
      }
    }
  },
  mounted() {
    this.$channel.$on("open-create-post-drawer", data => {
      if (this.slots[0].values.every(_ => _.id !== data.id)) {
        this.slots[0].values.push(data);
      }
      this.saveSelectedBangumi(data.id);
      this.open = true;
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
      if (this.loading) {
        this.$toast.error("番剧加载中");
        return;
      }
      if (!this.title) {
        this.$toast.error("标题不能为空！");
        return;
      }
      this.submitting = true;
      this.$toast.loading("加载中");
      this.$captcha({
        success: async ({ data }) => {
          try {
            const id = await this.$store.dispatch("post/create", {
              title: this.title,
              bangumiId: this.slots[0].values[this.slots[0].defaultIndex].id,
              desc: this.content.substring(0, 120),
              content: this.$utils.convertPureTextToRich(this.content),
              geetest: data,
              is_creator: this.is_creator,
              ctx: this,
              images
            });
            this.title = "";
            this.content = "";
            this.$toast.success("发布成功！");
            this.$channel.$emit("image-upload-done");
            this.open = false;
            window.location = this.$alias.post(id);
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
    onValuesChange(picker, values) {
      if (!values[0]) {
        return;
      }
      this.saveSelectedBangumi(values[0].id);
    },
    saveSelectedBangumi(id) {
      this.slots[0].values.forEach((item, index) => {
        if (item.id === id) {
          this.slots[0].defaultIndex = index;
          this.selectedBangumi = true;
        }
      });
    },
    appendCurrentBangumi() {
      if (
        !this.bangumiId ||
        this.slots[0].values.some(_ => _.id === this.bangumiId)
      ) {
        this.saveSelectedBangumi(this.bangumiId);
        return;
      }
      this.slots[0].values.unshift({
        id: this.currentBangumi.id,
        name: this.currentBangumi.name,
        avatar: this.currentBangumi.avatar
      });
      this.slots[0].defaultIndex = 0;
    },
    async getUserFollowedBangumis() {
      if (this.followBangumis.length) {
        this.slots[0].values = this.slots[0].values.concat(this.followBangumis);
        this.appendCurrentBangumi();
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const bangumis = await this.$store.dispatch("users/getFollowBangumis", {
          zone: this.$store.state.user.zone,
          self: true
        });
        this.slots[0].values = this.slots[0].values.concat(bangumis);
        this.$nextTick(() => {
          this.appendCurrentBangumi();
        });
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loading = false;
      }
    },
    handleBangumiPickerBtnClick() {
      if (!this.slots[0].values.length) {
        this.$toast.error("还没有关注任何番剧");
        return;
      }
      this.openBangumisDrawer = true;
    }
  }
};
</script>

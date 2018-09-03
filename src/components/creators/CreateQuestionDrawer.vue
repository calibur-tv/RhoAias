<style lang="scss">
#create-question-form {
  .el-form-item {
    margin-bottom: 10px;

    input {
      border-top: none;
      border-left: none;
      border-right: none;
    }
  }
}
</style>

<template>
  <v-drawer
    v-model="show"
    from="bottom"
    size="100%"
    header-text="提问"
  >
    <div class="container">
      <el-form
        id="create-question-form"
        ref="form"
        :model="form"
        :rules="rules"
        :disabled="submitting"
        label-width="45px"
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input
            v-model.trim="form.title"
            maxlength="30"
            placeholder="问题标题"
          />
        </el-form-item>
        <el-form-item
          label="番剧"
          prop="tags"
        >
          <bangumi-picker
            v-if="show"
            v-model="form.bangumiId"
            :label="false"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="content"
        >
          <el-input
            v-model.trim="form.content"
            :rows="5"
            placeholder="问题背景，条件等详细信息"
            type="textarea"
            maxlength="1000"
          />
        </el-form-item>
        <el-form-item label="图片">
          <image-uploader
            :loading="submitting"
            :limit="exceed"
            :required="false"
            @submit="submit"
          />
        </el-form-item>
      </el-form>
    </div>
  </v-drawer>
</template>

<script>
import uploadMixin from "~/mixins/upload";
import Api from "~/api/questionApi";
import BangumiPicker from "~/components/bangumi/BangumiPicker";

export default {
  name: "CreateQuestionDrawer",
  components: {
    BangumiPicker
  },
  mixins: [uploadMixin],
  data() {
    const validateTitle = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入问题标题"));
      }
      if (value.length > 30) {
        callback(new Error("标题最多 30 个字"));
      }
      callback();
    };
    const validateBangumi = (rule, value, callback) => {
      if (!value) {
        callback(new Error("至少选择 1 个番剧"));
      }
      callback();
    };
    return {
      form: {
        title: "",
        bangumiId: "",
        content: ""
      },
      rules: {
        title: [{ validator: validateTitle, trigger: "change" }],
        bangumiId: [{ validator: validateBangumi, trigger: "submit" }]
      },
      exceed: 7,
      submitting: false,
      show: false
    };
  },
  mounted() {
    this.$channel.$on("drawer-open-write-question", () => {
      this.show = true;
      this.getUpToken();
    });
  },
  methods: {
    submit(images) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.submitting) {
            return;
          }
          this.submitting = true;
          this.$captcha({
            success: async ({ data }) => {
              const api = new Api(this);
              try {
                const id = await api.createQuestion({
                  title: this.form.title,
                  tags: [this.form.bangumiId],
                  intro: this.form.content.substring(0, 120),
                  content: this.form.content,
                  images,
                  geetest: data
                });
                this.images = [];
                this.$emit("submit");
                this.$toast.success("提交成功！");
                window.location = this.$alias.question(id);
                this.submitting = false;
              } catch (err) {
                this.$toast.error(err);
                this.submitting = false;
              }
            },
            error: e => {
              this.submitting = false;
              this.$toast.error(e);
            },
            close: () => {
              this.submitting = false;
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

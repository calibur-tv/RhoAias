<style lang="scss">
.report-drawer {
  p {
    font-size: 12px;
    padding: 8px;
    color: #888;
  }

  textarea {
    min-height: 120px;
    background-color: #fafafa;
    padding: 10px;
  }

  .submit-btn {
    margin-top: 15px;
    margin-bottom: 30px;
    width: 100%;
  }
}
</style>

<template>
  <v-drawer
    v-model="show"
    :header-text="drawerTitle"
    :backdrop="false"
    from="bottom"
    size="100%"
    class="report-drawer"
  >
    <div class="container">
      <v-radio
        v-model="selectedType"
        :options="options1"
        title="违反法律法规"/>
      <v-radio
        v-model="selectedType"
        :options="options2"
        title="侵犯个人权益"/>
      <v-radio
        v-model="selectedType"
        :options="options3"
        title="有害社区环境"/>
      <div v-if="needContent">
        <p>留言：</p>
        <textarea
          v-model.trim="content"
          placeholder="请说明情况"/>
      </div>
      <el-button
        :loading="loading"
        type="primary"
        class="submit-btn"
        @click="submit"
      >提交</el-button>
    </div>
  </v-drawer>
</template>

<script>
import Api from "~/api/userApi";

export default {
  name: "ReportDrawer",
  data() {
    return {
      show: false,
      title: "",
      id: 0,
      model: 0,
      selectedType: -1,
      isCreator: false,
      loading: false,
      content: ""
    };
  },
  computed: {
    drawerTitle() {
      return this.title || "举报";
    },
    options1() {
      return [
        {
          label: "违法违规",
          value: 1
        },
        {
          label: "色情低俗",
          value: 2
        },
        {
          label: "赌博诈骗",
          value: 3
        }
      ];
    },
    options2() {
      const result = [
        {
          label: "人身攻击",
          value: 4
        },
        {
          label: "侵犯隐私",
          value: 5
        }
      ];
      if (this.isCreator) {
        result.push({
          label: "内容抄袭",
          value: 6
        });
      }
      return result;
    },
    options3() {
      return [
        {
          label: "垃圾广告",
          value: 7
        },
        {
          label: "恶意引战",
          value: 8
        },
        {
          label: "重复内容/刷屏",
          value: 9
        },
        {
          label: "内容不相关",
          value: 10
        },
        {
          label: "互刷金币",
          value: 11
        },
        {
          label: "其它",
          value: 99
        }
      ];
    },
    needContent() {
      return this.selectedType === 99 || this.selectedType === 6;
    }
  },
  mounted() {
    this.$channel.$on(
      "open-report-drawer",
      ({ id, model, title, isCreator }) => {
        this.id = id;
        this.model = model;
        this.title = title;
        this.isCreator = isCreator;
        this.show = true;
      }
    );
  },
  methods: {
    async submit() {
      if (this.selectedType < 0) {
        this.$toast.error("请选择正确的分类");
        return;
      }
      if (this.needContent && !this.content) {
        this.$toast.error("请填写具体情况");
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      const api = new Api(this);
      try {
        api.report({
          id: this.id,
          message: this.content,
          type: this.selectedType === 99 ? 0 : this.selectedType,
          model: this.model
        });
      } finally {
        this.loading = false;
        this.$toast.success("感谢您的反馈！");
        this.show = false;
        this.content = "";
        this.selectedType = -1;
      }
    }
  }
};
</script>

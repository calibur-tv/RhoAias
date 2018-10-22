<style lang="scss">
.comment-create-form {
  .content {
    font-size: 16px;
    line-height: 24px;
    color: #000;
    font-weight: 400;
    height: 250px;
    margin-bottom: 5px;
  }

  .submit-btn {
    margin-top: 15px;
    width: 100%;
  }
}
</style>

<template>
  <div class="comment-create-form">
    <textarea
      v-model.trim="content"
      class="content"
      placeholder="来吧，尽情的（在1000字以内）发挥吧"
      maxlength="1000"
      @focus="handleAreaFocus"
    />
    <el-button 
      :loading="submitting" 
      class="submit-btn" 
      type="primary" 
      @click="submit">发布</el-button>
  </div>
</template>

<script>
import scrollToY from "~/assets/js/scrollToY";

export default {
  name: "CommentCreateForm",
  props: {
    type: {
      required: true,
      type: String
    },
    id: {
      required: true,
      type: Number
    },
    masterId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      content: ""
    };
  },
  computed: {
    isGuest() {
      return !this.$store.state.login;
    },
    submitting() {
      return this.$store.state.comment.submitting;
    }
  },
  methods: {
    async submit() {
      if (this.isGuest) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (!this.content) {
        this.$emit("close");
        return;
      }
      if (this.submitting) {
        return;
      }
      this.$store.commit("comment/SET_SUBMITTING", { result: true });
      try {
        const result = await this.$store.dispatch("comment/createMainComment", {
          content: this.content,
          images: [],
          type: this.type,
          id: this.id,
          ctx: this
        });
        this.$toast.success(result.message);
        this.$store.commit("UPDATE_USER_EXP", result.exp);
        this.$emit("submit");
        this.content = "";
        setTimeout(() => {
          const dom = document.getElementById(`comment-${result.data.id}`);
          dom && scrollToY(this.$utils.getOffsetTop(dom) - 100, 600);
        }, 400);
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.$store.commit("comment/SET_SUBMITTING", { result: false });
      }
    },
    handleAreaFocus() {
      document.body.scrollTop = 0;
    }
  }
};
</script>

export default {
  methods: {
    async getUpToken() {
      if (!this.$store.state.login) {
        return;
      }
      try {
        await this.$store.dispatch("getUpToken", this);
        this.$channel.$emit("update-upload-token");
      } catch (e) {
        this.$toast.error(e);
      }
    }
  }
};

export default {
  methods: {
    async getUpToken() {
      try {
        await this.$store.dispatch("getUpToken", this);
        this.$channel.$emit("update-upload-token");
      } catch (e) {
        this.$toast.error(e);
      }
    }
  }
};

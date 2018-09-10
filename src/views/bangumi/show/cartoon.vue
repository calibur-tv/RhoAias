<template>
  <bangumi-cartoon-flow/>
</template>

<script>
import BangumiCartoonFlow from "~/components/bangumi/flows/BangumiCartoonFlow";

export default {
  name: "BangumiCartoon",
  async asyncData({ route, store, ctx }) {
    await store.dispatch("bangumi/getCartoons", {
      ctx,
      bangumiId: route.params.id
    });
  },
  components: {
    BangumiCartoonFlow
  }
};
</script>

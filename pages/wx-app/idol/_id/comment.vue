<template>
  <div id="wx-app-idol-comment">
    <div class="container">
      <CommentMain
        :id="id"
        :master-id="1"
        type="role"
      />
    </div>
  </div>
</template>

<script>
import CommentMain from '~/components/comments/CommentMain'

export default {
  name: 'WxAppIdolComment',
  components: {
    CommentMain
  },
  props: {
    id: {
      type: String,
      require: true
    }
  },
  async asyncData({ store, query, params, error }) {
    try {
      await store.dispatch('comment/getMainComments', {
        id: params.id,
        type: 'role',
        onlySeeMaster: 0
      })
    } catch (e) {
      error({
        statusCode: e.statusCode,
        message: e.message
      })
    }
  },
}
</script>

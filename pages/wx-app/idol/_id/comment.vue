<template>
  <div id="wx-app-idol-comment">
    <div class="container">
      <CommentMain
        :id="$route.params.id"
        :master-id="1"
        :lazy="false"
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
  async asyncData({ store, params, error }) {
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
  }
}
</script>

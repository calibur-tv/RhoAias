<style lang="scss">
#app-notice {
  margin-top: 15px;

  .title {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 10px;
    margin-top: 0;
    font-weight: normal;
    @extend %breakWord;
  }

  .footer {
    text-align: right;
    font-size: 13px;
    padding: 30px 15px;
    color: #969696;
  }
}
</style>

<template>
  <div id="app-notice">
    <div class="container">
      <h1 class="title" v-text="notice.title" />
    </div>
    <json-content :content="notice.content" />
    <footer class="footer">
      <template v-if="notice.created_at === notice.updated_at">
        <span>发布于：</span><v-time v-model="notice.created_at" />
      </template>
      <template v-else>
        <span>编辑于：</span><v-time v-model="notice.updated_at" />
      </template>
    </footer>
  </div>
</template>

<script>
import JsonContent from '~/components/jsonEditor/JsonContent'
import { getNoticeInfo } from '~/api/noticeApi'

export default {
  name: 'NoticeShow',
  layout: 'empty',
  components: {
    JsonContent
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      notice: null
    }
  },
  asyncData({ app, params, error }) {
    return getNoticeInfo(app, {
      id: params.id
    })
      .then(notice => {
        return { notice }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  }
}
</script>

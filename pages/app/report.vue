<style lang="scss">
#app-report {
  .submit-btn,
  .mint-radio .mint-radio-input:checked + .mint-radio-core {
    background-color: #ff6881 !important;
    border-color: #ff6881 !important;
  }
}
</style>

<template>
  <div id="app-report">
    <user-report-form
      :id="id"
      :model="model"
    />
  </div>
</template>

<script>
import UserReportForm from '~/components/user/UserReportForm'

export default {
  name: 'AppReport',
  layout: 'empty',
  head: {
    title: '举报'
  },
  components: {
    UserReportForm
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    model() {
      return this.$route.query.type
    }
  }
}
</script>

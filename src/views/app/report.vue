<template>
  <user-report-form
    :id="id"
    :model="model"
  />
</template>

<script>
import UserReportForm from '~/components/user/UserReportForm'

export default {
  name: 'AppReport',
  components: {
    UserReportForm
  },
  head: {
    title: '举报'
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

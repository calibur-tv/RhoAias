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
    <user-report-form :id="id" :model="model" @success="show = false" />
  </v-drawer>
</template>

<script>
import UserReportForm from '~/components/user/UserReportForm'

export default {
  name: 'ReportDrawer',
  components: {
    UserReportForm
  },
  data() {
    return {
      show: false,
      title: '',
      id: 0,
      model: 0,
      isCreator: false
    }
  },
  computed: {
    drawerTitle() {
      return this.title || '举报'
    }
  },
  mounted() {
    this.$channel.$on(
      'open-report-drawer',
      ({ id, model, title, isCreator }) => {
        this.id = id
        this.model = model
        this.title = title
        this.isCreator = isCreator
        this.show = true
      }
    )
  }
}
</script>

<template>
  <div id="layout-default">
    <v-header />
    <nuxt class="main-view" />
    <feedback-drawer />
    <share-drawer />
    <report-drawer />
    <sign-drawer />
  </div>
</template>

<script>
import vHeader from '~/components/layouts/Header'
import FeedbackDrawer from '~/components/drawers/FeedbackDrawer'
import ShareDrawer from '~/components/drawers/ShareDrawer'
import ReportDrawer from '~/components/drawers/ReportDrawer'
import SignDrawer from '~/components/common/Sign'

export default {
  name: 'DefaultLayout',
  components: {
    vHeader,
    FeedbackDrawer,
    ShareDrawer,
    ReportDrawer,
    SignDrawer
  },
  mounted() {
    this.$store.dispatch('initAuth')
  }
}
</script>

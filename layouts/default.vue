<template>
  <div id="layout-default">
    <v-header />
    <nuxt class="main-view" />
    <feedback-drawer />
    <report-drawer />
    <sign-drawer />
    <gift-modal />
  </div>
</template>

<script>
import vHeader from '~/components/layouts/Header'
import FeedbackDrawer from '~/components/drawers/FeedbackDrawer'
import ReportDrawer from '~/components/drawers/ReportDrawer'
import SignDrawer from '~/components/common/Sign'
import GiftModal from '~/components/common/GiftModal'

export default {
  name: 'DefaultLayout',
  components: {
    vHeader,
    FeedbackDrawer,
    ReportDrawer,
    SignDrawer,
    GiftModal
  },
  mounted() {
    this.$store.dispatch('initAuth')
    this.$store.dispatch('bangumi/getAllBangumi')
  }
}
</script>

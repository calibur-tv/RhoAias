<template>
  <div id="layout-default">
    <v-header />
    <nuxt class="main-view" />
    <FeedbackDrawer />
    <ReportDrawer />
    <SignDrawer />
    <GiftModal />
  </div>
</template>

<script>
import vHeader from '~/components/layouts/Header'
import FeedbackDrawer from '~/components/drawers/FeedbackDrawer'
import ReportDrawer from '~/components/drawers/ReportDrawer'
import SignDrawer from '~/components/common/Sign'
import GiftModal from '~/components/common/GiftModal'
import clientAuth from '~/mixins/clientAuth'

export default {
  name: 'DefaultLayout',
  components: {
    vHeader,
    FeedbackDrawer,
    ReportDrawer,
    SignDrawer,
    GiftModal
  },
  mixins: [clientAuth],
  mounted() {
    this.$store.dispatch('bangumi/getAllBangumi')
  }
}
</script>

import sentry from '~/assets/js/sentry'
import Toast from '~/assets/js/Toast'
import SNSShare from '~/assets/js/SNS/share'

export default ({ store }) => {
  const { pageData, ua } = store.state
  window.M = window.M || Object.create(null)

  M.sentry = sentry
  M.toast = new Toast()
  const SNS = new SNSShare({ config: pageData, ua })
  M.shareData = SNS.initShareData()
  pageData && SNS.initShareSDK()
}

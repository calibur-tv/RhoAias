import sentry from '~/assets/js/sentry'
import Toast from '~/assets/js/Toast'
import SNSShare from '~/assets/js/SNS/share'
import Invoker from '~/assets/js/Invoker'
import Cookies from 'js-cookie'

export default ({ store }) => {
  const { pageData, ua } = store.state
  window.M = window.M || Object.create(null)

  M.sentry = sentry
  M.toast = new Toast()
  const SNS = new SNSShare({ config: pageData, ua })
  M.shareData = SNS.initShareData()
  pageData && SNS.initShareSDK()

  const appName = Cookies.get('x-app-name') || ''
  const appVersion = Cookies.get('x-app-version') || ''

  M.invoker = new Invoker({ appName, appVersion })
}

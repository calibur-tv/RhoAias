import sentry from '~/assets/js/sentry'
import Toast from '~/assets/js/Toast'
import SNSShare from '~/assets/js/SNS/share'
import Invoker from '~/assets/js/Invoker'

export default ({ store }) => {
  const search = window.location.search
  store.commit(
    'SET_SOURCE',
    /from=/.test(search) ? search.split('from=')[1].split('&')[0] : ''
  )
  store.commit('SET_UA', window.navigator.userAgent.toLowerCase())
  const { OAuthData, ua } = store.state
  window.M = window.M || Object.create(null)

  M.sentry = sentry
  M.toast = new Toast()
  const SNS = new SNSShare({ config: OAuthData, ua })
  M.shareData = SNS.initShareData()
  OAuthData && SNS.initShareSDK()

  const pageData =
    JSON.parse(
      document.querySelector('script[data-name="page-data"]').textContent
    ) || {}
  const { appName, appVersion } = pageData

  M.invoker = new Invoker({ appName, appVersion })
}

import sentry from '~/assets/js/sentry'
import Toast from '~/assets/js/Toast'

window.M = window.M || Object.create(null)

M.sentry = sentry
M.toast = new Toast()

const baseUrl = {
  API_URL: {
    development: 'http://localhost:3099/',
    staging: 'http://localhost/',
    production: 'http://localhost/'
  },
  API_URL_BROWSER: {
    development: 'http://localhost:3099/',
    staging: 'http://t-api.calibur.tv/',
    production: 'https://api.calibur.tv/'
  }
}

const SHARE_KEY = 'the-world'
const AUTH_KEY = ''

module.exports = {
  baseUrl,
  SHARE_KEY,
  AUTH_KEY
}

const host = {
  development: 'https://t-api.calibur.tv/',
  staging: 'https://t-api.calibur.tv/',
  production: 'https://api.calibur.tv'
}

const timeout = {
  server: 60000,
  client: 30000
}

const script = {
  baiduStat: '',
  baiduPush: '',
  google: ''
}

const env = process.env.NODE_ENV

module.exports = {
  host,
  timeout,
  env,
  script
}

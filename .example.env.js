const dev = process.env.NODE_ENV === 'development'

const script = {
  baiduStat : ''
}

const host = {
  dev: '/',
  prod: '/'
}

module.exports = {
  dev,
  host,
  script
}

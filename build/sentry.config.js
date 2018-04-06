const config = require('../.env').sentry

module.exports = {
  url: 'https://sentry.io/api/0/projects/',
  org: 'sentry',
  include: /\.js(\.map)?$/,
  project: 'RhoAias',
  token: config.token
}

module.exports = {
  apps: [
    {
      name: 'RhoAias',
      script: './server/index.js',
      watch: false,
      ignore_watch: 'node_modules',
      env: {
        NODE_ENV: 'development'
      },
      env_staging: {
        NODE_ENV: 'staging'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}

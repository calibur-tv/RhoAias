const autoprefixer = require('autoprefixer')

module.exports = () => ({
  plugins: [
    autoprefixer({
      browsers: [
        'defaults'
      ],
      remove: false
    })
  ]
})
